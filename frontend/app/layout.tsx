import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Link from 'next/link';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Stormcast - Environmental Event Betting',
  description: 'Bet on weather and natural events on Linera blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-slate-950`}>
        <Providers>
          <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition flex items-center gap-2">
                  🌪️ Stormcast
                </Link>
                <div className="flex gap-6">
                  <Link href="/" className="text-slate-300 hover:text-white transition">
                    Markets
                  </Link>
                  <Link href="/create" className="text-slate-300 hover:text-white transition">
                    Create Market
                  </Link>
                  <Link href="/my-bets" className="text-slate-300 hover:text-white transition">
                    My Bets
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
