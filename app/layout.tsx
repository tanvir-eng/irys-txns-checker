// app/layout.tsx
import './globals.css'

export const metadata = {
  title: 'Irys Transaction Checker',
  description: 'Check your transaction count on Irys Network Testnet',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
