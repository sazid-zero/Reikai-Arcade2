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
    <main className="site-shell min-h-screen px-5 py-20 flex items-center justify-center bg-black">
      <div className="w-full max-w-md">
        <form onSubmit={submit} className="relative rounded-3xl border border-white/10 bg-black/95 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpeg"
                alt="ReiKai Arcade"
                className="w-10 h-10 rounded-xl object-cover border border-[#a0e4f1]/40 shadow-lg"
              />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#a0e4f1]/30 bg-[#a0e4f1]/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider uppercase text-[#a0e4f1]">
                <KeyRound className="h-3 w-3 text-[#a0e4f1]" /> ReiKai Staff
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">v2.0</span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c673e2] to-[#a0e4f1]">Control Room</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Authorized personnel only. Sign in with administrative credentials.
          </p>

          {/* Quick Credential Helper Banner */}
          <div className="mt-5 rounded-2xl border border-[#c673e2]/20 bg-[#4b22d2]/10 p-4 text-xs text-zinc-300">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#c673e2] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Default Admin Login
              </span>
              <button
                type="button"
                onClick={fillDefaults}
                className="text-[11px] font-bold text-[#a0e4f1] underline hover:text-white/80 transition cursor-pointer"
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
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#a0e4f1] focus:ring-1 focus:ring-[#a0e4f1]/40 transition"
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
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#a0e4f1] focus:ring-1 focus:ring-[#a0e4f1]/40 transition"
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
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#4b22d2] via-[#c673e2] to-[#a0e4f1] px-4 py-3.5 text-sm font-extrabold text-white shadow-lg hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
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
              className="text-[#a0e4f1] hover:underline"
            >
              Customer Sign In →
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
