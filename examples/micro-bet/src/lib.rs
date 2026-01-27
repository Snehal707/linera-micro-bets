// StormCast Micro-Bet Application ABI
// A prediction market for environmental events on Linera

use async_graphql::{Request, Response, SimpleObject, InputObject};
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

/// The instantiation argument (empty for this contract)
#[derive(Clone, Debug, Default, Deserialize, Serialize, SimpleObject)]
pub struct InstantiationArgument {
    /// Optional owner who can resolve bets
    pub admin: Option<AccountOwner>,
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

/// A prediction market bet
#[derive(Clone, Debug, Deserialize, Serialize, SimpleObject)]
pub struct Bet {
    /// Unique identifier for the bet
    pub id: String,
    /// The question being bet on
    pub question: String,
    /// Total amount bet on YES
    pub yes_pool: Amount,
    /// Total amount bet on NO
    pub no_pool: Amount,
    /// Current status of the bet
    pub status: BetStatus,
    /// The creator of the bet
    pub creator: AccountOwner,
    /// The resolution (true = YES won, false = NO won)
    pub resolution: Option<bool>,
    /// When the bet was created
    pub created_at: Timestamp,
    /// When the bet expires
    pub expires_at: Timestamp,
}

/// Status of a bet
#[derive(Clone, Copy, Debug, Default, Deserialize, Serialize, PartialEq, Eq, async_graphql::Enum)]
pub enum BetStatus {
    /// Bet is open for new wagers
    #[default]
    Open,
    /// Bet is closed, no new wagers accepted
    Closed,
    /// Bet has been resolved
    Resolved,
}

/// A user's position in a bet
#[derive(Clone, Debug, Deserialize, Serialize, SimpleObject)]
pub struct UserBet {
    /// The bet ID this position is for
    pub bet_id: String,
    /// The user who placed the bet
    pub owner: AccountOwner,
    /// true = YES, false = NO
    pub side: bool,
    /// Amount wagered
    pub amount: Amount,
    /// When the bet was placed
    pub timestamp: Timestamp,
}

/// Input for creating a new bet
#[derive(Clone, Debug, Deserialize, Serialize, InputObject)]
pub struct CreateBetInput {
    pub question: String,
    pub duration_seconds: u64,
}

/// Input for placing a bet
#[derive(Clone, Debug, Deserialize, Serialize, InputObject)]
pub struct PlaceBetInput {
    pub bet_id: String,
    pub side: bool,
    pub amount: Amount,
}

/// Operations that can be executed by the application
#[derive(Debug, Deserialize, Serialize, GraphQLMutationRoot)]
pub enum Operation {
    /// Create a new prediction market
    CreateBet {
        question: String,
        duration_seconds: u64,
    },
    /// Place a bet on an existing market
    PlaceBet {
        bet_id: String,
        side: bool,
        amount: Amount,
    },
    /// Close a bet (stop accepting new wagers)
    CloseBet {
        bet_id: String,
    },
    /// Resolve a bet with the outcome
    ResolveBet {
        bet_id: String,
        outcome: bool,
    },
}

/// Messages for cross-chain communication
#[derive(Debug, Deserialize, Serialize)]
pub enum Message {
    /// Sync a bet to another chain
    SyncBet { bet: Bet },
}
