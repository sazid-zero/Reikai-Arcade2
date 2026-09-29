import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { Package, Plus, ShieldCheck, Store } from 'lucide-react'
import { auth } from '@lib/auth'
import { getAdminCatalog, getAdminMetrics } from './actions'

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const [catalog, metrics] = await Promise.all([getAdminCatalog(), getAdminMetrics()])
  const active = catalog.filter((item) => item.status === 'active').length
  const drafts = catalog.filter((item) => item.status === 'draft').length

  return (
    <main className="site-shell min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div><p className="font-mono-ui text-xs uppercase tracking-[0.3em] text-primary">ReiKai control room</p><h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">Catalog command</h1><p className="mt-3 max-w-xl text-muted-foreground">Manage the games and accessories your storefront sells. Changes are reflected in the catalog after publishing.</p></div>
          <Link href="/admin/products/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground"><Plus className="h-4 w-4" /> New product</Link>
        </header>
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {([{ label: 'Total catalog', value: catalog.length, Icon: Package }, { label: 'Live products', value: active, Icon: Store }, { label: 'Drafts', value: drafts, Icon: ShieldCheck }] satisfies { label: string; value: number; Icon: LucideIcon }[]).map(({ label, value, Icon }) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><Icon className="h-5 w-5 text-primary" /><p className="mt-6 text-sm text-muted-foreground">{label}</p><p className="mt-1 text-3xl font-bold">{value}</p></div>)}
        </section>
        <section className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-5 md:p-7"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold">Products</h2><p className="mt-1 text-sm text-muted-foreground">{catalog.length ? 'Your database-backed catalog.' : 'Start by adding your first product.'}</p></div><Link href="/admin/products" className="text-sm font-semibold text-primary">View all</Link></div>{catalog.length ? <div className="mt-6 divide-y divide-white/10">{catalog.slice(0, 8).map((product) => <Link href={`/admin/products/${product.id}`} key={product.id} className="flex items-center justify-between gap-4 py-4 transition hover:text-primary"><div><p className="font-semibold">{product.name}</p><p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{product.type} · {product.status}</p></div><span className="text-sm text-muted-foreground">Edit →</span></Link>)}</div> : <Link href="/admin/products/new" className="mt-6 block rounded-xl border border-dashed border-primary/40 p-8 text-center text-primary">Create your first game or accessory</Link>}</section>
        <nav className="mt-8 flex flex-wrap gap-3 text-sm"><Link href="/admin/inventory" className="rounded-lg border border-white/10 px-3 py-2 text-muted-foreground hover:text-primary">Inventory</Link><Link href="/admin/orders" className="rounded-lg border border-white/10 px-3 py-2 text-muted-foreground hover:text-primary">Orders</Link></nav><p className="mt-8 text-xs text-muted-foreground">Signed in as {session.user.email}</p>
      </div>
    </main>
  )
}
