'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Calendar, 
  Clock, 
  DollarSign,
  TrendingUp,
  Award,
  FileText,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  Star
} from 'lucide-react'

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'MANAGER' | 'EMPLOYEE' | 'CHEF' | 'SERVER' | 'HOST'
  status: 'ACTIVE' | 'INACTIVE' | 'ONBOARDING' | 'TERMINATED'
  hireDate: string
  hourlyRate: number
  weeklyHours: number
  performance: {
    rating: number
    lastReview: string
    nextReview: string
  }
  onboarding: {
    isComplete: boolean
    completedSteps: string[]
    remainingSteps: string[]
  }
  contact: {
    address: string
    emergencyContact: string
    emergencyPhone: string
  }
}

interface OnboardingStep {
  id: string
  title: string
  description: string
  isRequired: boolean
  estimatedTime: number
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED'
}

export default function HRPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<'employees' | 'onboarding' | 'performance' | 'roles'>('employees')
  const [showCreateEmployeeModal, setShowCreateEmployeeModal] = useState(false)
  const [showEmployeeDetailsModal, setShowEmployeeDetailsModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    fetchHRData()
  }, [])

  useEffect(() => {
    filterEmployees()
  }, [employees, searchTerm, roleFilter, statusFilter])

  const fetchHRData = async () => {
    try {
      // TODO: Replace with actual API calls when endpoints are ready
      const mockEmployees: Employee[] = [
        {
          id: '1',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@restaurant.com',
          phone: '+1-555-0123',
          role: 'MANAGER',
          status: 'ACTIVE',
          hireDate: '2023-01-15',
          hourlyRate: 25.00,
          weeklyHours: 40,
          performance: {
            rating: 4.8,
            lastReview: '2024-01-01',
            nextReview: '2024-07-01'
          },
          onboarding: {
            isComplete: true,
            completedSteps: ['Paperwork', 'Training', 'Equipment'],
            remainingSteps: []
          },
          contact: {
            address: '123 Main St, City, State 12345',
            emergencyContact: 'John Johnson',
            emergencyPhone: '+1-555-0124'
          }
        },
        {
          id: '2',
          firstName: 'Mike',
          lastName: 'Chen',
          email: 'mike.chen@restaurant.com',
          phone: '+1-555-0456',
          role: 'CHEF',
          status: 'ACTIVE',
          hireDate: '2023-03-20',
          hourlyRate: 22.00,
          weeklyHours: 35,
          performance: {
            rating: 4.6,
            lastReview: '2024-01-15',
            nextReview: '2024-07-15'
          },
          onboarding: {
            isComplete: true,
            completedSteps: ['Paperwork', 'Training', 'Equipment', 'Kitchen Safety'],
            remainingSteps: []
          },
          contact: {
            address: '456 Oak Ave, City, State 12345',
            emergencyContact: 'Lisa Chen',
            emergencyPhone: '+1-555-0457'
          }
        },
        {
          id: '3',
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.davis@restaurant.com',
          phone: '+1-555-0789',
          role: 'SERVER',
          status: 'ONBOARDING',
          hireDate: '2024-01-10',
          hourlyRate: 15.00,
          weeklyHours: 25,
          performance: {
            rating: 0,
            lastReview: '',
            nextReview: '2024-04-10'
          },
          onboarding: {
            isComplete: false,
            completedSteps: ['Paperwork'],
            remainingSteps: ['Training', 'Equipment', 'POS System']
          },
          contact: {
            address: '789 Pine St, City, State 12345',
            emergencyContact: 'Robert Davis',
            emergencyPhone: '+1-555-0790'
          }
        }
      ]

      setEmployees(mockEmployees)
    } catch (error) {
      console.error('Error fetching HR data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterEmployees = () => {
    let filtered = employees

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.phone.includes(searchTerm)
      )
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter((employee) => employee.role === roleFilter)
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((employee) => employee.status === statusFilter)
    }

    setFilteredEmployees(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'status-ready'
      case 'ONBOARDING':
        return 'status-pending'
      case 'INACTIVE':
        return 'status-cancelled'
      case 'TERMINATED':
        return 'status-cancelled'
      default:
        return 'status-delivered'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'MANAGER':
        return 'bg-primary-100 text-primary-800'
      case 'CHEF':
        return 'bg-accent-100 text-accent-800'
      case 'SERVER':
        return 'bg-success-100 text-success-800'
      case 'HOST':
        return 'bg-warning-100 text-warning-800'
      case 'EMPLOYEE':
        return 'bg-surface-100 text-surface-600'
      default:
        return 'bg-surface-100 text-surface-600'
    }
  }

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-success-600'
    if (rating >= 4.0) return 'text-warning-600'
    return 'text-danger-600'
  }

  const getOnboardingProgress = (employee: Employee) => {
    const totalSteps = employee.onboarding.completedSteps.length + employee.onboarding.remainingSteps.length
    return totalSteps > 0 ? (employee.onboarding.completedSteps.length / totalSteps) * 100 : 0
  }

  const getEmployeesByStatus = (status: string) => {
    return employees.filter(emp => emp.status === status)
  }

  const getAveragePerformance = () => {
    const activeEmployees = employees.filter(emp => emp.status === 'ACTIVE')
    if (activeEmployees.length === 0) return 0
    return activeEmployees.reduce((sum, emp) => sum + emp.performance.rating, 0) / activeEmployees.length
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
            <h1 className="text-2xl font-bold text-surface-900">Human Resources</h1>
            <p className="text-surface-600">
              Manage employees, onboarding, and performance
            </p>
          </div>
          <button
            onClick={() => setShowCreateEmployeeModal(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
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
                    Total Employees
                  </dt>
                  <dd className="text-lg font-medium text-surface-900">
                    {employees.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-surface-500 truncate">
                    Active Employees
                  </dt>
                  <dd className="text-lg font-medium text-surface-900">
                    {getEmployeesByStatus('ACTIVE').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserPlus className="h-6 w-6 text-accent-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-surface-500 truncate">
                    Onboarding
                  </dt>
                  <dd className="text-lg font-medium text-surface-900">
                    {getEmployeesByStatus('ONBOARDING').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-surface-500 truncate">
                    Avg. Performance
                  </dt>
                  <dd className="text-lg font-medium text-surface-900">
                    {getAveragePerformance().toFixed(1)}
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
              { id: 'employees', name: 'Employees', icon: Users },
              { id: 'onboarding', name: 'Onboarding', icon: UserPlus },
              { id: 'performance', name: 'Performance', icon: Award },
              { id: 'roles', name: 'Roles & Permissions', icon: FileText }
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

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="flex-1 space-y-6">
            {/* Filters */}
            <div className="card p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Search Employees
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
                    Role
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Roles</option>
                    <option value="MANAGER">Manager</option>
                    <option value="CHEF">Chef</option>
                    <option value="SERVER">Server</option>
                    <option value="HOST">Host</option>
                    <option value="EMPLOYEE">Employee</option>
                  </select>
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
                    <option value="ACTIVE">Active</option>
                    <option value="ONBOARDING">Onboarding</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="TERMINATED">Terminated</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setRoleFilter('all')
                      setStatusFilter('all')
                    }}
                    className="btn-secondary w-full inline-flex items-center justify-center"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Employees Table */}
            <div className="card overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-surface-900 mb-4">
                  Employees ({filteredEmployees.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-surface-200">
                    <thead className="bg-surface-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Performance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Onboarding
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-surface-200">
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-surface-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary-700">
                                    {employee.firstName[0]}{employee.lastName[0]}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-surface-900">
                                  {employee.firstName} {employee.lastName}
                                </div>
                                <div className="text-sm text-surface-500">
                                  {employee.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`status-badge ${getRoleColor(employee.role)}`}>
                              {employee.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`status-badge ${getStatusColor(employee.status)}`}>
                              {employee.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`text-sm font-medium ${getPerformanceColor(employee.performance.rating)}`}>
                                {employee.performance.rating > 0 ? employee.performance.rating.toFixed(1) : 'N/A'}
                              </span>
                              {employee.performance.rating > 0 && (
                                <div className="ml-2 flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < Math.floor(employee.performance.rating)
                                          ? 'text-warning-400 fill-current'
                                          : 'text-surface-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-surface-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-primary-600 h-2 rounded-full"
                                  style={{ width: `${getOnboardingProgress(employee)}%` }}
                                />
                              </div>
                              <span className="text-sm text-surface-500">
                                {Math.round(getOnboardingProgress(employee))}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedEmployee(employee)
                                  setShowEmployeeDetailsModal(true)
                                }}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-surface-600 hover:text-surface-900">
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

        {/* Onboarding Tab */}
        {activeTab === 'onboarding' && (
          <div className="flex-1 space-y-6">
            <div className="card">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-surface-900 mb-4">
                  Onboarding Progress
                </h3>
                <div className="space-y-4">
                  {employees.filter(emp => emp.status === 'ONBOARDING').map((employee) => (
                    <div key={employee.id} className="border border-surface-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-accent-100 flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-accent-700">
                              {employee.firstName[0]}{employee.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-surface-900">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-surface-500">
                              {employee.role} • Started {new Date(employee.hireDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-surface-500">
                          {getOnboardingProgress(employee)}% Complete
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="w-full bg-surface-200 rounded-full h-2">
                          <div
                            className="bg-accent-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getOnboardingProgress(employee)}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-surface-700 mb-2">Completed Steps</h4>
                          <ul className="space-y-1">
                            {employee.onboarding.completedSteps.map((step) => (
                              <li key={step} className="flex items-center text-sm text-success-600">
                                <span className="mr-2">✓</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-surface-700 mb-2">Remaining Steps</h4>
                          <ul className="space-y-1">
                            {employee.onboarding.remainingSteps.map((step) => (
                              <li key={step} className="flex items-center text-sm text-surface-500">
                                <span className="mr-2">○</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {employees.filter(emp => emp.status === 'ONBOARDING').length === 0 && (
                    <div className="text-center py-8">
                      <UserCheck className="h-12 w-12 text-surface-400 mx-auto mb-4" />
                      <p className="text-surface-500">No employees currently in onboarding</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="flex-1 space-y-6">
            <div className="card">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-surface-900 mb-4">
                  Performance Reviews
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-surface-200">
                    <thead className="bg-surface-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Current Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Last Review
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Next Review
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-surface-200">
                      {employees.filter(emp => emp.status === 'ACTIVE').map((employee) => (
                        <tr key={employee.id} className="hover:bg-surface-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary-700">
                                    {employee.firstName[0]}{employee.lastName[0]}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-surface-900">
                                  {employee.firstName} {employee.lastName}
                                </div>
                                <div className="text-sm text-surface-500">
                                  {employee.role}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`text-sm font-medium ${getPerformanceColor(employee.performance.rating)}`}>
                                {employee.performance.rating.toFixed(1)}
                              </span>
                              <div className="ml-2 flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(employee.performance.rating)
                                        ? 'text-warning-400 fill-current'
                                        : 'text-surface-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                            {employee.performance.lastReview ? new Date(employee.performance.lastReview).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                            {new Date(employee.performance.nextReview).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-primary-600 hover:text-primary-900">
                              Schedule Review
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

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  role: 'MANAGER',
                  description: 'Full access to all features and employee management',
                  permissions: ['View all data', 'Manage employees', 'Financial reports', 'Menu management'],
                  employeeCount: employees.filter(emp => emp.role === 'MANAGER').length
                },
                {
                  role: 'CHEF',
                  description: 'Kitchen management and menu item control',
                  permissions: ['Menu management', 'Inventory tracking', 'Kitchen reports'],
                  employeeCount: employees.filter(emp => emp.role === 'CHEF').length
                },
                {
                  role: 'SERVER',
                  description: 'Order management and customer service',
                  permissions: ['Order management', 'Customer data', 'Basic reports'],
                  employeeCount: employees.filter(emp => emp.role === 'SERVER').length
                },
                {
                  role: 'HOST',
                  description: 'Reservation management and customer greeting',
                  permissions: ['Reservation management', 'Customer data'],
                  employeeCount: employees.filter(emp => emp.role === 'HOST').length
                },
                {
                  role: 'EMPLOYEE',
                  description: 'Basic access to assigned tasks',
                  permissions: ['View assigned tasks', 'Basic reporting'],
                  employeeCount: employees.filter(emp => emp.role === 'EMPLOYEE').length
                }
              ].map((roleInfo) => (
                <div key={roleInfo.role} className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-surface-900">{roleInfo.role}</h3>
                    <span className="text-sm text-surface-500">{roleInfo.employeeCount} employees</span>
                  </div>
                  <p className="text-sm text-surface-600 mb-4">{roleInfo.description}</p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-surface-700">Permissions:</h4>
                    <ul className="space-y-1">
                      {roleInfo.permissions.map((permission) => (
                        <li key={permission} className="flex items-center text-sm text-surface-600">
                          <span className="text-success-500 mr-2">✓</span>
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    
  )
} 