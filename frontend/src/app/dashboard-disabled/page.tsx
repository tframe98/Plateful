"use client"

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ShoppingCart, 
  Calendar, 
  Users, 
  BarChart3, 
  Menu,
  Clock,
  TrendingUp,
  DollarSign
} from 'lucide-react'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const searchParams = useSearchParams()
  const [processingInvitation, setProcessingInvitation] = useState(false)

  useEffect(() => {
    // Check if user just completed signup and needs to accept invitation
    const handleInvitationAcceptance = async () => {
      if (!isLoaded || !user) return

      // Check if user has a pending invitation (you might want to add a flag in Clerk metadata)
      const hasPendingInvitation = user.unsafeMetadata?.pendingInvitation as { invitationId: string } | undefined
      
      if (hasPendingInvitation) {
        setProcessingInvitation(true)
        try {
          // Call invitation acceptance endpoint
          const response = await fetch('/api/invitation/accept', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              invitationId: hasPendingInvitation.invitationId,
              userId: user.id,
              email: user.emailAddresses[0]?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
            }),
          })

          if (response.ok) {
            // Clear the pending invitation flag
            await user.update({ 
              unsafeMetadata: { 
                ...user.unsafeMetadata,
                pendingInvitation: null 
              } 
            })
          }
        } catch (error) {
          console.error('Failed to accept invitation:', error)
        } finally {
          setProcessingInvitation(false)
        }
      }
    }

    handleInvitationAcceptance()
  }, [isLoaded, user])

  if (processingInvitation) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Setting up your account...</p>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Orders',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: ShoppingCart,
    },
    {
      name: 'Revenue',
      value: '$12,345',
      change: '+8%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      name: 'Active Staff',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Menu Items',
      value: '45',
      change: '+3',
      changeType: 'positive',
      icon: Menu,
    },
  ]

  const quickActions = [
    {
      name: 'New Order',
      href: '/dashboard/orders',
      icon: ShoppingCart,
      description: 'Create a new customer order',
    },
    {
      name: 'Schedule',
      href: '/dashboard/schedule',
      icon: Calendar,
      description: 'Manage staff schedules',
    },
    {
      name: 'Team',
      href: '/dashboard/team',
      icon: Users,
      description: 'Manage team members',
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      description: 'View performance metrics',
    },
  ]

  return (
    <div className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <action.icon className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  New order #1234 received
                </p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  Sarah Johnson joined the team
                </p>
                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  Daily sales target reached
                </p>
                <p className="text-sm text-gray-500">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 