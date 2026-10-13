import Link from 'next/link'
import { redirect } from 'next/navigation'
import { KeyRound, ShieldCheck, Mail, Lock } from 'lucide-react'
import { getAdminSession, getAdminCredentials } from '@lib/admin-auth'

export default async function AdminUsersPage() {
  const session = await getAdminSession()
  if (!session?.user) redirect('/admin/sign-in')

  const creds = getAdminCredentials()

  return (
    <main className="site-shell min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin" className="text-sm text-primary hover:underline">← Dashboard</Link>
        <div className="mt-5 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Admin Credentials</h1>
            <p className="mt-2 text-muted-foreground">Default administrative access configuration.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="h-4 w-4" /> System Secured
          </span>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6">
          <div className="flex items-center gap-3">
            <KeyRound className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-white">Default Super Admin Account</h2>
              <p className="text-xs text-muted-foreground">Configured in .env.local for single-administrator root access.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <span className="flex items-center gap-2 text-xs font-mono uppercase text-muted-foreground">
                <Mail className="h-3.5 w-3.5 text-primary" /> Admin Email
              </span>
              <p className="mt-2 font-mono text-sm font-bold text-white">{creds.email}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <span className="flex items-center gap-2 text-xs font-mono uppercase text-muted-foreground">
                <Lock className="h-3.5 w-3.5 text-primary" /> Admin Password
              </span>
              <p className="mt-2 font-mono text-sm font-bold text-white">•••••••••••• (Set in .env.local)</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-white">How to change credentials:</p>
            <p className="mt-1">
              Update <code className="rounded bg-white/10 px-1 py-0.5 text-primary">ADMIN_EMAIL</code> and <code className="rounded bg-white/10 px-1 py-0.5 text-primary">ADMIN_PASSWORD</code> in your <code className="rounded bg-white/10 px-1 py-0.5 text-white">.env.local</code> file. Changes will take effect immediately.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
