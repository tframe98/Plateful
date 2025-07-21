import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/team`, {
      headers: {
        'Authorization': request.headers.get('authorization') || '',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch team members')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Team API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 