'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserBet {
  id: string;
  marketId: string;
  marketQuestion: string;
  marketCategory: string;
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

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MyBetsPage() {
  const [bets, setBets] = useState<UserBet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('stormcast_user_bets');
    if (stored) {
      setBets(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const totalBets = bets.length;
  const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const yesBets = bets.filter(b => b.side === 'yes').length;
  const noBets = bets.filter(b => b.side === 'no').length;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-50 mb-2">My Bets</h1>
      <p className="text-slate-400 mb-8">Track your betting history and performance</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-slate-400 text-sm">Total Bets</p>
          <p className="text-2xl font-bold text-slate-50">{totalBets}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-slate-400 text-sm">Total Wagered</p>
          <p className="text-2xl font-bold text-cyan-400">{totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-slate-400 text-sm">YES Bets</p>
          <p className="text-2xl font-bold text-green-400">{yesBets}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <p className="text-slate-400 text-sm">NO Bets</p>
          <p className="text-2xl font-bold text-red-400">{noBets}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your bets...</p>
        </div>
      ) : bets.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-slate-400 text-lg mb-2">No bets placed yet</p>
          <p className="text-slate-500 text-sm mb-6">
            Start betting on environmental events to see your history here.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 transition font-semibold"
          >
            Browse Markets →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bets.map((bet) => (
            <div
              key={bet.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <span className="text-3xl">
                    {categoryIcons[bet.marketCategory] || '🌡️'}
                  </span>
                  <div className="flex-1">
                    <Link 
                      href={`/bet/${bet.marketId}`}
                      className="text-lg font-semibold text-slate-50 hover:text-cyan-400 transition"
                    >
                      {bet.marketQuestion}
                    </Link>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        bet.side === 'yes'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {bet.side.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {formatDate(bet.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-50">
                    {bet.amount.toLocaleString()}
                  </p>
                  <p className="text-slate-500 text-sm">wagered</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {bets.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear your bet history?')) {
                localStorage.removeItem('stormcast_user_bets');
                setBets([]);
              }
            }}
            className="text-slate-500 hover:text-red-400 text-sm transition"
          >
            Clear History
          </button>
        </div>
      )}
    </div>
  );
}
