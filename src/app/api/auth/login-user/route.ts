import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { auth } from '@lib/auth'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const dynamic = 'force-dynamic'

function normalizePhone(raw: string): string[] {
  const digits = raw.replace(/\D/g, '')
  const variants = new Set<string>()

  variants.add(digits)
  if (digits.startsWith('880')) {
    variants.add(digits.slice(2))
    variants.add('+' + digits)
  } else if (digits.startsWith('0')) {
    variants.add('88' + digits)
    variants.add('+88' + digits)
  } else {
    variants.add('0' + digits)
    variants.add('+880' + digits)
  }

  return Array.from(variants)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const rawIdentifier = (body.identifier || '').trim()
    const password = body.password || ''

    if (!rawIdentifier) {
      return NextResponse.json({ error: 'Please enter your email or phone number.' }, { status: 400 })
    }
    if (!password) {
      return NextResponse.json({ error: 'Please enter your password.' }, { status: 400 })
    }

    let targetEmail = rawIdentifier.toLowerCase()

    // If identifier is not an email, resolve it by phone number
    if (!rawIdentifier.includes('@')) {
      const phoneVariants = normalizePhone(rawIdentifier)
      const placeholders = phoneVariants.map((_, i) => `$${i + 1}`).join(', ')
      const generatedEmail = `${phoneVariants[0]}@phone.reikai.arcade`

      const query = `
        SELECT id, email, name, phone, role 
        FROM "user" 
        WHERE phone IN (${placeholders}) 
           OR email = $${phoneVariants.length + 1}
        LIMIT 1
      `
      const res = await pool.query(query, [...phoneVariants, generatedEmail])

      if (res.rows.length === 0) {
        return NextResponse.json(
          { error: 'No account registered with this phone number. Please check the number or sign up.' },
          { status: 404 }
        )
      }
      targetEmail = res.rows[0].email
    }

    // Call BetterAuth to authenticate
    const response = await auth.api.signInEmail({
      body: {
        email: targetEmail,
        password,
      },
      headers: req.headers,
      asResponse: true,
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errData.message || 'Invalid credentials. Please check your password.' },
        { status: 401 }
      )
    }

    // Get user details
    const uRes = await pool.query('SELECT id, name, email, phone, role FROM "user" WHERE LOWER(email) = $1 LIMIT 1', [targetEmail.toLowerCase()])
    const userData = uRes.rows[0] || { email: targetEmail, name: 'Gamer', role: 'user' }

    // Forward Set-Cookie headers
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
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || null,
          role: userData.role || 'user',
        },
      }),
      {
        status: 200,
        headers: resHeaders,
      }
    )
  } catch (error: any) {
    console.error('Error logging in user:', error)
    return NextResponse.json({ error: error?.message || 'Login failed. Please try again.' }, { status: 500 })
  }
}
