import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@lib/admin-auth'
import { getAdminCatalog } from '../actions'
import { Crown, Package, Plus } from 'lucide-react'

export default async function AdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await getAdminSession()
  if (!session?.user) redirect('/sign-in')

  const { status } = await searchParams
  const allProducts = await getAdminCatalog()

  const subscriptions = allProducts.filter((p) => {
    if (p.type !== 'subscription') return false
    if (status && p.status !== status) return false
    return true
  })

  const active = subscriptions.filter((p) => p.status === 'active').length
  const drafts = subscriptions.filter((p) => p.status === 'draft').length
  const archived = subscriptions.filter((p) => p.status === 'archived').length

  return (
    <main className="site-shell min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/admin" className="text-sm text-primary hover:underline">
              ← Dashboard
            </Link>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <Crown className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Subscriptions</h1>
                <p className="text-sm text-muted-foreground">
                  PS Plus, Xbox Game Pass, EA Play, Apple Arcade & more
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/admin/products/new?type=subscription"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white hover:bg-violet-500 transition"
          >
            <Plus className="h-4 w-4" /> Add Subscription
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Active', count: active, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Drafts', count: drafts, color: 'text-white/60 bg-white/5 border-white/10' },
            { label: 'Archived', count: archived, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
          ].map(({ label, count, color }) => (
            <div key={label} className={`rounded-2xl border p-4 ${color}`}>
              <p className="text-2xl font-black">{count}</p>
              <p className="mt-0.5 text-xs font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/admin/subscriptions"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              !status ? 'bg-violet-600 text-white' : 'border border-white/10 text-muted-foreground hover:text-foreground'
            }`}
          >
            All ({subscriptions.length})
          </Link>
          <Link
            href="/admin/subscriptions?status=active"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              status === 'active'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'border border-white/10 text-muted-foreground hover:text-foreground'
            }`}
          >
            Active
          </Link>
          <Link
            href="/admin/subscriptions?status=draft"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              status === 'draft'
                ? 'bg-white/10 text-foreground border border-white/20'
                : 'border border-white/10 text-muted-foreground hover:text-foreground'
            }`}
          >
            Drafts
          </Link>
          <Link
            href="/admin/subscriptions?status=archived"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              status === 'archived'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'border border-white/10 text-muted-foreground hover:text-foreground'
            }`}
          >
            Archived
          </Link>
        </div>

        {/* Quick guide */}
        <div className="mt-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs text-violet-300/80">
            <strong className="text-violet-300">How it works:</strong> Create a product with type <code className="bg-violet-500/10 px-1 rounded">subscription</code>, then add variants for each plan duration (e.g. &quot;1 Month&quot;, &quot;3 Months&quot;, &quot;12 Months&quot;). Add digital codes in{' '}
            <Link href="/admin/digital-codes" className="underline hover:text-violet-200">Digital Codes Vault</Link>.
          </p>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <div className="grid grid-cols-[1fr_100px_120px_80px_80px] gap-4 border-b border-white/10 px-5 py-3.5 text-xs uppercase tracking-wider text-muted-foreground">
            <span>Subscription</span>
            <span>Brand</span>
            <span>Status</span>
            <span>Plans</span>
            <span>Featured</span>
          </div>

          {subscriptions.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
              <Crown className="mb-4 h-12 w-12 text-violet-400/30" />
              <p className="font-semibold text-white/40">No subscription products yet.</p>
              <Link
                href="/admin/products/new?type=subscription"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-500 transition"
              >
                <Plus className="h-4 w-4" /> Create First Subscription
              </Link>
            </div>
          ) : (
            subscriptions.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="grid grid-cols-[1fr_100px_120px_80px_80px] gap-4 border-b border-white/10 px-5 py-4 last:border-0 hover:bg-white/[0.04] transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-semibold truncate">{product.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">/{product.slug}</p>
                </div>
                <span className="self-center text-sm text-muted-foreground truncate">
                  {product.brand || '—'}
                </span>
                <span className="self-center">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      product.status === 'active'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : product.status === 'archived'
                        ? 'bg-red-500/15 text-red-400'
                        : 'bg-white/10 text-muted-foreground'
                    }`}
                  >
                    {product.status}
                  </span>
                </span>
                <span className="self-center text-center text-sm text-muted-foreground">
                  {(product.variantCount as number) ?? 0}
                </span>
                <span className="self-center text-center">{product.featured ? '⭐' : '—'}</span>
              </Link>
            ))
          )}
        </div>

        {/* Cross-links */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { href: '/admin/digital-codes', label: '🗝️ Digital Codes Vault', desc: 'Add subscription codes for instant delivery' },
            { href: '/admin/products?type=topup', label: '⚡ Top-Up Products', desc: 'Manage game top-up catalog' },
            { href: '/admin/products?type=giftcard', label: '🎁 Gift Card Products', desc: 'Manage gift card catalog' },
          ].map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/20 hover:bg-white/[0.06] transition"
            >
              <p className="font-semibold text-sm">{label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
