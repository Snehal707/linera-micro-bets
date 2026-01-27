# Connect StormCast Frontend to Linera Conway Testnet

This guide will help you connect your StormCast frontend to the real Linera Conway testnet.

## Prerequisites

1. **WSL2 Ubuntu** (recommended for Windows users)
2. **Linera CLI** installed
3. **Node.js 18+** for the frontend

## Step 1: Set Up Linera CLI in WSL

Open WSL Ubuntu and run:

```bash
# Install Linera CLI (if not already installed)
curl -fsSL https://raw.githubusercontent.com/linera-io/linera-protocol/main/scripts/install-linera.sh | bash

# Add to PATH
export PATH="$HOME/.cargo/bin:$PATH"

# Verify installation
linera --version
```

## Step 2: Initialize Wallet with Conway Testnet

```bash
# Navigate to the project
cd /mnt/c/Users/ASUS/"New folder (2)"/linera-micro-bets

# Initialize wallet with Conway testnet (or use existing wallet.json)
linera wallet init --with-new-chain --faucet https://faucet.testnet-conway.linera.net

# Check your chain ID
linera wallet show
```

## Step 3: Deploy the Micro-Bet Contract

```bash
# Navigate to the examples directory
cd linera-conway/examples

# Build the micro-bet contract
cargo build --release --target wasm32-unknown-unknown -p micro-bet

# First deploy the fungible token app (required dependency)
FUNGIBLE_APP_ID=$(linera project publish-and-create fungible \
  --json-argument '{"accounts": {}}' \
  --json-parameters '{}')

echo "Fungible App ID: $FUNGIBLE_APP_ID"

# Deploy the micro-bet contract
APP_ID=$(linera project publish-and-create micro-bet \
  --json-argument "{\"fungible_app_id\": \"$FUNGIBLE_APP_ID\", \"_dummy\": null}" \
  --json-parameters "\"$FUNGIBLE_APP_ID\"")

echo "Micro-Bet App ID: $APP_ID"
```

**Save the APP_ID! You'll need it for the frontend.**

## Step 4: Start the Linera Service

The Linera service exposes a GraphQL API for your frontend:

```bash
# Start the service (keep this running in a terminal)
linera service --port 8080

# The service will be available at http://localhost:8080
```

## Step 5: Configure the Frontend

Create or update `.env.local` in the frontend directory:

```bash
cd /mnt/c/Users/ASUS/"New folder (2)"/linera-micro-bets/frontend

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_LINERA_SERVICE_URL=http://localhost:8080
NEXT_PUBLIC_CHAIN_ID=YOUR_CHAIN_ID
NEXT_PUBLIC_MICRO_BET_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_OWNER_ADDRESS=YOUR_OWNER_ADDRESS
EOF
```

Replace:
- `YOUR_CHAIN_ID` with your chain ID from `linera wallet show`
- `YOUR_APP_ID` with the micro-bet application ID from Step 3
- `YOUR_OWNER_ADDRESS` with your owner address from wallet.json

## Step 6: Start the Frontend

In a new terminal (can be PowerShell):

```powershell
cd "C:\Users\ASUS\New folder (2)\linera-micro-bets\frontend"
npm install
npm run dev
```

Open http://localhost:3000 - you should see "Connected to Linera Conway Testnet"!

---

## Quick Commands Reference

### WSL (keep running):
```bash
cd /mnt/c/Users/ASUS/"New folder (2)"/linera-micro-bets
linera service --port 8080
```

### PowerShell:
```powershell
cd "C:\Users\ASUS\New folder (2)\linera-micro-bets\frontend"
npm run dev
```

---

## Troubleshooting

### "Demo Mode" showing instead of "Connected"

1. Make sure `linera service` is running in WSL
2. Check that `.env.local` has correct values
3. Verify the App ID is correct

### GraphQL errors

1. Check the Linera service logs in WSL
2. Make sure the contract was deployed successfully
3. Try restarting the Linera service

### Contract deployment fails

1. Make sure you have enough balance: `linera wallet show`
2. Get more tokens from faucet: `linera wallet request-tokens`

---

## Useful Linera Commands

```bash
# Check wallet balance
linera wallet show

# Request tokens from faucet
linera wallet request-tokens

# Query the application (replace APP_ID)
linera query --application $APP_ID '{ bets { entries { value { id question } } } }'

# Execute an operation
linera execute --application $APP_ID 'createBet(question: "Test?", durationSeconds: 3600)'
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Your Browser                              │
│                  http://localhost:3000                        │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Next.js Frontend                         │    │
│  │           (React + TanStack Query)                    │    │
│  └──────────────────────┬───────────────────────────────┘    │
│                         │                                     │
│                         │ GraphQL                             │
│                         ▼                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │           Linera Service (WSL)                        │    │
│  │              http://localhost:8080                    │    │
│  └──────────────────────┬───────────────────────────────┘    │
│                         │                                     │
│                         │ gRPC                                │
│                         ▼                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         Linera Conway Testnet Validators              │    │
│  │      validator-X.testnet-conway.linera.net           │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```
