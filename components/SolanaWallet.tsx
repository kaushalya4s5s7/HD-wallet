"use client"

import { useState, useCallback } from "react"
import { mnemonicToSeed } from "bip39"
import { derivePath } from "ed25519-hd-key"
import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js"
import nacl from "tweetnacl"
import { Plus, Loader2, Copy, ExternalLink } from "lucide-react"

interface SolanaWalletProps {
  mnemonic: string
}

interface WalletData {
  publicKey: string
  secretKey: string // Add this line
  balance: number | null
  loading: boolean
  index: number
  showPrivateKey: boolean // Add this line
}

export default function SolanaWallet({ mnemonic }: SolanaWalletProps) {
  const [wallets, setWallets] = useState<WalletData[]>([])
  const [isAdding, setIsAdding] = useState(false)

  const connection = new Connection("https://api.devnet.solana.com", "confirmed")

  const addSolanaWallet = useCallback(async () => {
    if (!mnemonic) return

    setIsAdding(true)
    const walletIndex = wallets.length

    try {
      // Convert mnemonic to seed
      const seed = await mnemonicToSeed(mnemonic)

      // Derive path for Solana: m/44'/501'/i'/0'
      const path = `m/44'/501'/${walletIndex}'/0'`
      const derivedSeed = derivePath(path, seed.toString("hex")).key

      // Create keypair using tweetnacl
      const keypair = nacl.sign.keyPair.fromSeed(derivedSeed)

      // Create Solana Keypair from the secret key
      const solanaKeypair = new Keypair({
        publicKey: keypair.publicKey,
        secretKey: keypair.secretKey,
      })

      const newWallet: WalletData = {
        publicKey: solanaKeypair.publicKey.toString(),
        secretKey: Buffer.from(solanaKeypair.secretKey).toString("hex"), // Add this line
        balance: null,
        loading: true,
        index: walletIndex,
        showPrivateKey: false, // Add this line
      }

      setWallets((prev) => [...prev, newWallet])

      // Fetch balance
      try {
        const balance = await connection.getBalance(solanaKeypair.publicKey)
        const balanceInSol = balance / LAMPORTS_PER_SOL

        setWallets((prev) =>
          prev.map((wallet) =>
            wallet.index === walletIndex ? { ...wallet, balance: balanceInSol, loading: false } : wallet,
          ),
        )
      } catch (error) {
        console.error("Error fetching balance:", error)
        setWallets((prev) =>
          prev.map((wallet) => (wallet.index === walletIndex ? { ...wallet, balance: 0, loading: false } : wallet)),
        )
      }
    } catch (error) {
      console.error("Error creating wallet:", error)
    }

    setIsAdding(false)
  }, [mnemonic, wallets.length, connection])

  // Add a function to toggle private key visibility
  const togglePrivateKey = (index: number) => {
    setWallets((prev) =>
      prev.map((wallet) => (wallet.index === index ? { ...wallet, showPrivateKey: !wallet.showPrivateKey } : wallet)),
    )
  }

  const copyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div className="space-y-6">
      <button
        onClick={addSolanaWallet}
        disabled={isAdding}
        className="bg-white text-purple-600 border-4 border-white px-6 py-3 font-bold text-lg shadow-brutal-white hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center gap-2"
      >
        {isAdding ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            ADDING WALLET...
          </>
        ) : (
          <>
            <Plus className="h-5 w-5" />
            ADD SOLANA WALLET
          </>
        )}
      </button>

      <div className="space-y-4">
        {wallets.map((wallet) => (
          <div key={wallet.index} className="bg-white border-4 border-black p-4 shadow-brutal">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-purple-600 rounded-full"></div>
                <span className="font-bold text-lg">WALLET #{wallet.index + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyAddress(wallet.publicKey)}
                  className="bg-yellow-500 border-2 border-black px-2 py-1 text-sm font-bold hover:translate-y-0.5 transition-all"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <a
                  href={`https://explorer.solana.com/address/${wallet.publicKey}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white border-2 border-black px-2 py-1 text-sm font-bold hover:translate-y-0.5 transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm">PUBLIC KEY:</span>
                <span className="font-mono font-bold">{formatAddress(wallet.publicKey)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-sm">BALANCE:</span>
                <div className="flex items-center gap-2">
                  {wallet.loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="font-mono font-bold">LOADING...</span>
                    </>
                  ) : (
                    <span className="font-mono font-bold text-purple-600">{wallet.balance?.toFixed(6)} SOL</span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t-2 border-black mt-2">
                <button
                  onClick={() => togglePrivateKey(wallet.index)}
                  className="bg-red-600 text-white border-2 border-black px-3 py-1 text-sm font-bold hover:translate-y-0.5 transition-all w-full mb-2"
                >
                  {wallet.showPrivateKey ? "HIDE PRIVATE KEY" : "SHOW PRIVATE KEY"}
                </button>

                {wallet.showPrivateKey && (
                  <div className="space-y-2">
                    <div className="bg-black text-white p-2 text-xs">
                      ⚠️ WARNING: Never share your private key with anyone!
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-sm">PRIVATE KEY:</span>
                      <div className="flex items-center mt-1">
                        <input
                          type="text"
                          readOnly
                          value={wallet.secretKey}
                          className="w-full border-2 border-black p-2 text-xs font-mono bg-gray-50 overflow-x-auto"
                        />
                        <button
                          onClick={() => copyAddress(wallet.secretKey)}
                          className="bg-yellow-500 border-2 border-black px-2 py-2 text-sm font-bold hover:translate-y-0.5 transition-all ml-2"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {wallets.length === 0 && (
        <div className="bg-black text-white border-4 border-white p-6 text-center">
          <p className="font-mono text-lg">NO SOLANA WALLETS YET</p>
          <p className="font-mono text-sm text-gray-300 mt-2">
            Click "ADD SOLANA WALLET" to generate your first wallet
          </p>
        </div>
      )}
    </div>
  )
}
