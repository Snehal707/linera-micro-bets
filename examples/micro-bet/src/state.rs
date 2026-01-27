// StormCast Micro-Bet Application State

use linera_sdk::{
    linera_base_types::AccountOwner,
    views::{linera_views, MapView, RegisterView, RootView, ViewStorageContext},
};
use micro_bet::{Bet, InstantiationArgument, UserBet};

/// The micro-bet application state
#[derive(RootView, async_graphql::SimpleObject)]
#[view(context = ViewStorageContext)]
pub struct MicroBetState {
    /// Counter for generating unique bet IDs
    pub bet_counter: RegisterView<u64>,
    /// All bets in the system
    pub bets: MapView<String, Bet>,
    /// User bets indexed by owner
    pub user_bets: MapView<AccountOwner, Vec<UserBet>>,
    /// The instantiation argument
    pub instantiation_argument: RegisterView<Option<InstantiationArgument>>,
}

impl MicroBetState {
    /// Generate a new unique bet ID
    pub fn next_bet_id(&mut self) -> String {
        let counter = self.bet_counter.get_mut();
        *counter += 1;
        format!("bet_{}", counter)
    }
}
