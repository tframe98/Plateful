'use client'

import { useState, useEffect } from 'react'
import { faker } from '@faker-js/faker'
import { Plus, Search, Filter, MoreVertical } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail: string
  status: string
  totalAmount: string | number
  taxAmount: string | number
  tipAmount: string | number
  source: string
  createdAt: string
  orderItems: Array<{
    id: string
    quantity: number
    unitPrice: number
    totalPrice: number
    menuItem: {
      name: string
    }
  }>
}

// Generate fake orders data
const generateFakeOrders = (count: number = 25): Order[] => {
  const menuItems = [
    'Margherita Pizza', 'Pepperoni Pizza', 'Caesar Salad', 'Chicken Wings',
    'Pasta Carbonara', 'Garlic Bread', 'Tiramisu', 'Coke', 'Beer', 'Wine',
    'Burger Deluxe', 'Fish & Chips', 'Steak Frites', 'Soup of the Day',
    'Chocolate Cake', 'Ice Cream', 'Coffee', 'Tea', 'Lemonade', 'Water'
  ]

  const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
  const sources = ['POS', 'UberEats', 'DoorDash']

  return Array.from({ length: count }, (_, index) => {
    const itemCount = faker.number.int({ min: 1, max: 5 })
    const orderItems = Array.from({ length: itemCount }, () => {
      const menuItem = faker.helpers.arrayElement(menuItems)
      const quantity = faker.number.int({ min: 1, max: 3 })
      const unitPrice = parseFloat(faker.commerce.price({ min: 5, max: 25 }))
      return {
        id: faker.string.uuid(),
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice,
        menuItem: { name: menuItem }
      }
    })

    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0)
    const taxAmount = subtotal * 0.08 // 8% tax
    const tipAmount = faker.datatype.boolean() ? parseFloat(faker.commerce.price({ min: 2, max: 10 })) : 0
    const totalAmount = subtotal + taxAmount + tipAmount

    return {
      id: faker.string.uuid(),
      orderNumber: `ORD-${faker.number.int({ min: 1000, max: 9999 })}`,
      customerName: faker.person.fullName(),
      customerPhone: faker.phone.number(),
      customerEmail: faker.internet.email(),
      status: faker.helpers.arrayElement(statuses),
      totalAmount: totalAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      tipAmount: tipAmount.toFixed(2),
      source: faker.helpers.arrayElement(sources),
      createdAt: faker.date.recent({ days: 30 }).toISOString(),
      orderItems
    }
  })
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { getToken, isLoaded, isSignedIn } = useAuth()

  useEffect(() => {
    if (isLoaded) {
      fetchOrders();
    }
  }, [isLoaded]);

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter, sourceFilter])

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Generate fake orders for demo purposes
      const fakeOrders = generateFakeOrders(25);
      setOrders(fakeOrders);
      console.log('Generated fake orders:', fakeOrders.length);
    } catch (error) {
      console.error('Failed to generate orders:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filterOrders = () => {
    let filtered = orders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerPhone.includes(searchTerm)
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Filter by source
    if (sourceFilter !== 'all') {
      filtered = filtered.filter((order) => order.source === sourceFilter)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // For demo purposes, just update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'preparing':
        return 'bg-orange-100 text-orange-800'
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'delivered':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-surface-100 text-surface-600'
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'POS':
        return 'bg-blue-100 text-blue-800'
      case 'UberEats':
        return 'bg-black text-white'
      case 'DoorDash':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-surface-100 text-surface-600'
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
      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Demo Mode
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                This page is displaying fake data generated with Faker.js for demonstration purposes. 
                Click "Refresh" to generate new random orders.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Orders</h1>
          <p className="text-surface-600">
            Manage customer orders and track their status
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchOrders()}
            className="btn-secondary inline-flex items-center"
          >
            <Search className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Source
            </label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Sources</option>
              <option value="POS">POS</option>
              <option value="UberEats">UberEats</option>
              <option value="DoorDash">DoorDash</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setSourceFilter('all')
              }}
              className="btn-secondary w-full inline-flex items-center justify-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="px-6 py-4 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-surface-900">
            Orders ({filteredOrders.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
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
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-surface-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-surface-900">
                      {order.orderNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-surface-900">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-surface-500">
                        {order.customerPhone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-surface-900">
                      {order.orderItems.length} items
                    </div>
                    <div className="text-sm text-surface-500">
                      {order.orderItems
                        .map((item) => item.menuItem.name)
                        .join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-surface-900">
                      ${Number(order.totalAmount).toFixed(2)}
                    </div>
                    {order.tipAmount && (
                      <div className="text-sm text-surface-500">
                        Tip: ${Number(order.tipAmount).toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className={`status-badge ${getStatusColor(
                        order.status
                      )} border-0 focus:ring-0`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`status-badge ${getSourceColor(
                        order.source
                      )}`}
                    >
                      {order.source || 'POS'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-surface-400 hover:text-surface-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 