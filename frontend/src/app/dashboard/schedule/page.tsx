'use client'

import { useState, useEffect } from 'react'
import { faker } from '@faker-js/faker'
import { Calendar, Plus } from 'lucide-react'

interface Shift {
  id: string
  employee: string
  role: string
  startTime: string
  endTime: string
  status: string
}

const roles = ['Manager', 'Chef', 'Server', 'Host', 'Employee']
const statuses = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

function generateFakeShifts(count: number = 20): Shift[] {
  return Array.from({ length: count }, () => {
    const start = faker.date.soon({ days: 14 })
    const end = new Date(start.getTime() + faker.number.int({ min: 4, max: 8 }) * 60 * 60 * 1000)
    return {
      id: faker.string.uuid(),
      employee: faker.person.fullName(),
      role: faker.helpers.arrayElement(roles),
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: faker.helpers.arrayElement(statuses)
    }
  })
}

export default function SchedulePage() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setShifts(generateFakeShifts(20))
      setIsLoading(false)
    }, 500)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
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
                This page is displaying fake shift data generated with Faker.js for demonstration purposes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        <button className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Shift
        </button>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Upcoming Shifts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-surface-200">
            <thead className="bg-surface-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">End Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-surface-200">
              {shifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-surface-50">
                  <td className="px-6 py-4 whitespace-nowrap">{shift.employee}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{shift.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(shift.startTime).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(shift.endTime).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="status-badge bg-blue-100 text-blue-800">{shift.status}</span>
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