// Micro-Bet Contract Logic
// Handles bet creation, placement, resolution, and payouts

#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use crate::state::{Bet, BetStatus, MicroBet, MicroBetState};
use micro_bet::{InstantiationArgument, Message, Operation};
use fungible::FungibleTokenAbi;
use linera_sdk::{
    abis::fungible::FungibleOperation,
    linera_base_types::{Account, AccountOwner, Amount, ApplicationId, TimeDelta, WithContractAbi},
    views::{RootView, View},
    Contract, ContractRuntime,
};
pub struct MicroBetContract {
    state: MicroBetState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(MicroBetContract);

impl WithContractAbi for MicroBetContract {
    type Abi = micro_bet::MicroBetAbi;
}

impl Contract for MicroBetContract {
    type Message = Message;
    type InstantiationArgument = InstantiationArgument;
    type Parameters = ApplicationId<fungible::FungibleTokenAbi>;
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = MicroBetState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        MicroBetContract { state, runtime }
    }

    async fn instantiate(&mut self, argument: InstantiationArgument) {
        // Store the fungible app ID
        self.state.fungible_app_id.set(Some(argument.fungible_app_id));
    }

    async fn execute_operation(&mut self, operation: Operation) -> Self::Response {
        match operation {
            Operation::CreateBet {
                question,
                duration_seconds,
            } => self.create_bet(question, duration_seconds).await,
            Operation::PlaceBet { bet_id, side, amount } => {
                self.place_bet(bet_id, side, amount).await
            }
            Operation::CloseBet { bet_id } => self.close_bet(bet_id).await,
            Operation::ResolveBet { bet_id, outcome } => {
                self.resolve_bet(bet_id, outcome).await
            }
        }
    }

