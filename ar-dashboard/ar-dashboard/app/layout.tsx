import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'

export const metadata: Metadata = {
  title: 'AR Analytics Dashboard',
  description: 'AR Interaction & Purchase Intent Analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-bg text-white font-sans antialiased">
        <Sidebar />
        <main className="ml-64 flex-1 overflow-auto">
          <div className="min-h-screen p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
