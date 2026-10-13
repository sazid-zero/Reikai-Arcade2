import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { auth } from '@lib/auth'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const dynamic = 'force-dynamic'

function cleanPhone(raw: string): string {
  return raw.replace(/[\s\-\(\)]/g, '')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = (body.name || '').trim()
    const password = body.password || ''
    const rawPhone = (body.phone || '').trim()
    const rawEmail = (body.email || '').trim().toLowerCase()
    const primaryType = body.primaryType || (rawPhone ? 'phone' : 'email')

    if (!name) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 })
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 })
    }

    const phone = rawPhone ? cleanPhone(rawPhone) : ''

    // Validate based on primary type
    if (primaryType === 'phone') {
      if (!phone || phone.length < 8) {
        return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 })
      }
      // Check if phone already registered
      const phoneCheck = await pool.query('SELECT id FROM "user" WHERE phone = $1 LIMIT 1', [phone])
      if (phoneCheck.rows.length > 0) {
        return NextResponse.json({ error: 'This phone number is already registered. Please sign in.' }, { status: 400 })
      }
    } else {
      if (!rawEmail || !rawEmail.includes('@')) {
        return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
      }
    }

    // Determine the email identifier used for BetterAuth credentials
    const finalEmail = rawEmail || `${phone}@phone.reikai.arcade`

    // Check if email already registered
    const emailCheck = await pool.query('SELECT id FROM "user" WHERE LOWER(email) = $1 LIMIT 1', [finalEmail])
    if (emailCheck.rows.length > 0) {
      return NextResponse.json({ error: 'An account with this email already exists. Please sign in.' }, { status: 400 })
    }

    // Call BetterAuth to create user and session
    const response = await auth.api.signUpEmail({
      body: {
        name,
        email: finalEmail,
        password,
      },
      headers: req.headers,
      asResponse: true,
    })

    // If BetterAuth returned error
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errData.message || errData.error || 'Failed to create account.' },
        { status: response.status || 400 }
      )
    }

    // Fetch the newly created user and update phone number & role
    try {
      const uRes = await pool.query('SELECT id FROM "user" WHERE LOWER(email) = $1 LIMIT 1', [finalEmail])
      if (uRes.rows.length > 0) {
        const userId = uRes.rows[0].id
        await pool.query(
          'UPDATE "user" SET phone = $1, role = $2 WHERE id = $3',
          [phone || null, 'user', userId]
        )
      }
    } catch (dbErr) {
      console.error('Failed to set phone on new user:', dbErr)
    }

    // Pass through cookies from BetterAuth response
    const resHeaders = new Headers()
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        resHeaders.append(key, value)
      }
    })

    return new NextResponse(
      JSON.stringify({
        success: true,
        user: {
          name,
          email: finalEmail,
          phone: phone || null,
          role: 'user',
        },
      }),
      {
        status: 200,
        headers: resHeaders,
      }
    )
  } catch (error: any) {
    console.error('Error registering user:', error)
    return NextResponse.json({ error: error?.message || 'Registration failed. Please try again.' }, { status: 500 })
  }
}
