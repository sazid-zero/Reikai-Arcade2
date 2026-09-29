import Link from 'next/link'
import { getInventory } from '../actions'

export default async function InventoryPage() {
  const items = await getInventory()
  return <main className="min-h-screen bg-background px-6 py-10 text-foreground"><div className="mx-auto max-w-6xl"><Link href="/admin" className="text-sm text-muted-foreground">← Admin</Link><div className="mt-8 flex items-end justify-between"><div><p className="text-sm uppercase tracking-[0.25em] text-primary">Operations</p><h1 className="mt-2 text-4xl font-semibold">Inventory</h1></div></div><div className="mt-8 overflow-hidden rounded-2xl border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-white/[0.04] text-muted-foreground"><tr><th className="p-4">Product</th><th className="p-4">SKU</th><th className="p-4">Stock</th><th className="p-4">Status</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-t border-white/10"><td className="p-4 font-medium">{item.productName}</td><td className="p-4 text-muted-foreground">{item.sku}</td><td className="p-4">{item.stockQuantity}</td><td className="p-4">{item.stockQuantity <= 5 ? 'Low stock' : 'Healthy'}</td></tr>)}</tbody></table></div></div></main>
}
