'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useAuthStore } from '@/store/auth'
import {
  LayoutDashboard,
  ShoppingCart,
  Calendar,
  Users,
  Settings,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react'

const getNavigation = (userRole: string) => {
  const allNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['MANAGER', 'EMPLOYEE', 'CHEF', 'SERVER', 'HOST'] },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart, roles: ['MANAGER', 'CHEF', 'SERVER'] },
    { name: 'Menu', href: '/dashboard/menu', icon: Menu, roles: ['MANAGER', 'CHEF'] },
    { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar, roles: ['MANAGER', 'EMPLOYEE', 'CHEF', 'SERVER', 'HOST'] },
    { name: 'Team', href: '/dashboard/team', icon: Users, roles: ['MANAGER'] },
    { name: 'CRM', href: '/dashboard/crm', icon: Users, roles: ['MANAGER'] },
    { name: 'HR', href: '/dashboard/hr', icon: Settings, roles: ['MANAGER'] },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, roles: ['MANAGER'] },
  ]

  return allNavigation.filter(item => item.roles.includes(userRole))
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser()
  const { user: authUser, logout } = useAuthStore()

  // Use Clerk user if available, otherwise fall back to auth store (for demo accounts)
  const user = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    firstName: clerkUser.firstName || '',
    lastName: clerkUser.lastName || '',
    role: (clerkUser.unsafeMetadata?.role as string) || 'EMPLOYEE'
  } : authUser

  // Debug logging
  console.log('DashboardLayout Debug:', {
    clerkUser: !!clerkUser,
    authUser: !!authUser,
    user: user,
    userRole: user?.role,
    clerkLoaded
  })

  // Ensure we always have a role, default to MANAGER for demo accounts
  const userRole = user?.role || (authUser ? 'MANAGER' : 'EMPLOYEE')
  const navigation = getNavigation(userRole)
  
  console.log('Navigation items:', navigation)

  // If no navigation items, show at least Dashboard
  const finalNavigation = navigation.length > 0 ? navigation : [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['MANAGER', 'EMPLOYEE', 'CHEF', 'SERVER', 'HOST'] }
  ]

  const handleLogout = () => {
    if (clerkUser) {
      // Clerk user - redirect to Clerk sign out
      window.location.href = '/sign-out'
    } else {
      // Demo user - use auth store logout
      logout()
      window.location.href = '/login'
    }
  }

  // Show loading state while Clerk is loading
  if (clerkLoaded === false) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-surface-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="fixed inset-0 bg-surface-600 bg-opacity-75" />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold text-surface-900">
              Restaurant SaaS
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-surface-400 hover:text-surface-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {finalNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-primary-500' : 'text-surface-400'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-surface-200 p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-gray-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-surface-200">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-surface-900">
              Restaurant SaaS
            </h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {finalNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-primary-500' : 'text-surface-400'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-surface-200 p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-surface-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-surface-700">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-surface-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center px-2 py-2 text-sm font-medium text-surface-600 hover:bg-surface-50 hover:text-surface-900 rounded-md"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-surface-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-surface-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-surface-200" />
              <div className="flex items-center gap-x-4">
                <span className="text-sm text-surface-700">
                  Welcome, {user?.firstName}!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 