    async fn execute_message(&mut self, message: Message) {
        match message {
            Message::DistributeWinnings {
                bet_id: _,
                owner,
                amount,
            } => {
                // Distribute winnings to the winner
                self.send_to(amount, owner);
            }
        }
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

impl MicroBetContract {
    fn fungible_id(&self) -> ApplicationId<FungibleTokenAbi> {
        self.state
            .fungible_app_id
            .get()
            .expect("Fungible app ID not set")
    }

    /// Creates a new micro-bet market.
    async fn create_bet(&mut self, question: String, duration_seconds: u64) {
        // Generate unique bet ID (using chain ID and timestamp)
        let bet_id = format!(
            "{}_{}",
            self.runtime.chain_id(),
            self.runtime.system_time().micros() / 1000
        );

        let created_at = self.runtime.system_time();
        let expires_at = created_at.saturating_add(TimeDelta::from_secs(duration_seconds));

        let creator = self.runtime.authenticated_owner().unwrap_or_else(|| {
            self.runtime
                .application_id()
                .into()
        });

        let micro_bet = MicroBet::new(bet_id.clone(), question, creator, created_at, expires_at);

        self.state
            .bets
            .insert(&bet_id, micro_bet)
            .expect("Failed to insert bet");
    }

    /// Places a bet (Yes or No).
    async fn place_bet(&mut self, bet_id: String, side: bool, amount: Amount) {
        assert!(amount > Amount::ZERO, "Bet amount must be greater than zero");

        // Get the bet
        let mut bet = self
            .state
            .bets
            .get(&bet_id)
            .await
            .expect("Failed to get bet")
            .expect("Bet not found");

        // Validate bet is open
        assert_eq!(
            bet.status,
            BetStatus::Open,
            "Bet is not open for betting"
        );

        // Check bet hasn't expired
        assert!(
            self.runtime.system_time() < bet.expires_at,
            "Bet has expired"
        );

        // Get the bettor
        let owner = self.runtime.authenticated_owner().unwrap_or_else(|| {
            self.runtime
                .application_id()
                .into()
        });

        // Transfer tokens from user to the contract
        self.receive_from_account(owner, amount);

        // Update pools
        if side {
            bet.yes_pool = bet.yes_pool.saturating_add(amount);
        } else {
            bet.no_pool = bet.no_pool.saturating_add(amount);
        }

        // Save updated bet
        self.state
            .bets
            .insert(&bet_id, bet)
            .expect("Failed to update bet");

        // Record individual bet
        let bet_key = format!("{}:{}:{}", bet_id, owner, side);
        let user_bet = Bet {
            bet_id: bet_id.clone(),
            owner,
            side,
            amount,
            timestamp: self.runtime.system_time(),
        };

        self.state
            .user_bets
            .insert(&bet_key, user_bet)
            .expect("Failed to record user bet");
    }

    /// Closes a bet (stops accepting new bets).
    async fn close_bet(&mut self, bet_id: String) {
        let mut bet = self
            .state
            .bets
            .get(&bet_id)
            .await
            .expect("Failed to get bet")
            .expect("Bet not found");

        assert_eq!(
            bet.status,
            BetStatus::Open,
            "Bet is not open"
        );

        bet.status = BetStatus::Closed;

        self.state
            .bets
            .insert(&bet_id, bet)
            .expect("Failed to update bet");
    }

    /// Resolves a bet and distributes winnings.
    async fn resolve_bet(&mut self, bet_id: String, outcome: bool) {
        let mut bet = self
            .state
            .bets
            .get(&bet_id).await.expect("Failed to get bet")
            .expect("Bet not found");

        assert_eq!(
            bet.status,
            BetStatus::Closed,
            "Bet must be closed before resolution"
        );

        assert!(
            bet.resolution.is_none(),
            "Bet has already been resolved"
        );

        // Set resolution
        bet.resolution = Some(outcome);
        bet.status = BetStatus::Resolved;

        // Calculate winnings
        let total_pool = bet.total_pool();
        let winner_pool = if outcome {
            bet.yes_pool
        } else {
            bet.no_pool
        };

        if winner_pool > Amount::ZERO && total_pool > Amount::ZERO {
            // Find all winners and distribute proportionally
            let mut winners = Vec::new();

            // Iterate through all user bets for this bet
            self.state
                .user_bets
                .for_each_index_value(|key, user_bet| {
                    let user_bet = user_bet.into_owned();
                    if user_bet.bet_id == bet_id && user_bet.side == outcome {
                        winners.push(user_bet);
                    }
                    Ok(())
                })
                .await
                .expect("Failed to iterate user bets");

            // Distribute winnings proportionally
            for winner in winners {
                let share = (winner.amount.to_attos() * total_pool.to_attos())
                    .checked_div(winner_pool.to_attos())
                    .unwrap_or(0);
                let winnings = Amount::from_attos(share);

                // Send winnings via cross-chain message if needed
                let target_chain = self.runtime.chain_id();
                self.runtime
                    .prepare_message(Message::DistributeWinnings {
                        bet_id: bet_id.clone(),
                        owner: winner.owner,
                        amount: winnings,
                    })
                    .with_authentication()
                    .send_to(target_chain);
            }
        }

        // Save updated bet
        self.state
            .bets
            .insert(&bet_id, bet)
            .expect("Failed to update bet");
    }

    /// Transfers tokens from the contract to an owner.
    fn send_to(&mut self, amount: Amount, owner: AccountOwner) {
        let target_account = Account {
            chain_id: self.runtime.chain_id(),
            owner,
        };
        let transfer = FungibleOperation::Transfer {
            owner: self.runtime.application_id().into(),
            amount,
            target_account,
        };
        let fungible_id = self.fungible_id();
        self.runtime.call_application(true, fungible_id, &transfer);
    }

    /// Receives tokens from an account into the contract.
    fn receive_from_account(&mut self, owner: AccountOwner, amount: Amount) {
        let target_account = Account {
            chain_id: self.runtime.chain_id(),
            owner: self.runtime.application_id().into(),
        };
        let transfer = FungibleOperation::Transfer {
            owner,
            amount,
            target_account,
        };
        let fungible_id = self.fungible_id();
        self.runtime.call_application(true, fungible_id, &transfer);
    }
}

