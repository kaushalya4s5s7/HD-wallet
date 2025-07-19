# 🔐 HD-Wallet: Multi-Chain Wallet from a Single Seed Phrase

[Live Demo 🌐](https://hd-wallet-gamma.vercel.app)

HD-Wallet is a modern web-based cryptocurrency wallet that enables users to generate and manage **Ethereum** and **Solana** wallets from a single **mnemonic seed phrase**. Designed with scalability and developer experience in mind, this wallet unifies access to multiple blockchain networks through a secure, user-friendly interface.

---

## 🧠 Theoretical Concepts Implemented

This project integrates foundational cryptographic and blockchain standards that enable secure multi-chain wallet functionality from a single seed.

### 1. **Hierarchical Deterministic (HD) Wallets**
- Implements [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki), [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki), and [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki).
- Allows a single mnemonic phrase to generate multiple wallets deterministically across different blockchain networks.
- Derivation paths used:
  - Ethereum: `m/44'/60'/0'/0/0`
  - Solana: uses `ed25519-hd-key` for key derivation.

### 2. **Mnemonic Phrase (BIP39)**
- A 12-word mnemonic is generated using BIP39.
- The mnemonic is converted into a 512-bit seed using PBKDF2 with HMAC-SHA512.
- This seed is the root for deriving private/public key pairs for different wallets.

### 3. **Elliptic Curve Cryptography**
- Ethereum: `secp256k1` curve (via `ethers.js`)
- Solana: `ed25519` curve (via `tweetnacl` and `@solana/web3.js`)
- These curves are used for generating keys and signing transactions securely.

### 4. **Cross-Chain Wallet Logic**
- From one mnemonic, valid accounts are generated for both Ethereum and Solana.
- This eliminates the need for managing multiple wallets or seed phrases.

### 5. **Client-Side Only / Non-Custodial Design**
- No keys are stored or transmitted to any backend.
- Everything happens in the user's browser, maintaining full user control.

---

## 🚀 Features

- 🔑 Generate deterministic wallets for Ethereum and Solana from one seed phrase
- 🌉 Unified interface for cross-chain wallet management
- 💡 Built with TypeScript + Next.js for safety and speed
- ⚛️ Ethereum interaction via `ethers.js`
- 🛠️ Solana interaction via `@solana/web3.js` and `@solana/wallet-adapter`
- 🧠 Mnemonic and HD key derivation using `bip39` and `ed25519-hd-key`
- 🎨 Beautiful UI using Radix UI and Tailwind CSS
- 🎯 Form validation with React Hook Form + Zod
- 🧪 Devtools and utilities for debugging and testing

---

## 🧱 Technologies Used

| Category       | Tech Stack                                                                 |
|----------------|----------------------------------------------------------------------------|
| Framework      | [Next.js](https://nextjs.org/)                                             |
| Language       | [TypeScript](https://www.typescriptlang.org/)                             |
| Styling        | [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/) |
| Ethereum       | [ethers.js](https://docs.ethers.io/)                                       |
| Solana         | [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/), [@solana/wallet-adapter](https://github.com/solana-labs/wallet-adapter) |
| Wallet Logic   | [bip39](https://github.com/bitcoinjs/bip39), [ed25519-hd-key](https://github.com/paulmillr/ed25519-keygen) |
| Crypto Utils   | [tweetnacl](https://github.com/dchest/tweetnacl-js)                        |
| Forms & Validation | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)    |
| Charts & UI    | [Embla Carousel](https://www.embla-carousel.com/), [Recharts](https://recharts.org/) |
| Animations     | [Framer Motion](https://www.framer.com/motion/) (optional)                 |

---

##  Contribution
  - please feel free to contribute to make this wallet more secure and more friendly
