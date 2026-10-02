'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@lib/auth-client'

export function SignInForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')

    try {
      if (mode === 'signup') {
        const result = await authClient.signUp.email({
          name: name.trim() || 'Admin User',
          email: email.trim(),
          password,
        })
        if (result.error) {
          setError(result.error.message || 'Unable to create account.')
          setPending(false)
          return
        }
      } else {
        const result = await authClient.signIn.email({
          email: email.trim(),
          password,
        })
        if (result.error) {
          setError(result.error.message || 'Unable to sign in with those details.')
          setPending(false)
          return
        }
      }
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="site-shell min-h-screen px-5 py-20 flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">ReiKai Control Room</p>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === 'signin'
            ? 'Sign in to access catalog, orders, and inventory controls.'
            : 'Register your account. The first registered user automatically becomes the system Administrator.'}
        </p>

        {/* Tab switcher */}
        <div className="mt-6 flex rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError('') }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              mode === 'signin' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError('') }}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${
              mode === 'signup' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {mode === 'signup' && (
          <label className="mt-5 block text-sm font-semibold">
            Full Name
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary transition"
              type="text"
              placeholder="e.g. Commander Shepard"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={mode === 'signup'}
            />
          </label>
        )}

        <label className="mt-4 block text-sm font-semibold">
          Email Address
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary transition"
            type="email"
            placeholder="admin@reikai.arcade"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="mt-4 block text-sm font-semibold">
          Password
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary transition"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {error}
          </div>
        ) : null}

        <button
          className="mt-7 w-full rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition"
          disabled={pending}
        >
          {pending
            ? (mode === 'signin' ? 'Signing in…' : 'Creating account…')
            : (mode === 'signin' ? 'Sign In to Admin' : 'Create Admin Account')}
        </button>
      </form>
    </main>
  )
}
