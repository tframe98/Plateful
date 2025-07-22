import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, return mock team data
    // TODO: Re-enable backend call when backend is deployed
    console.log('Demo mode: Team GET called')
    
    const mockTeamMembers = [
      {
        id: '1',
        email: 'john@restaurant.com',
        firstName: 'John',
        lastName: 'Manager',
        role: 'MANAGER',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'sarah@restaurant.com',
        firstName: 'Sarah',
        lastName: 'Chef',
        role: 'CHEF',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        email: 'mike@restaurant.com',
        firstName: 'Mike',
        lastName: 'Server',
        role: 'SERVER',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ]
    
    return NextResponse.json(mockTeamMembers)
    
    // Original code (commented out for demo):
    /*
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/team`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch team members')
    }

    const data = await response.json()
    return NextResponse.json(data)
    */
  } catch (error) {
    console.error('Team API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 