'use client'

import { useState, useEffect } from 'react'
import { reservationsAPI } from '@/lib/api'
import { 
  Users, 
  Gift, 
  Mail, 
  Crown, 
  Calendar, 
  Phone, 
  Mail as MailIcon,
  Plus,
  Search,
  Filter,
  Send,
  Edit,
  Trash2
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  birthday?: string
  loyaltyTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM'
  points: number
  totalSpent: number
  lastVisit: string
  reservations: Array<{
    id: string
    reservationTime: string
    partySize: number
    status: string
  }>
}

interface Newsletter {
  id: string
  subject: string
  content: string
  status: 'DRAFT' | 'SENT'
  sentAt?: string
  recipients: number
}

export default function CRMPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<'customers' | 'loyalty' | 'newsletter' | 'birthdays'>('customers')
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false)
  const [showNewsletterModal, setShowNewsletterModal] = useState(false)

  useEffect(() => {
    fetchCRMData()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [customers, searchTerm, tierFilter])

  const fetchCRMData = async () => {
    try {
      // TODO: Replace with actual API calls when endpoints are ready
      const mockCustomers: Customer[] = [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@email.com',
          phone: '+1-555-0123',
          birthday: '1990-03-15',
          loyaltyTier: 'GOLD',
          points: 450,
          totalSpent: 1250.00,
          lastVisit: '2024-01-10',
          reservations: [
            { id: '1', reservationTime: '2024-01-15T19:00:00Z', partySize: 4, status: 'CONFIRMED' }
          ]
        },
        {
          id: '2',
          name: 'Bob Smith',
          email: 'bob@email.com',
          phone: '+1-555-0456',
          birthday: '1985-07-22',
          loyaltyTier: 'SILVER',
          points: 180,
          totalSpent: 680.00,
          lastVisit: '2024-01-08',
          reservations: []
        },
        {
          id: '3',
          name: 'Carol Davis',
          email: 'carol@email.com',
          phone: '+1-555-0789',
          birthday: '1992-11-08',
          loyaltyTier: 'BRONZE',
          points: 75,
          totalSpent: 320.00,
          lastVisit: '2024-01-05',
          reservations: []
        }
      ]

      const mockNewsletters: Newsletter[] = [
        {
          id: '1',
          subject: 'New Year Special Offers',
          content: 'Start the new year with amazing deals...',
          status: 'SENT',
          sentAt: '2024-01-01T10:00:00Z',
          recipients: 150
        },
        {
          id: '2',
          subject: 'Valentine\'s Day Menu Preview',
          content: 'Discover our romantic Valentine\'s Day specials...',
          status: 'DRAFT',
          recipients: 0
        }
      ]

      setCustomers(mockCustomers)
      setNewsletters(mockNewsletters)
    } catch (error) {
      console.error('Error fetching CRM data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterCustomers = () => {
    let filtered = customers

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm)
      )
    }

    // Filter by tier
    if (tierFilter !== 'all') {
      filtered = filtered.filter((customer) => customer.loyaltyTier === tierFilter)
    }

    setFilteredCustomers(filtered)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BRONZE':
        return 'bg-amber-100 text-amber-800'
      case 'SILVER':
        return 'bg-gray-100 text-gray-800'
      case 'GOLD':
        return 'bg-yellow-100 text-yellow-800'
      case 'PLATINUM':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-surface-100 text-surface-600'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'BRONZE':
        return '🥉'
      case 'SILVER':
        return '🥈'
      case 'GOLD':
        return '🥇'
      case 'PLATINUM':
        return '💎'
      default:
        return '👤'
    }
  }

  const getUpcomingBirthdays = () => {
    const today = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)

    return customers.filter(customer => {
      if (!customer.birthday) return false
      
      const birthday = new Date(customer.birthday)
      const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate())
      
      // If birthday has passed this year, check next year
      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(today.getFullYear() + 1)
      }
      
      return thisYearBirthday >= today && thisYearBirthday <= thirtyDaysFromNow
    })
  }

  const sendBirthdayReward = async (customerId: string) => {
    try {
      // TODO: Implement birthday reward sending
      console.log('Sending birthday reward to customer:', customerId)
      alert('Birthday reward sent!')
    } catch (error) {
      console.error('Error sending birthday reward:', error)
    }
  }

  const sendNewsletter = async (newsletterId: string) => {
    try {
      // TODO: Implement newsletter sending
      console.log('Sending newsletter:', newsletterId)
      alert('Newsletter sent successfully!')
    } catch (error) {
      console.error('Error sending newsletter:', error)
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Customer Relationship Management</h1>
            <p className="text-surface-600">
              Manage customers, loyalty programs, and communications
            </p>
          </div>
          <button
            onClick={() => setShowCreateCustomerModal(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="card p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-surface-500 truncate">
                    Total Customers
                  </dt>
                  <dd className="text-lg font-medium text-surface-900">
                    {customers.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Gift className="h-6 w-6 text-accent-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-surface-500 truncate">
                    Upcoming Birthdays
                  </dt>
                  <dd className="text-lg font-medium text-surface-900">
                    {getUpcomingBirthdays().length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Crown className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-surface-500 truncate">
                    Gold+ Members
                  </dt>
                  <dd className="text-lg font-medium text-surface-900">
                    {customers.filter(c => ['GOLD', 'PLATINUM'].includes(c.loyaltyTier)).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Mail className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-surface-500 truncate">
                    Newsletters Sent
                  </dt>
                  <dd className="text-lg font-medium text-surface-900">
                    {newsletters.filter(n => n.status === 'SENT').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-surface-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'customers', name: 'Customers', icon: Users },
              { id: 'loyalty', name: 'Loyalty Program', icon: Crown },
              { id: 'newsletter', name: 'Newsletter', icon: Mail },
              { id: 'birthdays', name: 'Birthdays', icon: Gift }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="flex-1 space-y-6">
            {/* Filters */}
            <div className="card p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Search Customers
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Loyalty Tier
                  </label>
                  <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Tiers</option>
                    <option value="BRONZE">Bronze</option>
                    <option value="SILVER">Silver</option>
                    <option value="GOLD">Gold</option>
                    <option value="PLATINUM">Platinum</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setTierFilter('all')
                    }}
                    className="btn-secondary w-full inline-flex items-center justify-center"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Customers Table */}
            <div className="card overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-surface-900 mb-4">
                  Customers ({filteredCustomers.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-surface-200">
                    <thead className="bg-surface-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Loyalty Tier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Total Spent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Last Visit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-surface-200">
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-surface-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary-700">
                                    {customer.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-surface-900">
                                  {customer.name}
                                </div>
                                <div className="text-sm text-surface-500">
                                  {customer.reservations.length} reservations
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-surface-900">{customer.email}</div>
                            <div className="text-sm text-surface-500">{customer.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-lg mr-2">{getTierIcon(customer.loyaltyTier)}</span>
                              <span className={`status-badge ${getTierColor(customer.loyaltyTier)}`}>
                                {customer.loyaltyTier}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                            {customer.points.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                            ${customer.totalSpent.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                            {new Date(customer.lastVisit).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-primary-600 hover:text-primary-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-surface-600 hover:text-surface-900">
                                <MailIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loyalty Program Tab */}
        {activeTab === 'loyalty' && (
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { tier: 'BRONZE', points: 0, benefits: ['Free birthday dessert', 'Monthly newsletter'] },
                { tier: 'SILVER', points: 100, benefits: ['Free birthday dessert', 'Monthly newsletter', 'Priority reservations'] },
                { tier: 'GOLD', points: 500, benefits: ['Free birthday dessert', 'Monthly newsletter', 'Priority reservations', 'Free appetizer'] },
                { tier: 'PLATINUM', points: 1000, benefits: ['All Gold benefits', 'Exclusive events', 'Personal manager'] }
              ].map((tierInfo) => (
                <div key={tierInfo.tier} className="card p-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">{getTierIcon(tierInfo.tier)}</div>
                    <h3 className="text-lg font-medium text-surface-900 mb-2">{tierInfo.tier}</h3>
                    <p className="text-sm text-surface-500 mb-4">{tierInfo.points} points required</p>
                    <ul className="text-sm text-surface-600 space-y-1">
                      {tierInfo.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-success-500 mr-2">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-surface-900">Newsletter Management</h3>
              <button
                onClick={() => setShowNewsletterModal(true)}
                className="btn-primary inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Newsletter
              </button>
            </div>

            <div className="card">
              <div className="px-4 py-5 sm:p-6">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-surface-200">
                    <thead className="bg-surface-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Recipients
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Sent Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-surface-200">
                      {newsletters.map((newsletter) => (
                        <tr key={newsletter.id} className="hover:bg-surface-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-surface-900">
                              {newsletter.subject}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`status-badge ${
                              newsletter.status === 'SENT' ? 'status-delivered' : 'status-pending'
                            }`}>
                              {newsletter.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                            {newsletter.recipients}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                            {newsletter.sentAt ? new Date(newsletter.sentAt).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {newsletter.status === 'DRAFT' && (
                                <button
                                  onClick={() => sendNewsletter(newsletter.id)}
                                  className="text-success-600 hover:text-success-900"
                                >
                                  <Send className="h-4 w-4" />
                                </button>
                              )}
                              <button className="text-primary-600 hover:text-primary-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-danger-600 hover:text-danger-900">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Birthdays Tab */}
        {activeTab === 'birthdays' && (
          <div className="flex-1 space-y-6">
            <div className="card">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-surface-900 mb-4">
                  Upcoming Birthdays (Next 30 Days)
                </h3>
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-surface-200">
                    <thead className="bg-surface-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Birthday
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Loyalty Tier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-surface-200">
                      {getUpcomingBirthdays().map((customer) => (
                        <tr key={customer.id} className="hover:bg-surface-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-accent-700">
                                    {customer.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-surface-900">
                                  {customer.name}
                                </div>
                                <div className="text-sm text-surface-500">
                                  {customer.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                            {customer.birthday && new Date(customer.birthday).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`status-badge ${getTierColor(customer.loyaltyTier)}`}>
                              {customer.loyaltyTier}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => sendBirthdayReward(customer.id)}
                              className="btn-success inline-flex items-center"
                            >
                              <Gift className="h-4 w-4 mr-2" />
                              Send Reward
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    
  )
} 