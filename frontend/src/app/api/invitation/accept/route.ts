import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // For demo purposes, return mock success response
    // TODO: Re-enable backend call when backend is deployed
    console.log('Demo mode: Invitation accept called with:', body)
    
    return NextResponse.json({
      message: 'Invitation accepted successfully (demo mode)',
      user: {
        id: body.userId,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        role: 'EMPLOYEE',
        restaurantId: 'demo-restaurant-id'
      }
    })
    
    // Original code (commented out for demo):
    /*
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/invitation/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('Failed to accept invitation')
    }

    const data = await response.json()
    return NextResponse.json(data)
    */
  } catch (error) {
    console.error('Invitation accept API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 