'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserBetDisplay {
  id: string;
  marketId: string;
  marketQuestion: string;
  marketCategory?: string;
  side: 'yes' | 'no';
  amount: number;
  timestamp: number;
  isOnChain: boolean;
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

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MyBetsPage() {
  const [bets, setBets] = useState<UserBetDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  // Load bets from localStorage (works both on Vercel and locally)
  useEffect(() => {
    const loadBets = () => {
      let allBets: UserBetDisplay[] = [];

      // Load all bets from localStorage (both demo and on-chain bets are stored here)
      const stored = localStorage.getItem('stormcast_user_bets');
      if (stored) {
        try {
          const storedBets: UserBetDisplay[] = JSON.parse(stored).map((bet: {
            id: string;
            marketId: string;
            marketQuestion?: string;
            marketCategory?: string;
            side: 'yes' | 'no' | boolean;
            amount: number;
            timestamp: number;
            isOnChain?: boolean;
          }) => ({
            ...bet,
            marketQuestion: bet.marketQuestion || 'Unknown Market',
            side: typeof bet.side === 'boolean' ? (bet.side ? 'yes' : 'no') : bet.side,
            isOnChain: bet.isOnChain || false,
          }));
          allBets = [...allBets, ...storedBets];
        } catch (e) {
          console.error('Failed to parse stored bets:', e);
        }
      }

      // Sort by timestamp (newest first)
      allBets.sort((a, b) => b.timestamp - a.timestamp);

      setBets(allBets);
      setLoading(false);
    };

    // Small delay to ensure we're on client side
    const timer = setTimeout(loadBets, 100);
    return () => clearTimeout(timer);
  }, []);

  const clearDemoBets = () => {
    if (confirm('Clear all demo bets? This cannot be undone.')) {
      localStorage.removeItem('stormcast_user_bets');
      setBets(bets.filter(b => b.isOnChain));
    }
  };

  const onChainCount = bets.filter(b => b.isOnChain).length;
  const demoCount = bets.filter(b => !b.isOnChain).length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">My Bets</h1>
          <p className="text-slate-400 mt-1">Track your prediction market positions</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition"
        >
          ← Back to Markets
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-slate-400 text-sm mb-1">Total Bets</p>
          <p className="text-2xl font-bold text-cyan-400">{bets.length}</p>
        </div>
        <div className="bg-slate-900 border border-green-500/30 rounded-xl p-4 text-center">
          <p className="text-slate-400 text-sm mb-1">On-Chain</p>
          <p className="text-2xl font-bold text-green-400">{onChainCount}</p>
        </div>
        <div className="bg-slate-900 border border-yellow-500/30 rounded-xl p-4 text-center">
          <p className="text-slate-400 text-sm mb-1">Demo</p>
          <p className="text-2xl font-bold text-yellow-400">{demoCount}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your bets...</p>
        </div>
      ) : bets.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-6xl mb-4">🎲</p>
          <p className="text-slate-400 text-lg mb-4">No bets yet</p>
          <Link
            href="/"
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            Browse markets and place your first bet →
          </Link>
        </div>
      ) : (
        <>
          {demoCount > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={clearDemoBets}
                className="text-sm text-red-400 hover:text-red-300 transition"
              >
                🗑️ Clear Demo Bets
              </button>
            </div>
          )}
          
          <div className="space-y-4">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className={`bg-slate-900 border rounded-xl p-6 ${
                  bet.isOnChain ? 'border-green-500/30' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">
                      {bet.marketCategory ? categoryIcons[bet.marketCategory] || '🌡️' : '🎲'}
                    </span>
                    <div className="flex-1">
                      <p className="text-slate-50 font-medium">
                        {(bet.marketQuestion || 'Unknown Market').replace(/^\[\w+\]\s*/, '')}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          bet.isOnChain 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {bet.isOnChain ? '🔗 On-chain' : '📋 Demo'}
                        </span>
                        <span className="text-slate-500 text-xs">
                          {formatDate(bet.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      bet.side === 'yes'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {bet.side.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 text-sm">Amount</span>
                    <p className="text-xl font-bold text-slate-50">{bet.amount.toLocaleString()}</p>
                  </div>
                  <Link
                    href={`/bet/${bet.marketId}`}
                    className="text-cyan-400 hover:text-cyan-300 transition text-sm"
                  >
                    View Market →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
