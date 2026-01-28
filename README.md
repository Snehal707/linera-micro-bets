# 🌪️ StormCast - Environmental Event Prediction Markets

[![Live Demo](https://img.shields.io/badge/Demo-lineramicrobets.vercel.app-blue)](https://lineramicrobets.vercel.app)
[![Built on Linera](https://img.shields.io/badge/Built%20on-Linera-orange)](https://linera.io)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](LICENSE)

> **Decentralized prediction markets for weather and natural disaster events, built on Linera blockchain microchains.**

StormCast enables users to create and bet on outcomes of real-world environmental events like hurricanes, earthquakes, tornadoes, floods, and more.

---

## 🎯 Live Demo

**🌐 [lineramicrobets.vercel.app](https://lineramicrobets.vercel.app)**

> **Note:** The Vercel deployment runs in Demo Mode (localStorage) since the Linera service requires a backend server. For full on-chain functionality, run locally with `linera service --port 8080`.

### 🚀 VPS Deployment (Coming Soon)
We're planning to deploy the Linera service to a VPS, enabling real on-chain betting directly from the Vercel frontend for all users!

---

## ✨ Features

- **Create Markets** - Anyone can create a prediction market for an upcoming weather event with a specific question and deadline
- **Place Bets** - Users bet YES or NO on outcomes, with funds pooled together
- **Resolution & Payout** - When the event concludes, the market resolves and winners split the pool proportionally
- **Sub-second Finality** - Linera's microchain architecture enables instant transaction confirmation

---

## 🏗️ Technical Implementation

| Component | Technology |
|-----------|------------|
| **Smart Contract** | Rust with Linera SDK, MapView for bet storage, RegisterView for market state |
| **Security** | Creator verification via `authenticated_signer()` ensures only authorized resolution |
| **Token Integration** | Uses Linera's fungible token standard for seamless deposits and payouts |
| **Frontend** | Next.js 14 with TypeScript, real-time market updates, responsive design |

---

## 📁 Project Structure

```
linera-micro-bets/
├── frontend/                    # Next.js web application
│   ├── app/                     # App router pages
│   │   ├── page.tsx            # Markets listing
│   │   ├── create/             # Create market page
│   │   ├── bet/[id]/           # Market details & betting
│   │   └── my-bets/            # User's betting history
│   └── lib/                     # Linera client & hooks
│
├── examples/micro-bet/          # Linera smart contract
│   └── src/
│       ├── lib.rs              # Contract ABI & operations
│       ├── state.rs            # Bet & market data structures
│       ├── contract.rs         # Core betting logic
│       └── service.rs          # GraphQL query endpoints
│
└── [linera-*]/                  # Linera protocol (dependency)
```

---

## 🚀 Quick Start

### Demo Mode (Vercel)
Simply visit: **[lineramicrobets.vercel.app](https://lineramicrobets.vercel.app)**

### Local Development

#### Prerequisites
- [Rust](https://rustup.rs/) (for building Linera)
- [Node.js 18+](https://nodejs.org/)
- [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install) (if on Windows)

#### 1. Build Linera binaries
```bash
cargo build -p linera-storage-service -p linera-service --bins
export PATH="$PWD/target/debug:$PATH"
```

#### 2. Initialize wallet with Conway testnet
```bash
linera wallet init --faucet https://faucet.testnet-conway.linera.net
```

#### 3. Start Linera service
```bash
linera service --port 8080
```

#### 4. Start frontend
```bash
cd frontend
npm install
npm run dev
```

#### 5. Configure environment
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_LINERA_SERVICE_URL=http://localhost:8080
NEXT_PUBLIC_CHAIN_ID=your_chain_id
NEXT_PUBLIC_MICRO_BET_APP_ID=your_app_id
```

Visit `http://localhost:3000` - you should see **"🔗 Linera: Connected"** indicating on-chain mode!

---

## 📖 How It Works

### Creating a Market
1. Navigate to "Create Market"
2. Enter the event question (e.g., "Will Hurricane X make landfall in Florida?")
3. Set the betting deadline
4. Submit - market is created on-chain

### Placing a Bet
1. Browse active markets on the home page
2. Click on a market to view details
3. Choose YES or NO
4. Enter your bet amount
5. Confirm - funds are locked in the pool

### Resolution
1. After the event deadline, the market creator can resolve the outcome
2. Winners receive proportional payouts from the losing pool
3. All transactions are recorded on Linera microchains

---

## 🔒 Security Note

> **Important:** Never commit `wallet.json`, `keystore.json`, or `client.db/` to version control. These files contain sensitive cryptographic keys.

---

## 🎓 What We Learned

- Linera's microchain architecture enables sub-second transaction finality, perfect for time-sensitive betting
- The View model requires careful async handling
- Rust's type system caught many potential bugs at compile time
- GraphQL provides a flexible API for frontend integration

---

## 🔮 Roadmap

- [ ] **VPS Deployment** - Public Linera service for on-chain betting from Vercel
- [ ] **Oracle Integration** - Automated weather data resolution
- [ ] **Multi-chain Support** - Cross-region betting pools
- [ ] **Mobile PWA** - Progressive web app for mobile users

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Linera](https://linera.io) - For the revolutionary microchain infrastructure
- [Linera Conway Testnet](https://faucet.testnet-conway.linera.net) - For providing testnet resources

---

<p align="center">
  <b>Built with ❤️ for the Linera Builderthon</b>
</p>
