import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@lib/auth'
import { getAdminCatalog } from '../actions'

export default async function ProductsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const { type, status } = await searchParams
  const allProducts = await getAdminCatalog()

  const filtered = allProducts.filter((p) => {
    if (type && p.type !== type) return false
    if (status && p.status !== status) return false
    return true
  })

  return (
    <main className="site-shell min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/admin" className="text-sm text-primary hover:underline">← Dashboard</Link>
            <h1 className="mt-3 text-4xl font-bold">Products</h1>
            <p className="mt-1 text-sm text-muted-foreground">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground hover:opacity-90 transition-opacity">
            + Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/admin/products" className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${!type && !status ? 'bg-primary text-primary-foreground' : 'border border-white/10 text-muted-foreground hover:text-foreground'}`}>All</Link>
          <Link href="/admin/products?type=game" className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${type === 'game' ? 'bg-primary text-primary-foreground' : 'border border-white/10 text-muted-foreground hover:text-foreground'}`}>Games</Link>
          <Link href="/admin/products?type=accessory" className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${type === 'accessory' ? 'bg-primary text-primary-foreground' : 'border border-white/10 text-muted-foreground hover:text-foreground'}`}>Accessories</Link>
          <span className="mx-1 h-7 w-px self-center bg-white/10" />
          <Link href="/admin/products?status=active" className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'border border-white/10 text-muted-foreground hover:text-foreground'}`}>Active</Link>
          <Link href="/admin/products?status=draft" className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${status === 'draft' ? 'bg-white/10 text-foreground border border-white/20' : 'border border-white/10 text-muted-foreground hover:text-foreground'}`}>Drafts</Link>
          <Link href="/admin/products?status=archived" className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${status === 'archived' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'border border-white/10 text-muted-foreground hover:text-foreground'}`}>Archived</Link>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <div className="grid grid-cols-[1fr_100px_100px_80px_80px] gap-4 border-b border-white/10 px-5 py-3.5 text-xs uppercase tracking-wider text-muted-foreground">
            <span>Product</span>
            <span>Type</span>
            <span>Status</span>
            <span>Variants</span>
            <span>Featured</span>
          </div>
          {filtered.length === 0 ? (
            <div className="px-5 py-16 text-center text-muted-foreground">
              <p>No products found.</p>
              <Link href="/admin/products/new" className="mt-4 inline-block text-sm text-primary hover:underline">Create one →</Link>
            </div>
          ) : (
            filtered.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="grid grid-cols-[1fr_100px_100px_80px_80px] gap-4 border-b border-white/10 px-5 py-4 last:border-0 hover:bg-white/[0.04] transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-semibold truncate">{product.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">/{product.slug}</p>
                </div>
                <span className="self-center text-sm text-muted-foreground capitalize">{product.type}</span>
                <span className="self-center">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${product.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : product.status === 'archived' ? 'bg-red-500/15 text-red-400' : 'bg-white/10 text-muted-foreground'}`}>
                    {product.status}
                  </span>
                </span>
                <span className="self-center text-sm text-center text-muted-foreground">{(product.variantCount as number) ?? 0}</span>
                <span className="self-center text-center">{product.featured ? '⭐' : '—'}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
