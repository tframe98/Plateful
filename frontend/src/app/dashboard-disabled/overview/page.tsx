'use client'

import { useEffect, useState } from 'react'
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Calendar,
} from 'lucide-react'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  customerCount: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  customerName: string
  totalAmount: number
  status: string
  createdAt: string
}

export default function OverviewPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    customerCount: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data for demo purposes
    const mockStats = {
      totalOrders: 1247,
      totalRevenue: 45678.90,
      averageOrderValue: 36.67,
      customerCount: 342,
    }

    const mockRecentOrders = [
      {
        id: '1',
        orderNumber: '#ORD-001',
        customerName: 'John Smith',
        totalAmount: 45.99,
        status: 'Ready',
        createdAt: '2024-01-15',
      },
      {
        id: '2',
        orderNumber: '#ORD-002',
        customerName: 'Sarah Johnson',
        totalAmount: 32.50,
        status: 'Preparing',
        createdAt: '2024-01-15',
      },
      {
        id: '3',
        orderNumber: '#ORD-003',
        customerName: 'Mike Chen',
        totalAmount: 67.25,
        status: 'Pending',
        createdAt: '2024-01-15',
      },
      {
        id: '4',
        orderNumber: '#ORD-004',
        customerName: 'Emily Davis',
        totalAmount: 28.75,
        status: 'Delivered',
        createdAt: '2024-01-15',
      },
      {
        id: '5',
        orderNumber: '#ORD-005',
        customerName: 'Alex Wilson',
        totalAmount: 89.99,
        status: 'Confirmed',
        createdAt: '2024-01-15',
      },
    ]

    // Simulate API call
    setTimeout(() => {
      setStats(mockStats)
      setRecentOrders(mockRecentOrders)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning-100 text-warning-800'
      case 'confirmed':
        return 'bg-primary-100 text-primary-800'
      case 'preparing':
        return 'bg-accent-100 text-accent-800'
      case 'ready':
        return 'bg-success-100 text-success-800'
      case 'delivered':
        return 'bg-surface-100 text-surface-800'
      default:
        return 'bg-surface-100 text-surface-800'
    }
  }

  if (isLoading) {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      
    )
  }

  return (
    
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Dashboard Overview</h1>
          <p className="text-surface-600">
            Welcome to your restaurant management dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingCart className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-surface-500 truncate">
                      Total Orders
                    </dt>
                    <dd className="text-lg font-medium text-surface-900">
                      {stats.totalOrders.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-surface-500 truncate">
                      Total Revenue
                    </dt>
                    <dd className="text-lg font-medium text-surface-900">
                      ${stats.totalRevenue.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-accent-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-surface-500 truncate">
                      Avg Order Value
                    </dt>
                    <dd className="text-lg font-medium text-surface-900">
                      ${stats.averageOrderValue.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-warning-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-surface-500 truncate">
                      Customers
                    </dt>
                    <dd className="text-lg font-medium text-surface-900">
                      {stats.customerCount.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-surface-900 mb-4">
              Recent Orders
            </h3>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-surface-200">
                <thead className="bg-surface-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-surface-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                                                  ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                        {order.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <h3 className="text-sm font-medium text-surface-900">
                    Today's Schedule
                  </h3>
                  <p className="text-sm text-surface-500">
                    View employee shifts and schedules
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <h3 className="text-sm font-medium text-surface-900">
                    Reservations
                  </h3>
                  <p className="text-sm text-surface-500">
                    Manage table reservations
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-accent-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <h3 className="text-sm font-medium text-surface-900">
                    Analytics
                  </h3>
                  <p className="text-sm text-surface-500">
                    View detailed reports and insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  )
} 