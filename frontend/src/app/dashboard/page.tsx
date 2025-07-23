"use client"

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  ShoppingCart, 
  Calendar, 
  Users, 
  BarChart3, 
  Menu,
  Clock,
  TrendingUp,
  DollarSign,
  ArrowLeft,
  Settings,
  UserCheck,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react'

// Faker data generation
const generateOrders = () => {
  const statuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled']
  const sources = ['POS', 'UberEats', 'DoorDash', 'Phone']
  
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    orderNumber: `ORD-${String(i + 1).padStart(4, '0')}`,
    customerName: `Customer ${i + 1}`,
    items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
      name: `Item ${j + 1}`,
      quantity: Math.floor(Math.random() * 3) + 1,
      price: (Math.random() * 20 + 5).toFixed(2)
    })),
    total: (Math.random() * 100 + 20).toFixed(2),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    time: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toLocaleTimeString()
  }))
}

const generateMenuItems = () => {
  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Sides']
  const items = [
    { name: 'Caesar Salad', price: 12.99, category: 'Appetizers' },
    { name: 'Grilled Salmon', price: 24.99, category: 'Main Course' },
    { name: 'Chocolate Cake', price: 8.99, category: 'Desserts' },
    { name: 'Iced Tea', price: 3.99, category: 'Beverages' },
    { name: 'French Fries', price: 5.99, category: 'Sides' },
    { name: 'Bruschetta', price: 9.99, category: 'Appetizers' },
    { name: 'Chicken Pasta', price: 18.99, category: 'Main Course' },
    { name: 'Tiramisu', price: 10.99, category: 'Desserts' },
    { name: 'Coffee', price: 4.99, category: 'Beverages' },
    { name: 'Onion Rings', price: 6.99, category: 'Sides' }
  ]
  
  return items.map((item, i) => ({
    id: i + 1,
    ...item,
    available: Math.random() > 0.2
  }))
}

const generateShifts = () => {
  const roles = ['Server', 'Chef', 'Host', 'Bartender', 'Manager']
  const employees = ['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Rodriguez', 'Lisa Wang']
  
  return Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    employee: employees[Math.floor(Math.random() * employees.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    startTime: `${Math.floor(Math.random() * 12) + 6}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    endTime: `${Math.floor(Math.random() * 12) + 6}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    status: Math.random() > 0.8 ? 'confirmed' : 'pending'
  }))
}

const generateTeamMembers = () => {
  const roles = ['Manager', 'Server', 'Chef', 'Host', 'Bartender']
  const statuses = ['Active', 'On Leave', 'Terminated']
  
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    email: `employee${i + 1}@restaurant.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`
  }))
}

