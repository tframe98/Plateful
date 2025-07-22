import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // For demo purposes, return mock success response
    // TODO: Re-enable backend call when backend is deployed
    console.log('Demo mode: Onboarding called with:', body)
    
    return NextResponse.json({
      message: 'Onboarding completed successfully (demo mode)',
      restaurant: {
        id: 'demo-restaurant-id',
        name: body.restaurantName,
        address: body.restaurantAddress,
        phone: body.restaurantPhone
      },
      user: {
        id: body.userId,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        role: body.role || 'MANAGER',
        restaurantId: 'demo-restaurant-id'
      }
    })
    
    // Original code (commented out for demo):
    /*
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('Failed to complete onboarding')
    }

    const data = await response.json()
    return NextResponse.json(data)
    */
  } catch (error) {
    console.error('Onboarding API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 