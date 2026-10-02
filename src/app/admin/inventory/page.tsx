import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@lib/auth'
import { getInventory } from '../actions'
import { InventoryAdjustRow } from './inventory-adjust-row'

export default async function InventoryPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const items = await getInventory()
  const outOfStock = items.filter((i) => i.stockQuantity === 0).length
  const lowStock = items.filter((i) => i.stockQuantity > 0 && i.stockQuantity <= 5).length

  return (
    <main className="site-shell min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <Link href="/admin" className="text-sm text-primary hover:underline">← Dashboard</Link>
            <h1 className="mt-3 text-4xl font-bold">Inventory</h1>
            <p className="mt-1 text-sm text-muted-foreground">{items.length} variant{items.length !== 1 ? 's' : ''} tracked</p>
          </div>
        </div>

        {/* Alert row */}
        {(outOfStock > 0 || lowStock > 0) && (
          <div className="mt-5 flex flex-wrap gap-3">
            {outOfStock > 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-400">
                ⚠️ {outOfStock} variant{outOfStock !== 1 ? 's' : ''} out of stock
              </div>
            )}
            {lowStock > 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-orange-500/10 border border-orange-500/20 px-4 py-2 text-sm text-orange-400">
                ⚡ {lowStock} variant{lowStock !== 1 ? 's' : ''} with low stock
              </div>
            )}
          </div>
        )}

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-left text-muted-foreground">
                <th className="px-5 py-4 font-medium">Product / Variant</th>
                <th className="px-5 py-4 font-medium">SKU</th>
                <th className="px-5 py-4 font-medium">Type</th>
                <th className="px-5 py-4 font-medium">Stock</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-muted-foreground">No inventory. Add products and variants first.</td></tr>
              ) : (
                items.map((item) => <InventoryAdjustRow key={item.id} item={item} />)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
