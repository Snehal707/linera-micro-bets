# About Section - Copy This Content

Copy the entire content below and paste it into the "About" field:

---

## The problem it solves

Traditional betting platforms suffer from high fees, slow settlement times, and limited accessibility. Users want to bet on real-world events like weather, natural disasters, and daily occurrences, but existing solutions are either too complex, too expensive, or don't support micro-bets.

**StormCast on Linera** solves this by enabling instant, low-cost micro-betting on any real-world event. Users can create markets in seconds, place small-stakes bets, and receive proportional payouts immediately when events resolve. The platform leverages Linera's low-latency architecture to provide near-instant execution, making it perfect for time-sensitive predictions like daily weather forecasts or breaking news events.

---

## Challenges I ran into

**1. Linera SDK Learning Curve**
   - Understanding Linera's unique architecture (microchains, views, operations)
   - Adapting to async/await patterns with Linera's View system
   - Working with GraphQL schema generation for complex types

**2. Platform-Specific Setup**
   - Linera doesn't officially support Windows natively
   - Had to set up WSL2 environment for development
   - Resolving dependency issues (protoc, bindgen, Rust toolchain)

**3. Smart Contract Development**
   - Converting Amount types to u128 for calculations (using `to_attos()`)
   - Managing async state operations correctly
   - Implementing proper error handling for bet resolution

**4. Frontend Integration**
   - Setting up React/Vite frontend to work with Linera's GraphQL API
   - Managing environment variables for different networks
   - Creating intuitive UI for market creation and betting

**5. Deployment Complexity**
   - Coordinating multiple services (linera-server, linera-storage-server, linera-proxy)
   - Managing RocksDB storage locks
   - Handling wallet and keystore file paths correctly

---

## Technologies I used

**Backend/Smart Contracts:**
- **Rust** - Core smart contract language
- **Linera SDK** - Blockchain framework and protocol
- **Linera Protocol** - Microchain architecture for low-latency execution
- **async-graphql** - GraphQL schema generation
- **RocksDB** - Storage backend

**Frontend:**
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **GraphQL** - Query language for Linera service

**Development Tools:**
- **WSL2** - Windows Subsystem for Linux
- **Cargo** - Rust package manager
- **Git** - Version control
- **GitHub** - Repository hosting

**Infrastructure:**
- **Linera Service** - Node service
- **Linera Storage Service** - Database service
- **Linera Proxy** - HTTP proxy

---

## How we built it

**Phase 1: Smart Contract Development**
1. Designed the micro-bet contract structure with `MicroBet`, `Bet`, and `BetStatus` types
2. Implemented core functions: `create_bet`, `place_bet`, `close_bet`, and `resolve_bet`
3. Built pool-based betting system with proportional winnings calculation
4. Added expiration logic for time-bound markets

**Phase 2: Linera Integration**
1. Set up local Linera network using `linera net up`
2. Created wallet and keystore for testing
3. Deployed fungible token application (required dependency)
4. Deployed micro-bet contract using `linera project publish-and-create`

**Phase 3: Frontend Development**
1. Created React/Vite application with TypeScript
2. Built UI components for market creation, betting, and resolution
3. Integrated with Linera's GraphQL API
4. Implemented demo mode with local state management

**Phase 4: Testing & Deployment**
1. Tested contract functions on local network
2. Verified bet creation, placement, and resolution flows
3. Tested frontend interactions
4. Documented deployment process

**Key Implementation Details:**
- Used `Amount::to_attos()` for converting Linera amounts to u128 for calculations
- Implemented unique bet keys using timestamps to prevent overwrites
- Created proportional payout system: `share = (winner_amount * total_pool) / winner_pool`
- Used Linera's `authenticated_owner()` for creator verification
- Leveraged `MapView` and `RegisterView` for persistent state management

---

## What we learned

**Technical Learnings:**
- Linera's microchain architecture enables truly low-latency blockchain applications
- The View system requires careful async/await handling - not all operations are async
- GraphQL schema generation needs careful type handling (using `#[graphql(skip)]` for complex types)
- Rust's type system caught many potential bugs during development

**Development Process:**
- WSL2 is essential for Linera development on Windows
- Debug builds are much faster than release builds for development
- Proper `.gitignore` is crucial when working with embedded repositories
- Documentation and step-by-step guides save significant time

**Blockchain Insights:**
- Micro-betting requires careful pool management to ensure fair payouts
- Expiration logic is critical for time-sensitive markets
- User authentication and authorization patterns differ from traditional web apps
- Cross-chain messaging (though not fully implemented) is a powerful Linera feature

**Challenges Overcome:**
- Learned to navigate Linera's documentation and examples
- Solved complex dependency issues through systematic debugging
- Gained experience with Rust's async patterns and Linera SDK
- Understood the importance of proper error handling in smart contracts

---

## What's next for StormCast on Linera

**Short-term Improvements:**
- Deploy frontend to a public URL for live demo
- Add more market types (sports, elections, crypto prices)
- Implement user profiles and bet history
- Add real-time market updates using GraphQL subscriptions

**Medium-term Features:**
- Oracle integration for automatic market resolution
- Multi-chain support using Linera's cross-chain messaging
- Token staking for market creators
- Reputation system for reliable oracles

**Long-term Vision:**
- Mobile app for iOS and Android
- Integration with weather APIs for automatic resolution
- Social features (following creators, sharing markets)
- Governance token for platform decisions
- Expand to other event types (sports, politics, entertainment)

**Technical Enhancements:**
- Optimize gas costs for frequent operations
- Implement batch betting for multiple markets
- Add market templates for common event types
- Create SDK for third-party integrations
- Build analytics dashboard for market trends

**Community & Growth:**
- Launch on Linera Testnet Conway
- Gather user feedback and iterate
- Create comprehensive documentation
- Open source the project for community contributions
- Build partnerships with data providers for reliable oracles

---