const generateAnalytics = () => {
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toLocaleDateString()
  }).reverse()
  
  return days.map((date, i) => ({
    date,
    orders: Math.floor(Math.random() * 50) + 20,
    revenue: Math.floor(Math.random() * 2000) + 800,
    customers: Math.floor(Math.random() * 30) + 15
  }))
}

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userRole, setUserRole] = useState('employee')
  const [orders, setOrders] = useState(generateOrders())
  const [menuItems, setMenuItems] = useState(generateMenuItems())
  const [shifts, setShifts] = useState(generateShifts())
  const [teamMembers, setTeamMembers] = useState(generateTeamMembers())
  const [analytics, setAnalytics] = useState(generateAnalytics())
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Appetizers' })
  
  const searchParams = useSearchParams()

  useEffect(() => {
    const role = searchParams.get('role') || 'employee'
    setUserRole(role)
  }, [searchParams])

  const isManager = userRole === 'manager'

  const stats = [
    {
      name: 'Total Orders',
      value: orders.length.toString(),
      change: '+12%',
      changeType: 'positive',
      icon: ShoppingCart,
    },
    {
      name: 'Revenue',
      value: `$${orders.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(0)}`,
      change: '+8%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      name: 'Active Staff',
      value: teamMembers.filter(m => m.status === 'Active').length.toString(),
      change: '+2',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Menu Items',
      value: menuItems.length.toString(),
      change: '+3',
      changeType: 'positive',
      icon: Menu,
    },
  ]

  const quickActions = isManager ? [
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
  ] : [
    {
      name: 'View Orders',
      href: '/dashboard/orders',
      icon: ShoppingCart,
      description: 'View assigned orders',
    },
    {
      name: 'My Schedule',
      href: '/dashboard/schedule',
      icon: Calendar,
      description: 'View my work schedule',
    },
    {
      name: 'Team',
      href: '/dashboard/team',
      icon: Users,
      description: 'View team members',
    },
  ]

  const navigation = isManager ? [
    { name: 'Overview', id: 'overview', icon: BarChart3 },
    { name: 'Orders', id: 'orders', icon: ShoppingCart },
    { name: 'Menu', id: 'menu', icon: Menu },
    { name: 'Schedule', id: 'schedule', icon: Calendar },
    { name: 'Team', id: 'team', icon: Users },
    { name: 'Analytics', id: 'analytics', icon: TrendingUp },
  ] : [
    { name: 'Overview', id: 'overview', icon: BarChart3 },
    { name: 'Orders', id: 'orders', icon: ShoppingCart },
    { name: 'Schedule', id: 'schedule', icon: Calendar },
    { name: 'Team', id: 'team', icon: Users },
  ]

  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTeamMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddMenuItem = () => {
    if (newItem.name && newItem.price) {
      setMenuItems([...menuItems, {
        id: menuItems.length + 1,
        name: newItem.name,
        price: parseFloat(newItem.price),
        category: newItem.category,
        available: true
      }])
      setNewItem({ name: '', price: '', category: 'Appetizers' })
      setShowAddModal(false)
    }
  }

  const handleDeleteMenuItem = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id))
  }

  const handleToggleAvailability = (id: number) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'preparing': return 'bg-blue-100 text-blue-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'delivered': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
              <div className="ml-4 flex items-center">
                <UserCheck className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600 capitalize">{userRole}</span>
              </div>
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

        {/* Search Bar */}
        {activeTab !== 'overview' && activeTab !== 'analytics' && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Message */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Welcome back, {isManager ? 'Manager' : 'Team Member'}!
              </h2>
              <p className="text-gray-600">
                {isManager 
                  ? 'Here\'s an overview of your restaurant\'s performance today.'
                  : 'Here\'s what you need to know for your shift today.'
                }
              </p>
            </div>

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
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
              {isManager && (
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items.length} items</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.source}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'menu' && isManager && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Menu Management</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMenuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.available ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          onClick={() => handleToggleAvailability(item.id)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {item.available ? 'Disable' : 'Enable'}
                        </button>
                        <button 
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {isManager ? 'Staff Schedule' : 'My Schedule'}
              </h2>
              {isManager && (
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Shift
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shifts.map((shift) => (
                    <tr key={shift.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shift.employee}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shift.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.startTime} - {shift.endTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          shift.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {shift.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {isManager ? 'Team Management' : 'Team Members'}
              </h2>
              {isManager && (
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                    {isManager && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTeamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          member.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          member.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.joinDate}</td>
                      {isManager && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button className="text-primary-600 hover:text-primary-900">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Remove</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && isManager && (
          <div className="space-y-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 30 Days)</h3>
              <div className="h-64 flex items-end space-x-2">
                {analytics.map((day, i) => (
                  <div key={i} className="flex-1 bg-primary-200 rounded-t" style={{ height: `${(day.revenue / 2800) * 100}%` }}>
                    <div className="text-xs text-center mt-2 text-gray-600">${day.revenue}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend (Last 30 Days)</h3>
              <div className="h-64 flex items-end space-x-2">
                {analytics.map((day, i) => (
                  <div key={i} className="flex-1 bg-green-200 rounded-t" style={{ height: `${(day.orders / 70) * 100}%` }}>
                    <div className="text-xs text-center mt-2 text-gray-600">{day.orders}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-sm font-medium text-gray-500">Total Revenue</h4>
                <p className="text-2xl font-bold text-gray-900">
                  ${analytics.reduce((sum, day) => sum + day.revenue, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-sm font-medium text-gray-500">Total Orders</h4>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.reduce((sum, day) => sum + day.orders, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-sm font-medium text-gray-500">Total Customers</h4>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.reduce((sum, day) => sum + day.customers, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Menu Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Menu Item</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option>Appetizers</option>
                    <option>Main Course</option>
                    <option>Desserts</option>
                    <option>Beverages</option>
                    <option>Sides</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMenuItem}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
} 