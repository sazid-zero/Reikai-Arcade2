import { cookies, headers } from 'next/headers'
import crypto from 'crypto'
import { auth } from './auth'

export const ADMIN_COOKIE_NAME = 'reikai_admin_session'

export function getAdminCredentials() {
  const email = (process.env.ADMIN_EMAIL || 'admin@reikai.arcade').trim().toLowerCase()
  const password = (process.env.ADMIN_PASSWORD || 'admin123').trim()
  return { email, password }
}

const SECRET = process.env.BETTER_AUTH_SECRET || 'reikai-arcade-admin-secret-key-production-32chars'

function createAdminToken(email: string): string {
  const timestamp = Date.now()
  const payload = `${email}:${timestamp}`
  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex')
  return Buffer.from(JSON.stringify({ email, timestamp, signature })).toString('base64url')
}

function verifyAdminToken(token: string): { email: string } | null {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf-8')
    const parsed = JSON.parse(raw)
    const { email, timestamp, signature } = parsed
    if (!email || !timestamp || !signature) return null

    const expected = crypto.createHmac('sha256', SECRET).update(`${email}:${timestamp}`).digest('hex')
    const sigBuf = Buffer.from(signature)
    const expBuf = Buffer.from(expected)
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null
    }

    // Session valid for 30 days
    if (Date.now() - timestamp > 30 * 24 * 60 * 60 * 1000) {
      return null
    }

    return { email }
  } catch {
    return null
  }
}

export type AdminSessionUser = {
  id: string
  email: string
  name: string
  role: string
}

export type AdminSession = {
  user: AdminSessionUser
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value

    if (token) {
      const verified = verifyAdminToken(token)
      if (verified) {
        return {
          user: {
            id: 'admin-master',
            email: verified.email,
            name: 'Administrator',
            role: 'admin',
          },
        }
      }
    }
  } catch {
    // ignore cookie reading errors in edge cases
  }

  // Fallback to better-auth session if any
  try {
    const reqHeaders = await headers()
    const session = await auth.api.getSession({ headers: reqHeaders })
    if (session?.user) {
      return {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name || 'Admin',
          role: 'admin',
        },
      }
    }
  } catch {
    // ignore
  }

  return null
}

export async function loginAdmin(email: string, pass: string): Promise<{ success: boolean; error?: string }> {
  const creds = getAdminCredentials()
  const inputEmail = email.trim().toLowerCase()
  const inputPassword = pass.trim()

  if (inputEmail !== creds.email || inputPassword !== creds.password) {
    return { success: false, error: 'Invalid admin email or password.' }
  }

  const token = createAdminToken(creds.email)
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  })

  return { success: true }
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
}
