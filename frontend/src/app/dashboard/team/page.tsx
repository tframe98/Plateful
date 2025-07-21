"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Plus, Mail, User, Trash2 } from 'lucide-react'
import { ManagerOnly } from '@/components/ProtectedRoute'
import { faker } from '@faker-js/faker'

interface TeamMember {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  createdAt: string
}

const roles = [
  { label: 'Manager', value: 'MANAGER' },
  { label: 'Chef', value: 'CHEF' },
  { label: 'Server', value: 'SERVER' },
  { label: 'Host', value: 'HOST' },
  { label: 'Employee', value: 'EMPLOYEE' },
]

function generateFakeTeamMembers(count: number = 5): TeamMember[] {
  return Array.from({ length: count }, (_, i) => {
    const role = faker.helpers.arrayElement(roles).value
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role,
      isActive: faker.datatype.boolean({ probability: 0.8 }),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
    }
  })
}

export default function TeamPage() {
  return (
    <ManagerOnly fallback={
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need manager permissions to access team management.</p>
        </div>
      </div>
    }>
      <TeamManagementContent />
    </ManagerOnly>
  )
}

function TeamManagementContent() {
  const { user } = useUser()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('EMPLOYEE')
  const [inviting, setInviting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // For demo, use fake data
    setLoading(true)
    setTimeout(() => {
      setTeamMembers(generateFakeTeamMembers(6))
      setLoading(false)
    }, 500)
  }, [])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviting(true)
    setError('')
    // For demo, just add a fake member
    setTimeout(() => {
      setTeamMembers(prev => [
        {
          id: faker.string.uuid(),
          email: inviteEmail,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          role: inviteRole,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        ...prev
      ])
      setInviteEmail('')
      setInviteRole('EMPLOYEE')
      setInviting(false)
    }, 600)
  }

  const handleRemoveMember = (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return
    setTeamMembers(prev => prev.filter(m => m.id !== memberId))
  }

  const handleUpdateRole = (memberId: string, newRole: string) => {
    setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m))
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <button className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </button>
      </div>

      {/* Invite Form */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Invite New Team Member</h2>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                className="input-field w-full"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                placeholder="employee@restaurant.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                className="input-field w-full"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                required
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
                disabled={inviting || !inviteEmail}
              >
                <Mail className="h-4 w-4" />
                <span>{inviting ? 'Sending...' : 'Send Invitation'}</span>
              </button>
            </div>
          </div>
          {error && <div className="text-danger-600 text-sm">{error}</div>}
        </form>
      </div>

      {/* Team Members List */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4 px-6 pt-6">Current Team Members</h2>
        <div className="overflow-x-auto px-6 pb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-gray-400" />
                      {member.firstName} {member.lastName}
                    </div>
                  </td>
                  <td className="py-3 px-4">{member.email}</td>
                  <td className="py-3 px-4">
                    <select
                      className="input-field text-sm"
                      value={member.role}
                      onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        member.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-danger-600 hover:text-danger-800"
                      title="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {teamMembers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No team members found. Invite your first team member above.
          </div>
        )}
      </div>
    </div>
  )
} 