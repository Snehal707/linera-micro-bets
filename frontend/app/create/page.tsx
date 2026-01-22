'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  { value: 'Rain', icon: '🌧️', label: 'Rain' },
  { value: 'Storm', icon: '⛈️', label: 'Storm' },
  { value: 'Hurricane', icon: '🌀', label: 'Hurricane' },
  { value: 'Tornado', icon: '🌪️', label: 'Tornado' },
  { value: 'Earthquake', icon: '🌍', label: 'Earthquake' },
  { value: 'Flood', icon: '🌊', label: 'Flood' },
  { value: 'Wildfire', icon: '🔥', label: 'Wildfire' },
  { value: 'Snow', icon: '❄️', label: 'Snow/Blizzard' },
  { value: 'Drought', icon: '☀️', label: 'Drought/Heatwave' },
  { value: 'Other', icon: '🌡️', label: 'Other' },
];

export default function CreateMarketPage() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('Storm');
  const [durationHours, setDurationHours] = useState(24);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    setIsSubmitting(true);
    
    // Create new market
    const newMarket = {
      id: `custom_${Date.now()}`,
      question: question.trim(),
      category,
      creator: '0xYour...Wallet',
      yesPool: 0,
      noPool: 0,
      status: 'Active',
      endTime: Date.now() + (durationHours * 3600000),
      createdAt: Date.now(),
    };

    // Save to localStorage
    const stored = localStorage.getItem('stormcast_markets');
    const markets = stored ? JSON.parse(stored) : [];
    markets.unshift(newMarket);
    localStorage.setItem('stormcast_markets', JSON.stringify(markets));

    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-50 mb-2">Create Prediction Market</h1>
      <p className="text-slate-400 mb-8">Create a new environmental event market for others to bet on</p>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-200 mb-3">
            Event Category
          </label>
          <div className="grid grid-cols-5 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`p-3 rounded-lg border text-center transition ${
                  category === cat.value
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                <span className="text-2xl block mb-1">{cat.icon}</span>
                <span className="text-xs">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <label htmlFor="question" className="block text-sm font-medium text-slate-200 mb-2">
            Market Question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Will there be a magnitude 6.0+ earthquake in California this week?"
            rows={3}
            className="w-full px-4 py-3 border border-slate-700 bg-slate-950 text-slate-50 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder:text-slate-500 resize-none"
            required
          />
          <p className="text-slate-500 text-xs mt-2">
            Make sure your question has a clear yes/no outcome with a specific timeframe
          </p>
        </div>

        {/* Duration */}
        <div className="mb-8">
          <label htmlFor="duration" className="block text-sm font-medium text-slate-200 mb-2">
            Market Duration
          </label>
          <select
            id="duration"
            value={durationHours}
            onChange={(e) => setDurationHours(parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-slate-700 bg-slate-950 text-slate-50 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value={6}>6 hours</option>
            <option value={12}>12 hours</option>
            <option value={24}>24 hours (1 day)</option>
            <option value={72}>72 hours (3 days)</option>
            <option value={168}>168 hours (1 week)</option>
            <option value={336}>336 hours (2 weeks)</option>
            <option value={720}>720 hours (1 month)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full"></span>
              Creating Market...
            </span>
          ) : (
            '🌪️ Create Market'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
        <p className="text-slate-400 text-sm">
          💡 <strong>Tips for good markets:</strong>
        </p>
        <ul className="text-slate-500 text-sm mt-2 list-disc list-inside space-y-1">
          <li>Be specific about location (city, region, country)</li>
          <li>Include measurable criteria (magnitude, inches, category)</li>
          <li>Set a clear end time for resolution</li>
          <li>Use reliable data sources for verification</li>
        </ul>
      </div>
    </div>
  );
}
