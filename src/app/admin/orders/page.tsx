import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@lib/auth'
import { getAdminOrders } from '../actions'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400',
  confirmed: 'bg-blue-500/15 text-blue-400',
  processing: 'bg-violet-500/15 text-violet-400',
  shipped: 'bg-cyan-500/15 text-cyan-400',
  delivered: 'bg-emerald-500/15 text-emerald-400',
  cancelled: 'bg-red-500/15 text-red-400',
}

const PAYMENT_COLORS: Record<string, string> = {
  unpaid: 'bg-red-500/15 text-red-400',
  paid: 'bg-emerald-500/15 text-emerald-400',
  refunded: 'bg-orange-500/15 text-orange-400',
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const { status } = await searchParams
  const allOrders = await getAdminOrders()
  const orders = status ? allOrders.filter((o) => o.status === status) : allOrders

  return (
    <main className="site-shell min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <Link href="/admin" className="text-sm text-primary hover:underline">← Dashboard</Link>
            <h1 className="mt-3 text-4xl font-bold">Orders</h1>
            <p className="mt-1 text-sm text-muted-foreground">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Status filter */}
        <div className="mt-5 flex flex-wrap gap-2">
          {['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <Link
              key={s || 'all'}
              href={s ? `/admin/orders?status=${s}` : '/admin/orders'}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${status === s || (!status && !s) ? 'bg-primary text-primary-foreground' : 'border border-white/10 text-muted-foreground hover:text-foreground'}`}
            >
              {s || 'All'}
            </Link>
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-left text-muted-foreground">
                <th className="px-5 py-4 font-medium">Order</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Total</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Payment</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-muted-foreground">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{order.id.slice(0, 8)}…</td>
                    <td className="px-5 py-4">
                      <div className="font-medium">{order.customerName ?? 'Guest'}</div>
                      <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold">৳{order.total.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLORS[order.status] ?? 'bg-white/10 text-muted-foreground'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${PAYMENT_COLORS[order.paymentStatus] ?? 'bg-white/10 text-muted-foreground'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-sm text-primary hover:underline">View →</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
