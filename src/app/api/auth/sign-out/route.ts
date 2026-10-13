import { NextResponse } from 'next/server'
import { logoutAdmin } from '@lib/admin-auth'

export async function POST() {
  try {
    await logoutAdmin()
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 })
  }
}
