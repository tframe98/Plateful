'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  revenue: {
    daily: number
    weekly: number
    monthly: number
    trend: number
  }
  orders: {
    total: number
    pending: number
    completed: number
    cancelled: number
    trend: number
  }
  customers: {
    total: number
    new: number
    returning: number
    trend: number
  }
  performance: {
    avgOrderValue: number
    avgPreparationTime: number
    customerSatisfaction: number
    trend: number
  }
  salesByCategory: Array<{
    category: string
    sales: number
    percentage: number
  }>
  hourlySales: Array<{
    hour: number
    sales: number
    orders: number
  }>
  topItems: Array<{
    name: string
    sales: number
    quantity: number
  }>
  sourceBreakdown: Array<{
    source: string
    orders: number
    revenue: number
    percentage: number
  }>
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week')
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'customers'>('revenue')

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      // TODO: Replace with actual API calls when endpoints are ready
      const mockData: AnalyticsData = {
        revenue: {
          daily: 2847.50,
          weekly: 19832.75,
          monthly: 79456.20,
          trend: 12.5
        },
        orders: {
          total: 156,
          pending: 23,
          completed: 128,
          cancelled: 5,
          trend: 8.2
        },
        customers: {
          total: 89,
          new: 12,
          returning: 77,
          trend: 15.3
        },
        performance: {
          avgOrderValue: 32.45,
          avgPreparationTime: 18.5,
          customerSatisfaction: 4.6,
          trend: 2.1
        },
        salesByCategory: [
          { category: 'Main Courses', sales: 12450.75, percentage: 45.2 },
          { category: 'Appetizers', sales: 6840.30, percentage: 24.8 },
          { category: 'Beverages', sales: 4120.15, percentage: 14.9 },
          { category: 'Desserts', sales: 3421.55, percentage: 12.4 },
          { category: 'Other', sales: 718.25, percentage: 2.7 }
        ],
        hourlySales: [
          { hour: 11, sales: 1250, orders: 15 },
          { hour: 12, sales: 2840, orders: 32 },
          { hour: 13, sales: 3120, orders: 28 },
          { hour: 14, sales: 1890, orders: 18 },
          { hour: 15, sales: 1450, orders: 12 },
          { hour: 16, sales: 1680, orders: 14 },
          { hour: 17, sales: 2340, orders: 22 },
          { hour: 18, sales: 4560, orders: 38 },
          { hour: 19, sales: 5230, orders: 42 },
          { hour: 20, sales: 4120, orders: 35 },
          { hour: 21, sales: 2980, orders: 25 },
          { hour: 22, sales: 1560, orders: 12 }
        ],
        topItems: [
          { name: 'Grilled Salmon', sales: 2840.50, quantity: 89 },
          { name: 'Beef Burger', sales: 2340.75, quantity: 156 },
          { name: 'Caesar Salad', sales: 1890.25, quantity: 94 },
          { name: 'Margherita Pizza', sales: 1650.80, quantity: 82 },
          { name: 'Chicken Pasta', sales: 1420.60, quantity: 71 }
        ],
        sourceBreakdown: [
          { source: 'POS', orders: 89, revenue: 12450.75, percentage: 57.1 },
          { source: 'UberEats', orders: 45, revenue: 6840.30, percentage: 28.8 },
          { source: 'DoorDash', orders: 22, revenue: 3421.55, percentage: 14.1 }
        ]
      }

      setAnalyticsData(mockData)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRevenueValue = () => {
    if (!analyticsData) return 0
    switch (timeRange) {
      case 'day': return analyticsData.revenue.daily
      case 'week': return analyticsData.revenue.weekly
      case 'month': return analyticsData.revenue.monthly
      default: return analyticsData.revenue.weekly
    }
  }

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-success-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-danger-600" />
    )
  }

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? 'text-success-600' : 'text-danger-600'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (isLoading) {
    return (
      
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      
    )
  }

  if (!analyticsData) {
    return (
      
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-surface-400 mx-auto mb-4" />
          <p className="text-surface-500">No analytics data available</p>
        </div>
      
    )
  }

  return (
    
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Analytics & Reports</h1>
            <p className="text-surface-600">
              Track your restaurant's performance and key metrics
            </p>
          </div>
          <div className="flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="input-field"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
            <button
              onClick={fetchAnalyticsData}
              className="btn-secondary inline-flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button className="btn-primary inline-flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500">Total Revenue</p>
                <p className="text-2xl font-bold text-surface-900">
                  {formatCurrency(getRevenueValue())}
                </p>
              </div>
              <div className="flex items-center">
                {getTrendIcon(analyticsData.revenue.trend)}
                <span className={`text-sm font-medium ml-1 ${getTrendColor(analyticsData.revenue.trend)}`}>
                  {Math.abs(analyticsData.revenue.trend)}%
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-surface-500">
                <DollarSign className="h-4 w-4 mr-1" />
                vs previous period
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500">Total Orders</p>
                <p className="text-2xl font-bold text-surface-900">
                  {analyticsData.orders.total}
                </p>
              </div>
              <div className="flex items-center">
                {getTrendIcon(analyticsData.orders.trend)}
                <span className={`text-sm font-medium ml-1 ${getTrendColor(analyticsData.orders.trend)}`}>
                  {Math.abs(analyticsData.orders.trend)}%
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-surface-500">
                <BarChart3 className="h-4 w-4 mr-1" />
                {analyticsData.orders.pending} pending
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500">Customers</p>
                <p className="text-2xl font-bold text-surface-900">
                  {analyticsData.customers.total}
                </p>
              </div>
              <div className="flex items-center">
                {getTrendIcon(analyticsData.customers.trend)}
                <span className={`text-sm font-medium ml-1 ${getTrendColor(analyticsData.customers.trend)}`}>
                  {Math.abs(analyticsData.customers.trend)}%
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-surface-500">
                <Users className="h-4 w-4 mr-1" />
                {analyticsData.customers.new} new today
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500">Avg. Order Value</p>
                <p className="text-2xl font-bold text-surface-900">
                  {formatCurrency(analyticsData.performance.avgOrderValue)}
                </p>
              </div>
              <div className="flex items-center">
                {getTrendIcon(analyticsData.performance.trend)}
                <span className={`text-sm font-medium ml-1 ${getTrendColor(analyticsData.performance.trend)}`}>
                  {Math.abs(analyticsData.performance.trend)}%
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-surface-500">
                <Clock className="h-4 w-4 mr-1" />
                {analyticsData.performance.avgPreparationTime}min prep time
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales by Category */}
          <div className="card">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-surface-900 mb-4">
                Sales by Category
              </h3>
              <div className="space-y-4">
                {analyticsData.salesByCategory.map((category) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary-500 mr-3"></div>
                      <span className="text-sm font-medium text-surface-900">
                        {category.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-surface-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-surface-500 w-16 text-right">
                        {formatCurrency(category.sales)}
                      </span>
                      <span className="text-sm font-medium text-surface-900 w-12 text-right">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hourly Sales */}
          <div className="card">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-surface-900 mb-4">
                Hourly Sales Performance
              </h3>
              <div className="space-y-3">
                {analyticsData.hourlySales.map((hourData) => (
                  <div key={hourData.hour} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-surface-900 w-12">
                      {hourData.hour}:00
                    </span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-surface-200 rounded-full h-2">
                        <div
                          className="bg-success-600 h-2 rounded-full"
                          style={{ 
                            width: `${(hourData.sales / Math.max(...analyticsData.hourlySales.map(h => h.sales))) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-surface-900">
                        {formatCurrency(hourData.sales)}
                      </div>
                      <div className="text-xs text-surface-500">
                        {hourData.orders} orders
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Items */}
          <div className="card">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-surface-900 mb-4">
                Top Selling Items
              </h3>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-surface-200">
                  <thead className="bg-surface-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                        Sales
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-surface-200">
                    {analyticsData.topItems.map((item, index) => (
                      <tr key={item.name} className="hover:bg-surface-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary-700">
                                  {index + 1}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-surface-900">
                                {item.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-surface-900">
                          {formatCurrency(item.sales)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-surface-500">
                          {item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Source Breakdown */}
          <div className="card">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-surface-900 mb-4">
                Order Source Breakdown
              </h3>
              <div className="space-y-4">
                {analyticsData.sourceBreakdown.map((source) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        source.source === 'POS' ? 'bg-primary-500' :
                        source.source === 'UberEats' ? 'bg-surface-900' :
                        'bg-danger-500'
                      }`}></div>
                      <span className="text-sm font-medium text-surface-900">
                        {source.source}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 bg-surface-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${source.percentage}%`,
                            backgroundColor: source.source === 'POS' ? '#3b82f6' :
                                            source.source === 'UberEats' ? '#1e293b' :
                                            '#ef4444'
                          }}
                        />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-surface-900">
                          {formatCurrency(source.revenue)}
                        </div>
                        <div className="text-xs text-surface-500">
                          {source.orders} orders
                        </div>
                      </div>
                      <span className="text-sm font-medium text-surface-900 w-12 text-right">
                        {source.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-surface-900 mb-4">
              Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {analyticsData.performance.customerSatisfaction.toFixed(1)}
                </div>
                <div className="text-sm text-surface-500">Customer Satisfaction</div>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(analyticsData.performance.customerSatisfaction)
                          ? 'text-warning-400'
                          : 'text-surface-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-success-600 mb-2">
                  {analyticsData.performance.avgPreparationTime}
                </div>
                <div className="text-sm text-surface-500">Avg. Preparation Time (min)</div>
                <div className="text-xs text-surface-400 mt-1">
                  Target: 20 minutes
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 mb-2">
                  {((analyticsData.orders.completed / analyticsData.orders.total) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-surface-500">Order Completion Rate</div>
                <div className="text-xs text-surface-400 mt-1">
                  {analyticsData.orders.completed} of {analyticsData.orders.total} orders
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  )
} 