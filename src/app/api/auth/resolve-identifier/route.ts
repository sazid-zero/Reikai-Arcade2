import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const dynamic = 'force-dynamic'

function normalizePhone(raw: string): string[] {
  const digits = raw.replace(/\D/g, '')
  const variants = new Set<string>()

  variants.add(digits)
  if (digits.startsWith('880')) {
    variants.add(digits.slice(2)) // 017...
    variants.add('+' + digits) // +88017...
  } else if (digits.startsWith('0')) {
    variants.add('88' + digits) // 88017...
    variants.add('+88' + digits) // +88017...
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

    if (!rawIdentifier) {
      return NextResponse.json({ error: 'Please enter your email or phone number.' }, { status: 400 })
    }

    // Check if it's an email
    if (rawIdentifier.includes('@')) {
      const email = rawIdentifier.toLowerCase()
      // Check if user exists
      const res = await pool.query('SELECT id, email, name, phone FROM "user" WHERE LOWER(email) = $1 LIMIT 1', [email])
      if (res.rows.length === 0) {
        return NextResponse.json({
          email,
          isPhone: false,
          exists: false,
        })
      }
      return NextResponse.json({
        email: res.rows[0].email,
        phone: res.rows[0].phone || null,
        name: res.rows[0].name,
        isPhone: false,
        exists: true,
      })
    }

    // It's a phone number
    const phoneVariants = normalizePhone(rawIdentifier)
    const placeholders = phoneVariants.map((_, i) => `$${i + 1}`).join(', ')
    const generatedEmail = `${phoneVariants[0]}@phone.reikai.arcade`

    const query = `
      SELECT id, email, name, phone 
      FROM "user" 
      WHERE phone IN (${placeholders}) 
         OR email = $${phoneVariants.length + 1}
      LIMIT 1
    `
    const res = await pool.query(query, [...phoneVariants, generatedEmail])

    if (res.rows.length === 0) {
      return NextResponse.json({
        error: 'No account registered with this phone number. Please create an account.',
        isPhone: true,
        exists: false,
      }, { status: 404 })
    }

    const matchedUser = res.rows[0]
    return NextResponse.json({
      email: matchedUser.email,
      phone: matchedUser.phone || rawIdentifier,
      name: matchedUser.name,
      isPhone: true,
      exists: true,
    })
  } catch (error: any) {
    console.error('Error resolving identifier:', error)
    return NextResponse.json({ error: 'Failed to resolve login identifier.' }, { status: 500 })
  }
}
