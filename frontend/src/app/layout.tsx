import { type Metadata } from 'next'
import {
  ClerkProvider,
  UserButton,
  SignedIn,
} from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Plateful - Management Dashboard',
  description: 'Comprehensive restaurant management system for orders, scheduling, and analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SignedIn>
            <div className="fixed top-0 right-0 z-50 p-4">
              <UserButton />
            </div>
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
