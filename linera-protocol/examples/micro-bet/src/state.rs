// Micro-Bet State Management
// Defines the data structures for micro-bets

use async_graphql::scalar;
use linera_sdk::{
    linera_base_types::{AccountOwner, Amount, Timestamp},
    views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext},
};
use serde::{Deserialize, Serialize};

/// The status of a micro-bet.
#[derive(Clone, Copy, Debug, Default, Deserialize, Serialize, PartialEq, Eq)]
pub enum BetStatus {
    /// The bet is open and accepting bets.
    #[default]
    Open,
    /// The bet is closed (event started, no more bets accepted).
    Closed,
    /// The bet has been resolved and winners paid out.
    Resolved,
}

scalar!(BetStatus);

/// A single micro-bet market.
#[derive(Clone, Debug, Deserialize, Serialize, async_graphql::SimpleObject)]
pub struct MicroBet {
    /// Unique bet identifier
    pub id: String,
    /// The bet question
    pub question: String,
    /// Total amount bet on "Yes"
    pub yes_pool: Amount,
    /// Total amount bet on "No"
    pub no_pool: Amount,
    /// Current status of the bet
    pub status: BetStatus,
    /// Creator of the bet
    pub creator: AccountOwner,
    /// Outcome (None = pending, Some(true) = Yes won, Some(false) = No won)
    pub resolution: Option<bool>,
    /// When the bet was created
    pub created_at: Timestamp,
    /// When the bet expires/closes
    pub expires_at: Timestamp,
}

/// An individual user's bet.
#[derive(Clone, Debug, Deserialize, Serialize, async_graphql::SimpleObject)]
pub struct Bet {
    /// Bet ID this bet is for
    pub bet_id: String,
    /// User who placed the bet
    pub owner: AccountOwner,
    /// true = Yes, false = No
    pub side: bool,
    /// Amount bet
    pub amount: Amount,
    /// When the bet was placed
    pub timestamp: Timestamp,
}

/// The application's state.
#[derive(RootView, async_graphql::SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct MicroBetState {
    /// All micro-bets indexed by bet ID
    pub bets: MapView<String, MicroBet>,
    /// All individual bets indexed by (bet_id, owner, side)
    pub user_bets: MapView<String, Bet>, // Key format: "{bet_id}:{owner}:{side}"
    /// The fungible token application ID
    #[graphql(skip)]
    pub fungible_app_id: RegisterView<Option<linera_sdk::linera_base_types::ApplicationId<fungible::FungibleTokenAbi>>>,
}

#[allow(dead_code)]
impl BetStatus {
    /// Returns `true` if the bet status is [`BetStatus::Open`].
    pub fn is_open(&self) -> bool {
        matches!(self, BetStatus::Open)
    }

    /// Returns `true` if the bet status is [`BetStatus::Resolved`].
    pub fn is_resolved(&self) -> bool {
        matches!(self, BetStatus::Resolved)
    }
}

impl MicroBet {
    /// Creates a new micro-bet.
    pub fn new(
        id: String,
        question: String,
        creator: AccountOwner,
        created_at: Timestamp,
        expires_at: Timestamp,
    ) -> Self {
        MicroBet {
            id,
            question,
            yes_pool: Amount::ZERO,
            no_pool: Amount::ZERO,
            status: BetStatus::Open,
            creator,
            resolution: None,
            created_at,
            expires_at,
        }
    }

    /// Returns the total pool size.
    pub fn total_pool(&self) -> Amount {
        self.yes_pool.saturating_add(self.no_pool)
    }
}

