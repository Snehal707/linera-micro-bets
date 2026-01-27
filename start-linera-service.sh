#!/bin/bash
# Start Linera Service for StormCast

echo "🌪️ StormCast - Starting Linera Service"
echo "======================================="

# Navigate to project directory
cd "$(dirname "$0")"

# Check if linera is installed
if ! command -v linera &> /dev/null; then
    echo "❌ Linera CLI not found!"
    echo "Install it with: curl -fsSL https://raw.githubusercontent.com/linera-io/linera-protocol/main/scripts/install-linera.sh | bash"
    exit 1
fi

# Show wallet info
echo ""
echo "📋 Wallet Info:"
linera wallet show

# Check if we have an environment file
if [ -f ".env.linera" ]; then
    source .env.linera
    echo ""
    echo "📦 App ID: ${MICRO_BET_APP_ID:-Not set}"
fi

echo ""
echo "🚀 Starting Linera service on port 8080..."
echo "   GraphQL endpoint: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start the service
linera service --port 8080
