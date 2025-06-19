"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import {  useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Toaster,toast } from "sonner";


const Devtools= ()=>{
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState(0);
    const [balance, setBalance] = useState(0);


    function handleBalanceCheck() {
        if (!publicKey) {
            console.error("Wallet not connected");
            return;
        }
        connection.getBalance(publicKey)
            .then((balance) => {
                setBalance(balance / 1e9); // Convert lamports to SOL
                console.log("Current balance:", balance / 1e9, "SOL");
            })
            .catch((error) => {
                console.error("Failed to get balance:", error);
            });
    }


    const [isAirdropping, setIsAirdropping] = useState(false);

    const handleAirdrop = () => {
        if(!publicKey){
            toast('wallet not connected');
            return
        }
      setIsAirdropping(true); // show spinner

      connection
        .requestAirdrop(publicKey, amount * 1e9) // Convert SOL to lamports
        .then((signature) => {
          console.log("Airdrop requested with signature:", signature);
          return connection.confirmTransaction(signature, "confirmed");
        })
        .then(() => {
          toast.success("✅ Airdrop successful");
        })
        .catch((error) => {
          toast.error("❌ Airdrop failed");
          console.error("Airdrop failed:", error);
        })
        .finally(() => {
          setIsAirdropping(false); // hide spinner
        });}

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <section className="w-full max-w-md mx-auto space-y-8 flex flex-col items-center">
                <div className="bg-white border-8 border-black p-8 shadow-brutal w-full rounded-lg flex flex-col items-center">
                    <h2 className="text-3xl font-black mb-6 uppercase border-b-4 border-black pb-2 text-center w-full">Airdrop SOL</h2>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="Enter amount in SOL"
                        className="border-4 border-black rounded-md p-3 mb-6 w-full text-lg font-mono shadow-brutal focus:outline-none focus:border-blue-600 transition"
                    />
                    <button
                        onClick={handleAirdrop}
                        disabled={isAirdropping}
                        className="relative w-full px-4 py-3 bg-purple-600 rounded text-white font-bold text-lg border-4 border-black shadow-brutal hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 mb-4"
                    >
                        {isAirdropping ? (
                            <span className="flex items-center gap-2 justify-center">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
                                </svg>
                                Airdropping...
                            </span>
                        ) : (
                            "💧 Get Airdrop"
                        )}
                    </button>
                    <div className="mt-2 mb-6 w-full text-center">
                        <p className="text-base font-mono">Current Balance: <span className="font-bold">{balance} SOL</span></p>
                    </div>
                    <button
                        onClick={handleBalanceCheck}
                        className="w-full bg-blue-600 text-white rounded-md px-4 py-3 font-bold text-lg border-4 border-black shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
                    >
                        Get Balance
                    </button>
                </div>
            </section>
        </div>
    );

}
export default Devtools;