import { NextResponse } from 'next/server'
import { getAdminSession } from '@lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getAdminSession()
    return NextResponse.json({
      user: session?.user
        ? {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name || 'Admin',
            role: session.user.role || 'admin',
          }
        : null,
    })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}
