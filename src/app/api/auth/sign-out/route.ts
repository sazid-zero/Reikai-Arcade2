import { NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { logoutAdmin } from '@lib/admin-auth'
import { auth } from '@lib/auth'

export async function POST() {
  try {
    await logoutAdmin()
    try {
      const reqHeaders = await headers()
      await auth.api.signOut({ headers: reqHeaders })
    } catch {
      // ignore
    }
    const cookieStore = await cookies()
    cookieStore.delete('better-auth.session_token')
    cookieStore.delete('better-auth.csrf_token')
    cookieStore.delete('__Secure-better-auth.session_token')

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 })
  }
}
