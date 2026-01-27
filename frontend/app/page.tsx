'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAllBets, useServiceHealth } from './lib/hooks';
import { getConfig, formatAmount, MicroBet as LineraMarket } from './lib/linera-client';

export interface Market {
  id: string;
  question: string;
  category: string;
  creator: string;
  yesPool: number;
  noPool: number;
  status: 'Active' | 'Resolved' | 'Expired';
  endTime: number;
  createdAt: number;
}

export interface UserBet {
  id: string;
  marketId: string;
  marketQuestion: string;
  side: 'yes' | 'no';
  amount: number;
  timestamp: number;
}

const categoryIcons: Record<string, string> = {
  'Rain': '🌧️',
  'Storm': '⛈️',
  'Hurricane': '🌀',
  'Tornado': '🌪️',
  'Earthquake': '🌍',
  'Flood': '🌊',
  'Wildfire': '🔥',
  'Snow': '❄️',
  'Drought': '☀️',
  'Other': '🌡️',
};

// Map Linera bet status to our status
function mapStatus(status: string): 'Active' | 'Resolved' | 'Expired' {
  switch (status) {
    case 'Open':
      return 'Active';
    case 'Resolved':
      return 'Resolved';
    case 'Closed':
      return 'Expired';
    default:
      return 'Active';
  }
}

// Extract category from question (simple heuristic)
function extractCategory(question: string): string {
  const lowerQ = question.toLowerCase();
  if (lowerQ.includes('hurricane')) return 'Hurricane';
  if (lowerQ.includes('tornado')) return 'Tornado';
  if (lowerQ.includes('earthquake')) return 'Earthquake';
  if (lowerQ.includes('flood')) return 'Flood';
  if (lowerQ.includes('rain')) return 'Rain';
  if (lowerQ.includes('storm')) return 'Storm';
  if (lowerQ.includes('snow') || lowerQ.includes('blizzard')) return 'Snow';
  if (lowerQ.includes('fire') || lowerQ.includes('wildfire')) return 'Wildfire';
  if (lowerQ.includes('drought') || lowerQ.includes('heat')) return 'Drought';
  return 'Other';
}

// Convert Linera market to frontend Market type
function convertToMarket(bet: LineraMarket): Market {
  return {
    id: bet.id,
    question: bet.question,
    category: extractCategory(bet.question),
    creator: bet.creator.slice(0, 8) + '...' + bet.creator.slice(-4),
    yesPool: formatAmount(bet.yesPool),
    noPool: formatAmount(bet.noPool),
    status: mapStatus(bet.status),
    endTime: parseInt(bet.expiresAt) / 1000, // Convert microseconds to ms
    createdAt: parseInt(bet.createdAt) / 1000,
  };
}

function formatTimeLeft(endTime: number): string {
  const diff = endTime - Date.now();
  if (diff <= 0) return 'Ended';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
}

