import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@lib/auth'
import { getAdminUsers } from '../actions'

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const adminUsers = await getAdminUsers()

  return (
    <main className="site-shell min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin" className="text-sm text-primary hover:underline">← Dashboard</Link>
        <h1 className="mt-5 text-4xl font-bold">Admin Users</h1>
        <p className="mt-2 text-muted-foreground">Users with full admin access to the control room.</p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <div className="border-b border-white/10 px-5 py-4">
            <p className="text-sm text-muted-foreground">{adminUsers.length} admin{adminUsers.length !== 1 ? 's' : ''}</p>
          </div>
          {adminUsers.map((admin) => (
            <div key={admin.userId} className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 last:border-0">
              <div>
                <p className="font-mono text-sm">{admin.userId}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Added {new Date(admin.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
              {admin.userId === session.user.id ? (
                <span className="rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs font-semibold text-primary">You</span>
              ) : (
                <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold text-muted-foreground">Admin</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
          <h2 className="font-bold mb-2">Grant Admin Access</h2>
          <p className="text-sm text-muted-foreground mb-4">To promote a user to admin, you need their User ID from the auth database. First, the user must sign up at <code className="bg-white/5 px-1.5 py-0.5 rounded text-xs">/sign-in</code>.</p>
          <GrantAdminForm />
        </div>
      </div>
    </main>
  )
}

function GrantAdminForm() {
  return (
    <div className="flex gap-3">
      <input
        id="userId-input"
        type="text"
        placeholder="User ID (UUID)"
        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
        readOnly
        defaultValue="Use the promote action from Actions panel below"
      />
      <p className="self-center text-xs text-muted-foreground">Admin promotion via user ID — contact dev to implement UI</p>
    </div>
  )
}
