# Micro-Bet Contract

## Workspace Setup

This contract needs to be built within the Linera workspace. Here are two options:

### Option 1: Add to Linera Examples (Recommended)

1. Copy this directory to `linera-protocol/examples/micro-bet/`
2. Add to `linera-protocol/examples/Cargo.toml`:

```toml
[workspace]
members = [
    # ... existing members ...
    "micro-bet",
]
```

3. Build from workspace:
```bash
cd linera-protocol
cargo build -p micro-bet
```

### Option 2: Standalone Build

1. Update `Cargo.toml` to use local Linera SDK:

```toml
[dependencies]
linera-sdk = { path = "../linera-protocol/linera-sdk" }
fungible = { path = "../linera-protocol/examples/fungible" }
# ... other dependencies
```

2. Build:
```bash
cargo build
```

## Building

```bash
cargo build
cargo build --release  # For deployment
```

## Testing

```bash
cargo test
```

## Deployment

See `../DEPLOYMENT.md` for deployment instructions.

