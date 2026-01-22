'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Market {
  id: string;
  question: string;
  category: string;
  creator: string;
  yesPool: number;
  noPool: number;
  status: string;
  endTime: number;
  createdAt: number;
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

const defaultMarkets: Market[] = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
    question: 'Will it rain more than 2 inches in NYC tomorrow?',
    category: 'Rain',
    creator: '0x9876...4321',
    yesPool: 800,
    noPool: 600,
    status: 'Active',
    endTime: Date.now() + 43200000,
    createdAt: Date.now() - 21600000,
  },
  {
    id: '4',
    question: 'Will a tornado warning be issued in Oklahoma today?',
    category: 'Tornado',
    creator: '0xdef0...1234',
    yesPool: 500,
    noPool: 750,
    status: 'Active',
    endTime: Date.now() + 28800000,
    createdAt: Date.now() - 14400000,
  },
];

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

export default function BetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const marketId = params.id as string;
  const [betAmount, setBetAmount] = useState('100');
  const [selectedSide, setSelectedSide] = useState<'yes' | 'no' | null>(null);
  const [market, setMarket] = useState<Market | null>(null);
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  useEffect(() => {
    // Find market from defaults or localStorage
    let found = defaultMarkets.find(m => m.id === marketId);
    
    if (!found) {
      const stored = localStorage.getItem('stormcast_markets');
      if (stored) {
        const customMarkets = JSON.parse(stored);
        found = customMarkets.find((m: Market) => m.id === marketId);
      }
    }
    
    if (found) {
      setMarket(found);
    }
  }, [marketId]);

  const handlePlaceBet = () => {
    if (!selectedSide || !market) {
      alert('Please select YES or NO');
      return;
    }

    const amount = parseInt(betAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsPlacingBet(true);

    // Save bet to localStorage
    const newBet = {
      id: `bet_${Date.now()}`,
      marketId: market.id,
      marketQuestion: market.question,
      marketCategory: market.category,
      side: selectedSide,
      amount: amount,
      timestamp: Date.now(),
    };

    const storedBets = localStorage.getItem('stormcast_user_bets');
    const bets = storedBets ? JSON.parse(storedBets) : [];
    bets.unshift(newBet);
    localStorage.setItem('stormcast_user_bets', JSON.stringify(bets));

    // Update market pools (for demo)
    const storedMarkets = localStorage.getItem('stormcast_markets');
    let markets = storedMarkets ? JSON.parse(storedMarkets) : [];
    
    // Update default markets in memory
    const defaultIndex = defaultMarkets.findIndex(m => m.id === market.id);
    if (defaultIndex >= 0) {
      if (selectedSide === 'yes') {
        defaultMarkets[defaultIndex].yesPool += amount;
      } else {
        defaultMarkets[defaultIndex].noPool += amount;
      }
    }

    // Update custom markets in storage
    const customIndex = markets.findIndex((m: Market) => m.id === market.id);
    if (customIndex >= 0) {
      if (selectedSide === 'yes') {
        markets[customIndex].yesPool += amount;
      } else {
        markets[customIndex].noPool += amount;
      }
      localStorage.setItem('stormcast_markets', JSON.stringify(markets));
    }

    setTimeout(() => {
      setIsPlacingBet(false);
      router.push('/my-bets');
    }, 800);
  };

  if (!market) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Market not found</p>
        <Link href="/" className="text-cyan-400 hover:text-cyan-300 mt-4 inline-block">
          ← Back to markets
        </Link>
      </div>
    );
  }

  const totalPool = market.yesPool + market.noPool;
  const yesPercent = totalPool > 0 ? ((market.yesPool / totalPool) * 100).toFixed(1) : '50.0';
  const noPercent = totalPool > 0 ? ((market.noPool / totalPool) * 100).toFixed(1) : '50.0';

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="text-slate-400 hover:text-white transition mb-6 inline-block">
        ← Back to markets
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <span className="text-5xl">{categoryIcons[market.category] || '🌡️'}</span>
          <div className="flex-1">
            <span className="text-xs text-cyan-400 uppercase tracking-wider">{market.category}</span>
            <h1 className="text-2xl font-bold text-slate-50 mt-1">
              {market.question}
            </h1>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            market.status === 'Active'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-slate-500/20 text-slate-400'
          }`}>
            {market.status}
          </span>
        </div>

        {/* Probability Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-400">YES {yesPercent}%</span>
            <span className="text-red-400">NO {noPercent}%</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              className="bg-green-500 transition-all duration-500"
              style={{ width: `${yesPercent}%` }}
            />
            <div 
              className="bg-red-500 transition-all duration-500"
              style={{ width: `${noPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setSelectedSide('yes')}
            disabled={isPlacingBet}
            className={`p-6 rounded-xl border-2 transition ${
              selectedSide === 'yes'
                ? 'border-green-500 bg-green-500/20'
                : 'border-slate-700 hover:border-green-500/50'
            }`}
          >
            <p className="text-green-400 text-sm mb-2">YES Pool</p>
            <p className="text-3xl font-bold text-green-400">{market.yesPool.toLocaleString()}</p>
            <p className="text-slate-500 text-xs mt-2">Click to bet YES</p>
          </button>
          <button
            onClick={() => setSelectedSide('no')}
            disabled={isPlacingBet}
            className={`p-6 rounded-xl border-2 transition ${
              selectedSide === 'no'
                ? 'border-red-500 bg-red-500/20'
                : 'border-slate-700 hover:border-red-500/50'
            }`}
          >
            <p className="text-red-400 text-sm mb-2">NO Pool</p>
            <p className="text-3xl font-bold text-red-400">{market.noPool.toLocaleString()}</p>
            <p className="text-slate-500 text-xs mt-2">Click to bet NO</p>
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Bet Amount
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              min="1"
              disabled={isPlacingBet}
              className="flex-1 px-4 py-3 border border-slate-700 bg-slate-950 text-slate-50 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={() => setBetAmount('100')}
              className="px-4 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
            >
              100
            </button>
            <button
              onClick={() => setBetAmount('500')}
              className="px-4 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
            >
              500
            </button>
            <button
              onClick={() => setBetAmount('1000')}
              className="px-4 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
            >
              1K
            </button>
          </div>
        </div>

        <button
          onClick={handlePlaceBet}
          disabled={!selectedSide || isPlacingBet}
          className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition ${
            selectedSide === 'yes'
              ? 'bg-green-500 text-slate-950 hover:bg-green-400'
              : selectedSide === 'no'
              ? 'bg-red-500 text-slate-950 hover:bg-red-400'
              : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPlacingBet ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full"></span>
              Placing Bet...
            </span>
          ) : selectedSide ? (
            `Place ${betAmount} on ${selectedSide.toUpperCase()}`
          ) : (
            'Select YES or NO to bet'
          )}
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-50 mb-4">Market Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Time Remaining</span>
            <span className="text-cyan-400 font-medium">{formatTimeLeft(market.endTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Total Pool</span>
            <span className="text-slate-200">{totalPool.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Creator</span>
            <span className="text-slate-200 font-mono">{market.creator}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Market ID</span>
            <span className="text-slate-200 font-mono text-xs">{market.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
