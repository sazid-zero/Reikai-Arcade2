'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@lib/auth-client'

export function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const result = await authClient.signIn.email({ email, password })
    if (result.error) setError('Unable to sign in with those details.')
    else { router.push('/admin'); router.refresh() }
    setPending(false)
  }

  return (
    <main className="site-shell min-h-screen px-5 py-20">
      <form onSubmit={submit} className="mx-auto max-w-md rounded-3xl border border-white/10 bg-black/30 p-8 shadow-2xl backdrop-blur">
        <p className="font-mono-ui text-xs uppercase tracking-[0.3em] text-primary">ReiKai control</p>
        <h1 className="mt-4 text-4xl font-bold">Admin sign in</h1>
        <p className="mt-3 text-sm text-muted-foreground">Sign in with the account authorized for catalog management.</p>
        <label className="mt-8 block text-sm font-semibold">Email<input className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-primary" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label className="mt-4 block text-sm font-semibold">Password<input className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-primary" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
        <button className="mt-7 w-full rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground disabled:opacity-50" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  )
}
