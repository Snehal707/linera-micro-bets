// StormCast Micro-Bet Contract
// Handles bet creation, placement, and resolution

#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use linera_sdk::{
    linera_base_types::{AccountOwner, Amount, WithContractAbi},
    views::{RootView, View},
    Contract, ContractRuntime,
};
use micro_bet::{Bet, BetStatus, InstantiationArgument, Message, Operation, UserBet, MicroBetAbi};
use state::MicroBetState;

pub struct MicroBetContract {
    state: MicroBetState,
    runtime: ContractRuntime<Self>,
}

linera_sdk::contract!(MicroBetContract);

impl WithContractAbi for MicroBetContract {
    type Abi = MicroBetAbi;
}

impl Contract for MicroBetContract {
    type Message = Message;
    type InstantiationArgument = InstantiationArgument;
    type Parameters = ();
    type EventValue = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = MicroBetState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        MicroBetContract { state, runtime }
    }

    async fn instantiate(&mut self, argument: InstantiationArgument) {
        self.state.instantiation_argument.set(Some(argument));
        self.state.bet_counter.set(0);
    }

    async fn execute_operation(&mut self, operation: Operation) -> Self::Response {
        match operation {
            Operation::CreateBet { question, duration_seconds } => {
                self.create_bet(question, duration_seconds).await;
            }
            Operation::PlaceBet { bet_id, side, amount } => {
                self.place_bet(bet_id, side, amount).await;
            }
            Operation::CloseBet { bet_id } => {
                self.close_bet(bet_id).await;
            }
            Operation::ResolveBet { bet_id, outcome } => {
                self.resolve_bet(bet_id, outcome).await;
            }
        }
    }

    async fn execute_message(&mut self, message: Message) {
        match message {
            Message::SyncBet { bet } => {
                // Store synced bet from another chain
                let bet_id = bet.id.clone();
                self.state.bets.insert(&bet_id, bet)
                    .expect("Failed to store synced bet");
            }
        }
    }

    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
}

impl MicroBetContract {
    /// Create a new prediction market bet
    async fn create_bet(&mut self, question: String, duration_seconds: u64) {
        let bet_id = self.state.next_bet_id();
        let creator = self.runtime.authenticated_signer()
            .expect("Operation must be authenticated")
            .into();
        let now = self.runtime.system_time();
        let expires_at = now.saturating_add(linera_sdk::linera_base_types::TimeDelta::from_micros(duration_seconds * 1_000_000));

        let bet = Bet {
            id: bet_id.clone(),
            question,
            yes_pool: Amount::ZERO,
            no_pool: Amount::ZERO,
            status: BetStatus::Open,
            creator,
            resolution: None,
            created_at: now,
            expires_at,
        };

        self.state.bets.insert(&bet_id, bet)
            .expect("Failed to insert bet");
    }

    /// Place a bet on an existing market
    async fn place_bet(&mut self, bet_id: String, side: bool, amount: Amount) {
        assert!(amount > Amount::ZERO, "Bet amount must be positive");

        let mut bet = self.state.bets.get(&bet_id)
            .await
            .expect("Failed to read bet")
            .expect("Bet not found");

        assert_eq!(bet.status, BetStatus::Open, "Bet is not open");
        assert!(
            self.runtime.system_time() < bet.expires_at,
            "Bet has expired"
        );

        // Update the pool
        if side {
            bet.yes_pool.saturating_add_assign(amount);
        } else {
            bet.no_pool.saturating_add_assign(amount);
        }

        self.state.bets.insert(&bet_id, bet)
            .expect("Failed to update bet");

        // Record user's bet
        let owner: AccountOwner = self.runtime.authenticated_signer()
            .expect("Operation must be authenticated")
            .into();
        let user_bet = UserBet {
            bet_id: bet_id.clone(),
            owner,
            side,
            amount,
            timestamp: self.runtime.system_time(),
        };

        let mut user_bets = self.state.user_bets.get(&owner)
            .await
            .expect("Failed to read user bets")
            .unwrap_or_default();
        user_bets.push(user_bet);
        self.state.user_bets.insert(&owner, user_bets)
            .expect("Failed to update user bets");
    }

    /// Close a bet (stop accepting new wagers)
    async fn close_bet(&mut self, bet_id: String) {
        let mut bet = self.state.bets.get(&bet_id)
            .await
            .expect("Failed to read bet")
            .expect("Bet not found");

        let caller: AccountOwner = self.runtime.authenticated_signer()
            .expect("Operation must be authenticated")
            .into();

        // Only creator or admin can close
        let is_admin = self.state.instantiation_argument.get()
            .as_ref()
            .and_then(|arg| arg.admin)
            .map(|admin| admin == caller)
            .unwrap_or(false);

        assert!(
            bet.creator == caller || is_admin,
            "Only creator or admin can close bet"
        );

        assert_eq!(bet.status, BetStatus::Open, "Bet is not open");

        bet.status = BetStatus::Closed;
        self.state.bets.insert(&bet_id, bet)
            .expect("Failed to update bet");
    }

    /// Resolve a bet with the outcome
    async fn resolve_bet(&mut self, bet_id: String, outcome: bool) {
        let mut bet = self.state.bets.get(&bet_id)
            .await
            .expect("Failed to read bet")
            .expect("Bet not found");

        let caller: AccountOwner = self.runtime.authenticated_signer()
            .expect("Operation must be authenticated")
            .into();

        // Only creator or admin can resolve
        let is_admin = self.state.instantiation_argument.get()
            .as_ref()
            .and_then(|arg| arg.admin)
            .map(|admin| admin == caller)
            .unwrap_or(false);

        assert!(
            bet.creator == caller || is_admin,
            "Only creator or admin can resolve bet"
        );

        assert!(
            bet.status == BetStatus::Open || bet.status == BetStatus::Closed,
            "Bet has already been resolved"
        );

        bet.status = BetStatus::Resolved;
        bet.resolution = Some(outcome);
        self.state.bets.insert(&bet_id, bet)
            .expect("Failed to update bet");
    }
}
