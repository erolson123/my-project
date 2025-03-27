import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthContextProvider } from './context/AuthContext'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Essay Checker',
  description: 'AI-powered essay analysis and improvement tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50 pt-6">
            {children}
          </main>
        </AuthContextProvider>
      </body>
    </html>
  )
} 