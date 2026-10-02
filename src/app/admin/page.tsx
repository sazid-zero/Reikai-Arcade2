import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { Package, Store, ShieldCheck, ShoppingCart, TrendingUp, Users, Layers, AlertCircle } from 'lucide-react'
import { auth } from '@lib/auth'
import { getAdminCatalog, getAdminMetrics, getAdminOrders } from './actions'

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const [catalog, metrics, recentOrders] = await Promise.all([
    getAdminCatalog(),
    getAdminMetrics(),
    getAdminOrders(),
  ])

  const active = catalog.filter((p) => p.status === 'active').length
  const drafts = catalog.filter((p) => p.status === 'draft').length
  const games = catalog.filter((p) => p.type === 'game').length
  const accessories = catalog.filter((p) => p.type === 'accessory').length
  const pendingOrders = recentOrders.filter((o) => o.status === 'pending').length
  const totalRevenue = metrics.revenue

  const statCards = [
    { label: 'Total Products', value: catalog.length, icon: Package, href: '/admin/products', color: 'text-violet-400' },
    { label: 'Live Products', value: active, icon: Store, href: '/admin/products', color: 'text-emerald-400' },
    { label: 'Games', value: games, icon: Layers, href: '/admin/products?type=game', color: 'text-blue-400' },
    { label: 'Accessories', value: accessories, icon: ShieldCheck, href: '/admin/products?type=accessory', color: 'text-amber-400' },
    { label: 'Total Orders', value: recentOrders.length, icon: ShoppingCart, href: '/admin/orders', color: 'text-pink-400' },
    { label: 'Pending Orders', value: pendingOrders, icon: AlertCircle, href: '/admin/orders', color: 'text-orange-400' },
  ]

  return (
    <main className="site-shell min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">ReiKai Control Room</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">Signed in as <span className="text-foreground">{session.user.email}</span></p>
          </div>
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground hover:opacity-90 transition-opacity">
            + New Product
          </Link>
        </header>

        {/* Stats Grid */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {statCards.map(({ label, value, icon: Icon, href, color }) => (
            <Link key={label} href={href} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.06]">
              <Icon className={`h-5 w-5 ${color}`} />
              <p className="mt-6 text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 text-3xl font-bold">{value}</p>
            </Link>
          ))}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Recent Products */}
          <section className="lg:col-span-2 rounded-2xl border border-white/10 bg-black/20 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Recent Products</h2>
              <Link href="/admin/products" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
            </div>
            {catalog.length === 0 ? (
              <Link href="/admin/products/new" className="block rounded-xl border border-dashed border-primary/40 p-8 text-center text-primary hover:bg-primary/5 transition">
                + Create your first product
              </Link>
            ) : (
              <div className="divide-y divide-white/10">
                {catalog.slice(0, 8).map((product) => (
                  <Link key={product.id} href={`/admin/products/${product.id}`} className="flex items-center justify-between gap-4 py-3.5 hover:text-primary transition-colors">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{product.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground uppercase tracking-wider">
                        {product.type} · {product.category || 'uncategorized'}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${product.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : product.status === 'archived' ? 'bg-red-500/15 text-red-400' : 'bg-white/10 text-muted-foreground'}`}>
                      {product.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Quick Nav */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold">Quick Actions</h2>
            {[
              { href: '/admin/products', label: 'Manage Products', desc: `${catalog.length} total`, icon: Package },
              { href: '/admin/inventory', label: 'Inventory', desc: 'Stock levels', icon: Layers },
              { href: '/admin/orders', label: 'Orders', desc: `${recentOrders.length} total`, icon: ShoppingCart },
              { href: '/admin/users', label: 'Admin Users', desc: 'Manage access', icon: Users },
            ].map(({ href, label, desc, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/20 hover:bg-white/[0.06] transition">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </Link>
            ))}
          </section>
        </div>

        {/* Recent Orders Preview */}
        {recentOrders.length > 0 && (
          <section className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-white/10">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {recentOrders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td className="py-3 font-mono text-xs text-muted-foreground">
                        <Link href={`/admin/orders/${order.id}`} className="hover:text-primary">{order.id.slice(0, 8)}…</Link>
                      </td>
                      <td className="py-3">{order.customerEmail ?? 'Guest'}</td>
                      <td className="py-3 font-semibold">৳{order.total.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${order.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-400' : order.status === 'cancelled' ? 'bg-red-500/15 text-red-400' : order.status === 'shipped' ? 'bg-blue-500/15 text-blue-400' : 'bg-amber-500/15 text-amber-400'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
