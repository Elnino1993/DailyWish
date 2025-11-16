'use client'

import { WalletConnection } from '@/components/wallet-connection'
import { DailyMintPanel } from '@/components/daily-mint-panel'
import { ProfileWishesGrid } from '@/components/profile-wishes-grid'
import { HowItWorks } from '@/components/how-it-works'
import { useWallet } from '@/hooks/use-wallet'
import { Sparkles } from 'lucide-react'

export default function Page() {
  const { address, isConnected } = useWallet()

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="border-b border-rose-200/50 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-orange-400">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Daily Wish</h1>
                <p className="text-xs text-gray-600">Mint your wish onchain</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700">
                Live on Arc Testnet
              </div>
              <WalletConnection />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-balance text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
            Mint your daily wish onchain
          </h2>
          <p className="mt-6 text-pretty text-lg text-gray-600 md:text-xl">
            One wish a day, one NFT on Arc Testnet, forever in your wallet.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Daily Mint Panel */}
          <DailyMintPanel />

          {/* Profile Wishes Grid - Only show if connected */}
          {isConnected && address && <ProfileWishesGrid address={address} />}

          {/* How It Works */}
          <HowItWorks />
        </div>
      </div>
    </div>
  )
}
