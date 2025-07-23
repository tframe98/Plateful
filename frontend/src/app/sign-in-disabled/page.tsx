'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Utensils, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // For demo purposes, we'll use mock authentication
      // In production, this would call your actual auth API
      const mockUsers = [
        { email: 'manager@restaurant.com', password: 'password', role: 'MANAGER', firstName: 'Sarah', lastName: 'Johnson' },
        { email: 'chef@restaurant.com', password: 'password', role: 'CHEF', firstName: 'Mike', lastName: 'Chen' },
        { email: 'server@restaurant.com', password: 'password', role: 'SERVER', firstName: 'Emily', lastName: 'Davis' },
        { email: 'host@restaurant.com', password: 'password', role: 'HOST', firstName: 'Alex', lastName: 'Wilson' },
        { email: 'employee@restaurant.com', password: 'password', role: 'EMPLOYEE', firstName: 'Jordan', lastName: 'Brown' }
      ]

      const user = mockUsers.find(u => u.email === email && u.password === password)

      if (user) {
        console.log('Logging in user:', user)
        await login({
          id: '1',
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role as 'MANAGER' | 'CHEF' | 'SERVER' | 'HOST' | 'EMPLOYEE'
        })
        console.log('Login successful, redirecting to dashboard')
        router.push('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center text-surface-600 hover:text-surface-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="flex justify-center">
          <div className="flex items-center">
            <Utensils className="h-12 w-12 text-primary-600" />
            <span className="ml-3 text-2xl font-bold text-surface-900">Restaurant SaaS</span>
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-bold text-surface-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-surface-600">
          Access your restaurant management dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-surface-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-surface-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-surface-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex justify-center py-3"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-surface-500">Demo Accounts</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="text-sm text-surface-600">
                <strong>Manager:</strong> manager@restaurant.com / password
              </div>
              <div className="text-sm text-surface-600">
                <strong>Chef:</strong> chef@restaurant.com / password
              </div>
              <div className="text-sm text-surface-600">
                <strong>Server:</strong> server@restaurant.com / password
              </div>
              <div className="text-sm text-surface-600">
                <strong>Host:</strong> host@restaurant.com / password
              </div>
              <div className="text-sm text-surface-600">
                <strong>Employee:</strong> employee@restaurant.com / password
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-surface-200">
              <div className="text-center">
                <p className="text-sm text-surface-600 mb-3">
                  For new restaurant owners with full features:
                </p>
                <Link 
                  href="/sign-up" 
                  className="btn-secondary w-full flex justify-center py-3"
                >
                  Create New Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 