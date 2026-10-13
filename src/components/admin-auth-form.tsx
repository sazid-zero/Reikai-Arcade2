'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { KeyRound, Lock, Mail, ShieldAlert, Sparkles, ArrowLeft } from 'lucide-react'
import { loginAdminAction } from '@/app/admin/actions'

export function AdminSignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@reikai.arcade')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  function fillDefaults() {
    setEmail('admin@reikai.arcade')
    setPassword('admin123')
    setError('')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')

    try {
      const res = await loginAdminAction({
        email: email.trim(),
        pass: password.trim(),
      })

      if (!res.success) {
        setError(res.error || 'Invalid admin credentials. Please try again.')
        setPending(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="site-shell min-h-screen px-5 py-20 flex items-center justify-center">
      <div className="w-full max-w-md">
        <form onSubmit={submit} className="relative rounded-3xl border border-white/10 bg-[#06020e]/80 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpeg"
                alt="ReiKai Arcade"
                className="w-10 h-10 rounded-xl object-cover border border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider uppercase text-[#00f0ff]">
                <KeyRound className="h-3 w-3 text-[#00f0ff]" /> ReiKai Staff
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">v2.0</span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#00f0ff]">Control Room</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Authorized personnel only. Sign in with administrative credentials.
          </p>

          {/* Quick Credential Helper Banner */}
          <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/[0.06] p-4 text-xs text-zinc-300">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Default Admin Login
              </span>
              <button
                type="button"
                onClick={fillDefaults}
                className="text-[11px] font-bold text-primary underline hover:text-primary/80 transition"
              >
                Auto-fill
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase">Email</span>
                <span className="text-zinc-200">admin@reikai.arcade</span>
              </div>
              <div className="rounded-lg bg-black/40 px-2.5 py-1.5 border border-white/5">
                <span className="text-zinc-500 block text-[9px] uppercase">Password</span>
                <span className="text-zinc-200">admin123</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Admin Email
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition"
                  type="email"
                  placeholder="admin@reikai.arcade"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Admin Password
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#a855f7] to-[#00f0ff] px-4 py-3.5 text-sm font-extrabold text-white shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {pending ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Authenticating…
              </>
            ) : (
              'Enter Admin Control Room'
            )}
          </button>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Storefront</span>
            </Link>
            <Link
              href="/sign-in"
              className="text-[#00f0ff] hover:underline"
            >
              Customer Sign In →
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
