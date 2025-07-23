"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

const roles = [
  { label: 'Manager', value: 'MANAGER' },
  { label: 'Chef', value: 'CHEF' },
  { label: 'Server', value: 'SERVER' },
  { label: 'Host', value: 'HOST' },
  { label: 'Employee', value: 'EMPLOYEE' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [restaurantAddress, setRestaurantAddress] = useState('')
  const [restaurantPhone, setRestaurantPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isLoaded && user && role) {
        // Update user role in Clerk
        await user.update({ unsafeMetadata: { role } })
        
        // Create restaurant and associate user
        const response = await fetch('/api/onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            restaurantName,
            restaurantAddress,
            restaurantPhone,
            role,
            userId: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create restaurant')
        }

        router.push('/dashboard')
      }
    } catch (err) {
      setError('Failed to save information. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-surface-50">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome! Set Up Your Restaurant</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Restaurant Name:</label>
            <input
              type="text"
              className="input-field w-full"
              value={restaurantName}
              onChange={e => setRestaurantName(e.target.value)}
              required
              placeholder="Enter restaurant name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Restaurant Address:</label>
            <input
              type="text"
              className="input-field w-full"
              value={restaurantAddress}
              onChange={e => setRestaurantAddress(e.target.value)}
              placeholder="Enter restaurant address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Restaurant Phone:</label>
            <input
              type="tel"
              className="input-field w-full"
              value={restaurantPhone}
              onChange={e => setRestaurantPhone(e.target.value)}
              placeholder="Enter restaurant phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Your Role:</label>
            <select
              className="input-field w-full"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            >
              <option value="" disabled>Select your role</option>
              {roles.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          {error && <div className="text-danger-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading || !role || !restaurantName}
          >
            {loading ? 'Setting up...' : 'Continue to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
} 