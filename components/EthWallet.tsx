"use client"

import { useState, useCallback } from "react"
import { mnemonicToSeed } from "bip39"
import { HDNodeWallet, JsonRpcProvider, formatEther } from "ethers"
import { Plus, Loader2, Copy, ExternalLink } from "lucide-react"

interface EthWalletProps {
  mnemonic: string
}

// Update the WalletData interface to include privateKey
interface WalletData {
  address: string
  privateKey: string // Add this line
  balance: string | null
  loading: boolean
  index: number
  showPrivateKey: boolean // Add this line
}

export default function EthWallet({ mnemonic }: EthWalletProps) {
  const [wallets, setWallets] = useState<WalletData[]>([])
  const [isAdding, setIsAdding] = useState(false)

  const provider = new JsonRpcProvider("https://eth.llamarpc.com")

  // Update the addEthWallet function to store the privateKey
  const addEthWallet = useCallback(async () => {
    if (!mnemonic) return

    setIsAdding(true)
    const walletIndex = wallets.length

    try {
      // Convert mnemonic to seed
      const seed = await mnemonicToSeed(mnemonic)

      // Create HD wallet from seed
      const hdNode = HDNodeWallet.fromSeed(seed)

      // Derive path for Ethereum: m/44'/60'/i'/0/0
      const path = `m/44'/60'/${walletIndex}'/0/0`
      const derivedWallet = hdNode.derivePath(path)

      const newWallet: WalletData = {
        address: derivedWallet.address,
        privateKey: derivedWallet.privateKey, // Add this line
        balance: null,
        loading: true,
        index: walletIndex,
        showPrivateKey: false, // Add this line
      }

      setWallets((prev) => [...prev, newWallet])

      // Fetch balance
      try {
        const balance = await provider.getBalance(derivedWallet.address)
        const balanceInEth = formatEther(balance)

        setWallets((prev) =>
          prev.map((wallet) =>
            wallet.index === walletIndex ? { ...wallet, balance: balanceInEth, loading: false } : wallet,
          ),
        )
      } catch (error) {
        console.error("Error fetching balance:", error)
        setWallets((prev) =>
          prev.map((wallet) => (wallet.index === walletIndex ? { ...wallet, balance: "0.0", loading: false } : wallet)),
        )
      }
    } catch (error) {
      console.error("Error creating wallet:", error)
      setWallets((prev) =>
        prev.map((wallet) => (wallet.index === walletIndex ? { ...wallet, balance: "0.0", loading: false } : wallet)),
      )
    }

    setIsAdding(false)
  }, [mnemonic, wallets.length, provider])

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
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="space-y-6">
      <button
        onClick={addEthWallet}
        disabled={isAdding}
        className="bg-white text-blue-600 border-4 border-white px-6 py-3 font-bold text-lg shadow-brutal-white hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center gap-2"
      >
        {isAdding ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            ADDING WALLET...
          </>
        ) : (
          <>
            <Plus className="h-5 w-5" />
            ADD ETH WALLET
          </>
        )}
      </button>

      <div className="space-y-4">
        {wallets.map((wallet) => (
          <div key={wallet.index} className="bg-white border-4 border-black p-4 shadow-brutal">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
                <span className="font-bold text-lg">WALLET #{wallet.index + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyAddress(wallet.address)}
                  className="bg-yellow-500 border-2 border-black px-2 py-1 text-sm font-bold hover:translate-y-0.5 transition-all"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <a
                  href={`https://etherscan.io/address/${wallet.address}`}
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
                <span className="font-mono font-bold">{formatAddress(wallet.address)}</span>
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
                    <span className="font-mono font-bold text-blue-600">
                      {Number.parseFloat(wallet.balance || "0").toFixed(6)} ETH
                    </span>
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
                          value={wallet.privateKey}
                          className="w-full border-2 border-black p-2 text-xs font-mono bg-gray-50 overflow-x-auto"
                        />
                        <button
                          onClick={() => copyAddress(wallet.privateKey)}
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
          <p className="font-mono text-lg">NO ETHEREUM WALLETS YET</p>
          <p className="font-mono text-sm text-gray-300 mt-2">Click "ADD ETH WALLET" to generate your first wallet</p>
        </div>
      )}
    </div>
  )
}
