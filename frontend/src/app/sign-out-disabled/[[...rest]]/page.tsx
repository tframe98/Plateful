"use client"

import { SignOutButton } from '@clerk/nextjs'

export default function SignOutPage() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-surface-900 mb-4">Signing out...</h1>
        <SignOutButton />
      </div>
    </div>
  )
} 