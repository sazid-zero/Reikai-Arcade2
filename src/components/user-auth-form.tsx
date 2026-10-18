'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Mail,
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  Gamepad2,
  CheckCircle2,
} from 'lucide-react'

interface UserAuthFormProps {
  initialMode?: 'signin' | 'signup'
}

function UserAuthFormContent({ initialMode = 'signin' }: UserAuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/'

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [primaryType, setPrimaryType] = useState<'email' | 'phone'>('phone')

  // Form fields
  const [name, setName] = useState('')
  const [identifier, setIdentifier] = useState('') // for sign-in (email or phone)
  const [email, setEmail] = useState('') // for sign-up
  const [phone, setPhone] = useState('') // for sign-up
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setPending(true)

    const cleanIdentifier = identifier.trim()
    if (!cleanIdentifier) {
      setError('Please enter your email or phone number.')
      setPending(false)
      return
    }
    if (!password) {
      setError('Please enter your password.')
      setPending(false)
      return
    }

    try {
      const res = await fetch('/api/auth/login-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: cleanIdentifier,
          password,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to sign in. Please verify your credentials.')
        setPending(false)
        return
      }

      setSuccessMsg('Welcome back, gamer! Entering vault…')
      setTimeout(() => {
        router.push(redirectUrl)
        router.refresh()
      }, 700)
    } catch (err: any) {
      setError(err?.message || 'Connection error. Please try again.')
      setPending(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setPending(true)

    if (!name.trim()) {
      setError('Please enter your full name.')
      setPending(false)
      return
    }

    if (primaryType === 'phone') {
      const cleanP = phone.trim().replace(/\D/g, '')
      if (cleanP.length < 9) {
        setError('Please enter a valid phone number (at least 10 digits).')
        setPending(false)
        return
      }
    } else {
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.')
        setPending(false)
        return
      }
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      setPending(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setPending(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          primaryType,
          email: primaryType === 'email' ? email.trim() : email.trim() || undefined,
          phone: primaryType === 'phone' ? phone.trim() : phone.trim() || undefined,
          password,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to create account. Please try again.')
        setPending(false)
        return
      }

      setSuccessMsg('Vault account created successfully! Signing in…')
      setTimeout(() => {
        router.push(redirectUrl)
        router.refresh()
      }, 800)
    } catch (err: any) {
      setError(err?.message || 'Failed to complete registration.')
      setPending(false)
    }
  }

  return (
    <main className="site-shell min-h-screen px-4 py-16 sm:py-24 flex items-center justify-center relative overflow-hidden bg-black">
      <div className="w-full max-w-md">
        <div className="relative rounded-3xl border border-white/10 bg-zinc-950/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          {/* Top Brand & Badge */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/videos/reikai_logo.jpeg"
                alt="ReiKai Arcade"
                className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-lg group-hover:border-white/25 transition-all"
              />
              <div>
                <span className="font-black tracking-tight text-white text-base block leading-none">
                  REIKAI ARCADE
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mt-0.5">
                  Gaming Vault
                </span>
              </div>
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider uppercase text-zinc-300">
              <Gamepad2 className="h-3 w-3" /> Player Access
            </span>
          </div>

          {/* Mode Switch Tabs */}
          <div className="mt-6 grid grid-cols-2 p-1 rounded-2xl bg-white/5 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode('signin')
                setError('')
                setSuccessMsg('')
              }}
              className={`py-2.5 rounded-xl font-['DM_Mono'] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setError('')
                setSuccessMsg('')
              }}
              className={`py-2.5 rounded-xl font-['DM_Mono'] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Heading */}
          <div className="mt-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {mode === 'signin' ? 'Access Your Vault' : 'Create Your Vault Account'}
            </h1>
            <p className="mt-1.5 text-xs text-zinc-400">
              {mode === 'signin'
                ? 'Sign in with your email or phone number to track orders and fast checkout.'
                : 'Join ReiKai Arcade for instant digital codes, game drops, and member rewards.'}
            </p>
          </div>

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Email or Phone Number
                </label>
                <div className="relative mt-2">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 flex items-center gap-1">
                    <User className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="017XXXXXXXX or gamer@gmail.com"
                    autoComplete="username"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
                  />
                </div>
                <p className="mt-1 text-[11px] text-zinc-500">
                  You can enter either your mobile number or email address.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Password
                  </label>
                  <span className="text-[11px] text-zinc-400 hover:text-white cursor-pointer transition">
                    Forgot password?
                  </span>
                </div>
                <div className="relative mt-2">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-11 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 animate-in fade-in">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full mt-2 rounded-xl bg-white text-black px-4 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-zinc-200 shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {pending ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Entering Vault…
                  </>
                ) : (
                  <>
                    <span>Enter Vault</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-zinc-400">
                  Don't have a vault account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup')
                      setError('')
                      setSuccessMsg('')
                    }}
                    className="font-bold text-white hover:underline cursor-pointer"
                  >
                    Sign up for free
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Full Name
                </label>
                <div className="relative mt-2">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arif Rahman"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
                  />
                </div>
              </div>

              {/* Primary Method Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Primary Identifier
                  </label>
                  <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                    <button
                      type="button"
                      onClick={() => setPrimaryType('phone')}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                        primaryType === 'phone'
                          ? 'bg-white text-black'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Phone
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrimaryType('email')}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                        primaryType === 'email'
                          ? 'bg-white text-black'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Email
                    </button>
                  </div>
                </div>

                {primaryType === 'phone' ? (
                  <div>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        autoComplete="tel"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-400 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-zinc-400" /> Quick mobile verification for instant order tracking
                    </p>

                    {/* Optional email field */}
                    <div className="mt-3">
                      <label className="block text-[11px] text-zinc-400">
                        Email Address <span className="text-zinc-600 font-mono">(optional)</span>
                      </label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="gamer@domain.com"
                          autoComplete="email"
                          className="w-full rounded-xl border border-white/5 bg-white/5 pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-white/40 transition"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="gamer@domain.com"
                        autoComplete="email"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-400 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-zinc-400" /> Order receipts and digital license keys sent to your inbox
                    </p>

                    {/* Optional phone field */}
                    <div className="mt-3">
                      <label className="block text-[11px] text-zinc-400">
                        Phone Number <span className="text-zinc-600 font-mono">(optional)</span>
                      </label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="017XXXXXXXX"
                          autoComplete="tel"
                          className="w-full rounded-xl border border-white/5 bg-white/5 pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-white/40 transition"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Password
                </label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-11 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Confirm Password
                </label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 animate-in fade-in">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={pending}
                className="w-full mt-2 rounded-xl bg-white text-black px-4 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-zinc-200 shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                {pending ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Initializing Account…
                  </>
                ) : (
                  <>
                    <span>Initialize Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-zinc-400">
                  Already have a vault account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin')
                      setError('')
                      setSuccessMsg('')
                    }}
                    className="font-bold text-white hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Bottom Staff Portal & Storefront Links */}
          <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition"
            >
              <span>← Back to Store</span>
            </Link>
            <Link
              href="/admin/sign-in"
              className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-500 hover:text-white transition"
            >
              <ShieldCheck className="h-3 w-3 text-zinc-400" />
              <span>Admin Portal →</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export function UserAuthForm(props: UserAuthFormProps) {
  return (
    <Suspense
      fallback={
        <main className="site-shell min-h-screen px-4 py-16 flex items-center justify-center">
          <div className="h-96 w-full max-w-md animate-pulse rounded-3xl bg-white/5 border border-white/10" />
        </main>
      }
    >
      <UserAuthFormContent {...props} />
    </Suspense>
  )
}
