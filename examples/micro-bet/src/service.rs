// StormCast Micro-Bet Service
// Provides GraphQL API for querying bets

#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use std::sync::Arc;

use async_graphql::{EmptySubscription, Request, Response, Schema};
use linera_sdk::{
    graphql::GraphQLMutationRoot,
    linera_base_types::WithServiceAbi,
    views::View,
    Service, ServiceRuntime,
};
use micro_bet::Operation;
use state::MicroBetState;

pub struct MicroBetService {
    state: Arc<MicroBetState>,
    runtime: Arc<ServiceRuntime<Self>>,
}

linera_sdk::service!(MicroBetService);

impl WithServiceAbi for MicroBetService {
    type Abi = micro_bet::MicroBetAbi;
}

impl Service for MicroBetService {
    type Parameters = ();

    async fn new(runtime: ServiceRuntime<Self>) -> Self {
        let state = MicroBetState::load(runtime.root_view_storage_context())
            .await
            .expect("Failed to load state");
        MicroBetService {
            state: Arc::new(state),
            runtime: Arc::new(runtime),
        }
    }

    async fn handle_query(&self, request: Request) -> Response {
        let schema = Schema::build(
            self.state.clone(),
            Operation::mutation_root(self.runtime.clone()),
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }
}
