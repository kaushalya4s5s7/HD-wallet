import type { Metadata } from 'next'
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { SolanaProvider } from '@/components/provider/Solana'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'KCs Vault',
  description: 'kirats assignment',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
         <SolanaProvider> <Toaster
            position="bottom-right"
            theme="dark"
            closeButton
            richColors={false}
            toastOptions={{
              style: {
                background: "#171717",
                color: "white",
                border: "1px solid rgba(75, 85, 99, 0.3)",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
              },
              className: "toast-container",
            }}
          />{children}</SolanaProvider></body>
    </html>
  )
}
