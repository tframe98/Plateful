import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/team/${params.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('authorization') || '',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('Failed to update team member')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Team update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/team/${params.userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': request.headers.get('authorization') || '',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to remove team member')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Team remove API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 