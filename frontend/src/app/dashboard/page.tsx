"use client"

import { useState } from 'react'
import Link from 'next/link'
import { 
  ShoppingCart, 
  Calendar, 
  Users, 
  BarChart3, 
  Menu,
  Clock,
  TrendingUp,
  DollarSign,
  ArrowLeft
} from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

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

  const navigation = [
    { name: 'Overview', id: 'overview', icon: BarChart3 },
    { name: 'Orders', id: 'orders', icon: ShoppingCart },
    { name: 'Menu', id: 'menu', icon: Menu },
    { name: 'Schedule', id: 'schedule', icon: Calendar },
    { name: 'Team', id: 'team', icon: Users },
    { name: 'Analytics', id: 'analytics', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Plateful Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Demo Mode</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === item.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    onClick={() => setActiveTab(action.href.split('/').pop() || 'overview')}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
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
                  </button>
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
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Order management interface would go here.</p>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu Management</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Menu management interface would go here.</p>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Staff Schedule</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Staff scheduling interface would go here.</p>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Team Management</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Team management interface would go here.</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Analytics and reporting interface would go here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 