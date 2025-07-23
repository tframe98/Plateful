"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Demo manager account
    if (email === 'manager@demo.com' && password === 'demo123') {
      router.push('/dashboard?role=manager')
    } else if (email === 'employee@demo.com' && password === 'demo123') {
      router.push('/dashboard?role=employee')
    } else {
      setError('Invalid credentials. Try manager@demo.com / demo123 or employee@demo.com / demo123')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to Plateful
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                {error}
              </div>
            )}
            <button 
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Sign In
            </button>
          </form>
          
          {/* Demo Accounts Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Accounts:</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Manager:</strong> manager@demo.com / demo123</p>
              <p><strong>Employee:</strong> employee@demo.com / demo123</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-primary-600 hover:text-primary-500">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 