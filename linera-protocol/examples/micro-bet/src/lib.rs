// Micro-Bet Application ABI
// Instant-Reaction Micro-Bets for Linera

use async_graphql::{Request, Response, SimpleObject};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::{AccountOwner, Amount, ContractAbi, ServiceAbi, Timestamp},
};
use serde::{Deserialize, Serialize};

pub struct MicroBetAbi;

impl ContractAbi for MicroBetAbi {
    type Operation = Operation;
    type Response = ();
}

impl ServiceAbi for MicroBetAbi {
    type Query = Request;
    type QueryResponse = Response;
}

/// The instantiation data required to create a micro-bet application.
#[derive(Clone, Copy, Debug, Deserialize, Serialize, SimpleObject)]
pub struct InstantiationArgument {
    /// The fungible token application ID to use for bets
    #[graphql(skip)]
    pub fungible_app_id: linera_sdk::linera_base_types::ApplicationId<fungible::FungibleTokenAbi>,
    pub _dummy: Option<i32>,
}

impl std::fmt::Display for InstantiationArgument {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(
            f,
            "{}",
            serde_json::to_string(self).expect("Serialization failed")
        )
    }
}

/// Operations that can be executed by the application.
#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    /// Create a new micro-bet market
    CreateBet {
        question: String,
        duration_seconds: u64,
    },
    /// Place a bet (Yes or No)
    PlaceBet {
        bet_id: String,
        side: bool, // true = Yes, false = No
        amount: Amount,
    },
    /// Close a bet (stop accepting new bets)
    CloseBet { bet_id: String },
    /// Resolve a bet with the outcome
    ResolveBet {
        bet_id: String,
        outcome: bool, // true = Yes won, false = No won
    },
}

/// Messages that can be exchanged across chains.
#[derive(Debug, Deserialize, Serialize)]
pub enum Message {
    /// Distribute winnings to a winner
    DistributeWinnings {
        bet_id: String,
        owner: AccountOwner,
        amount: Amount,
    },
}