export default function HomePage() {
  const config = getConfig();
  const { data: lineraMarkets, isLoading: isLoadingBets, error: betsError } = useAllBets();
  const { data: isHealthy, isLoading: isCheckingHealth } = useServiceHealth();
  const [filter, setFilter] = useState<string>('All');
  const [useDemoMode, setUseDemoMode] = useState(false);

  // Load user-created demo markets from localStorage
  const [localMarkets, setLocalMarkets] = useState<Market[]>([]);
  
  useEffect(() => {
    const loadLocalMarkets = () => {
      try {
        const stored = localStorage.getItem('stormcast_markets');
        if (stored) {
          const parsed = JSON.parse(stored);
          setLocalMarkets(parsed.map((m: Market & { question?: string }) => ({
            ...m,
            category: m.category || extractCategory(m.question || ''),
          })));
        }
      } catch (e) {
        console.error('Failed to load local markets:', e);
      }
    };
    loadLocalMarkets();
    
    // Re-check localStorage periodically (for newly created markets)
    const interval = setInterval(loadLocalMarkets, 2000);
    return () => clearInterval(interval);
  }, []);

  // Default demo markets (shown when no user-created markets exist)
  const defaultDemoMarkets: Market[] = [
    {
      id: 'demo-1',
      question: 'Will there be a Category 3+ Hurricane in Florida this month?',
      category: 'Hurricane',
      creator: '0x1234...5678',
      yesPool: 2500,
      noPool: 1800,
      status: 'Active',
      endTime: Date.now() + 86400000 * 7,
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'demo-2',
      question: 'Will Tokyo experience an earthquake above 5.0 magnitude this week?',
      category: 'Earthquake',
      creator: '0xabcd...efgh',
      yesPool: 1200,
      noPool: 1500,
      status: 'Active',
      endTime: Date.now() + 86400000 * 3,
      createdAt: Date.now() - 43200000,
    },
    {
      id: 'demo-3',
      question: 'Will it rain more than 2 inches in NYC tomorrow?',
      category: 'Rain',
      creator: '0x9876...4321',
      yesPool: 800,
      noPool: 600,
      status: 'Active',
      endTime: Date.now() + 43200000,
      createdAt: Date.now() - 21600000,
    },
  ];

  // Combine default demos with user-created local markets
  const demoMarkets = [...localMarkets, ...defaultDemoMarkets];

  // Decide which markets to show
  // Fall back to demo if: user chose demo mode, service not healthy, has error, or no app configured
  const markets: Market[] = useDemoMode || !isHealthy || betsError || !config.isConfigured
    ? demoMarkets
    : (lineraMarkets?.map(convertToMarket) || []);

  const isLoading = isCheckingHealth || (!useDemoMode && isLoadingBets);

  // Auto-switch to demo mode if service is not available
  useEffect(() => {
    if (!isCheckingHealth && !isHealthy && !config.isConfigured) {
      setUseDemoMode(true);
    }
  }, [isHealthy, isCheckingHealth, config.isConfigured]);

  const filteredMarkets = filter === 'All' 
    ? markets 
    : markets.filter(m => m.category === filter);

  const categories = ['All', ...Object.keys(categoryIcons)];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
            🌪️ Stormcast Markets
          </h1>
          <p className="text-slate-400 mt-1">Bet on weather & natural events</p>
        </div>
        <Link
          href="/create"
          className="px-6 py-3 bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 transition font-semibold"
        >
          + Create Market
        </Link>
      </div>

      {/* Connection Status */}
      <div className={`border rounded-xl p-4 mb-6 ${
        isHealthy && !useDemoMode && config.isConfigured && !betsError
          ? 'bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/30'
          : isHealthy && !config.isConfigured
          ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30'
          : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-300 text-sm">
              {useDemoMode ? (
                <>⚠️ Running in <span className="text-yellow-400 font-mono">Demo Mode</span> (localStorage)</>
              ) : isHealthy && config.isConfigured && !betsError ? (
                <>🔗 Connected to <span className="text-cyan-400 font-mono">Linera Conway Testnet</span></>
              ) : isHealthy && !config.isConfigured ? (
                <>✅ Linera Service <span className="text-cyan-400 font-mono">Running</span> - No app deployed</>
              ) : (
                <>⚠️ Running in <span className="text-yellow-400 font-mono">Demo Mode</span> (localStorage)</>
              )}
            </p>
            {isHealthy && !config.isConfigured && !useDemoMode && (
              <p className="text-blue-400 text-xs mt-1">
                Deploy micro-bet contract to enable live mode
              </p>
            )}
            {config.appId && !useDemoMode && config.isConfigured && (
              <p className="text-slate-500 text-xs mt-1">
                App ID: {config.appId.slice(0, 16)}...
              </p>
            )}
            {betsError && !useDemoMode && config.isConfigured && (
              <p className="text-red-400 text-xs mt-1">
                Error: {betsError.message}
              </p>
            )}
          </div>
          <button
            onClick={() => setUseDemoMode(!useDemoMode)}
            className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            {useDemoMode ? '🔌 Try Live' : '📋 Demo Mode'}
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filter === cat
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat !== 'All' && categoryIcons[cat]} {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading markets from Linera...</p>
        </div>
      ) : filteredMarkets.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-slate-400 text-lg mb-4">No markets found</p>
          <Link
            href="/create"
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            Create the first market →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMarkets.map((market) => (
            <Link
              key={market.id}
              href={`/bet/${market.id}`}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition block"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-3xl">{categoryIcons[market.category] || '🌡️'}</span>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-50">
                      {market.question}
                    </h2>
                    <span className="text-xs text-slate-500 mt-1 inline-block">
                      {market.category}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  market.status === 'Active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {market.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-green-400 text-sm mb-1">YES Pool</p>
                  <p className="text-2xl font-bold text-green-400">{market.yesPool.toLocaleString()}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                  <p className="text-red-400 text-sm mb-1">NO Pool</p>
                  <p className="text-2xl font-bold text-red-400">{market.noPool.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">
                  ⏱ {formatTimeLeft(market.endTime)}
                </span>
                <span className="text-cyan-400">
                  Place Bet →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
