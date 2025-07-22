import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // For demo purposes, return mock success response
    // TODO: Re-enable backend call when backend is deployed
    console.log('Demo mode: Team invite called with:', body)
    
    return NextResponse.json({
      message: 'Invitation sent successfully (demo mode)',
      invitationId: 'demo-invitation-id',
      userId: 'demo-user-id'
    })
    
    // Original code (commented out for demo):
    /*
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/team/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('Failed to send invitation')
    }

    const data = await response.json()
    return NextResponse.json(data)
    */
  } catch (error) {
    console.error('Team invite API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 