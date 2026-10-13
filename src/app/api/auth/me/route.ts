import { NextResponse } from 'next/server'
import { getCurrentUserSession } from '@lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUserSession()
    return NextResponse.json({
      user: user
        ? {
            id: user.id,
            email: user.email,
            phone: user.phone || null,
            name: user.name || 'Gamer',
            role: user.role || 'user',
          }
        : null,
    })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}
