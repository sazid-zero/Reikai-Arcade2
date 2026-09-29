import Link from 'next/link'
import { getAdminOrders } from '../actions'

export default async function OrdersPage() {
  const orders = await getAdminOrders()
  return <main className="min-h-screen bg-background px-6 py-10 text-foreground"><div className="mx-auto max-w-6xl"><Link href="/admin" className="text-sm text-muted-foreground">← Admin</Link><p className="mt-8 text-sm uppercase tracking-[0.25em] text-primary">Operations</p><h1 className="mt-2 text-4xl font-semibold">Orders</h1><div className="mt-8 overflow-hidden rounded-2xl border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-white/[0.04] text-muted-foreground"><tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-t border-white/10"><td className="p-4 font-mono text-xs">{order.id.slice(0, 8)}</td><td className="p-4">{order.customerEmail ?? 'Guest'}</td><td className="p-4">৳{order.total}</td><td className="p-4">{order.status}</td></tr>)}</tbody></table></div></div></main>
}
