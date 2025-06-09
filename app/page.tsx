"use client"

import { useState } from "react"
import { generateMnemonic } from "bip39"
import SolanaWallet from "@/components/SolanaWallet"
import EthWallet from "@/components/EthWallet"
import { Copy, RefreshCw, Wallet, Shield } from "lucide-react"

export default function CryptoWalletGenerator() {
  const [mnemonic, setMnemonic] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateMnemonic = async () => {
    setIsGenerating(true)
    // Add slight delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newMnemonic = generateMnemonic()
    setMnemonic(newMnemonic)
    setIsGenerating(false)
  }

  const copyToClipboard = async () => {
    if (mnemonic) {
      await navigator.clipboard.writeText(mnemonic)
    }
  }

  return (
    <div className="min-h-screen bg-background font-mono">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b-8 border-black bg-primary">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-yellow-500 border-4 border-black rotate-12 flex items-center justify-center">
                <Wallet className="h-6 w-6" />
              </div>
              <div className="h-12 w-12 bg-blue-600 border-4 border-black -ml-6 -rotate-12 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tighter ml-4 text-white uppercase">CRYPTO.VAULT</span>
            </div>
          </div>
          <div className="text-white font-bold text-sm uppercase tracking-wider">MULTI-CHAIN WALLET GENERATOR</div>
        </div>
      </header>

      <main className="container py-12 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <h1 className="text-6xl font-black tracking-tighter uppercase">GENERATE CRYPTO WALLETS</h1>
          <div className="flex gap-4 items-center justify-center">
            <div className="h-8 w-8 bg-red-600"></div>
            <div className="h-8 w-8 bg-blue-600"></div>
            <div className="h-8 w-8 bg-yellow-500"></div>
            <p className="text-2xl font-mono">
              Create secure HD wallets for Solana and Ethereum from a single seed phrase
            </p>
          </div>
        </section>

        {/* Mnemonic Generation */}
        <section className="space-y-8">
          <div className="bg-white border-8 border-black p-8 shadow-brutal">
            <h2 className="text-3xl font-black mb-6 uppercase border-b-4 border-black pb-2">
              🔐 SEED PHRASE GENERATOR
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={handleGenerateMnemonic}
                  disabled={isGenerating}
                  className="bg-blue-600 text-white border-4 border-black px-6 py-3 font-bold text-lg shadow-brutal hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      GENERATING...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      CREATE SEED PHRASE
                    </>
                  )}
                </button>

                {mnemonic && (
                  <button
                    onClick={copyToClipboard}
                    className="bg-yellow-500 border-4 border-black px-6 py-3 font-bold text-lg shadow-brutal hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
                  >
                    <Copy className="h-5 w-5" />
                    COPY
                  </button>
                )}
              </div>

              {mnemonic && (
                <div className="space-y-4">
                  <div className="bg-black text-white border-4 border-black p-4">
                    <p className="text-sm font-bold uppercase text-yellow-500 mb-2">⚠️ SECURITY WARNING</p>
                    <p className="font-mono text-sm">
                      Store this seed phrase securely. Anyone with access to it can control your wallets.
                    </p>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={mnemonic}
                      readOnly
                      className="w-full border-4 border-black p-4 text-lg font-mono bg-gray-50 shadow-brutal focus:outline-none"
                      placeholder="Your seed phrase will appear here..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Wallet Sections */}
        {mnemonic && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Solana Wallets */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 border-8 border-black p-8 shadow-brutal">
              <h2 className="text-3xl font-black mb-6 uppercase border-b-4 border-white pb-2 text-white">
                🪙 SOLANA WALLETS
              </h2>
              <SolanaWallet mnemonic={mnemonic} />
            </div>

            {/* Ethereum Wallets */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 border-8 border-black p-8 shadow-brutal">
              <h2 className="text-3xl font-black mb-6 uppercase border-b-4 border-white pb-2 text-white">
                🧾 ETHEREUM WALLETS
              </h2>
              <EthWallet mnemonic={mnemonic} />
            </div>
          </div>
        )}

        {/* Info Section */}
        <section className="grid gap-8 md:grid-cols-3">
          <div className="bg-yellow-500 border-8 border-black p-6 shadow-brutal">
            <h3 className="text-2xl font-black mb-4 uppercase border-b-4 border-black pb-2">HD WALLETS</h3>
            <p className="text-lg font-mono">
              Generate unlimited wallets from a single seed phrase using hierarchical deterministic paths.
            </p>
          </div>

          <div className="bg-red-600 text-white border-8 border-black p-6 shadow-brutal">
            <h3 className="text-2xl font-black mb-4 uppercase border-b-4 border-white pb-2">MULTI-CHAIN</h3>
            <p className="text-lg font-mono">
              Support for Solana (SOL) and Ethereum (ETH) networks with real-time balance fetching.
            </p>
          </div>

          <div className="bg-black text-white border-8 border-black p-6 shadow-brutal-inverse">
            <h3 className="text-2xl font-black mb-4 uppercase border-b-4 border-white pb-2">SECURE</h3>
            <p className="text-lg font-mono">
              No external dependencies. All cryptographic operations happen locally in your browser.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
