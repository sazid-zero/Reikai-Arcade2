import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@lib/auth'
import { getAdminOrder } from '../../actions'
import { OrderManagePanel } from './order-manage-panel'

type Props = { params: Promise<{ id: string }> }

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400',
  confirmed: 'bg-blue-500/15 text-blue-400',
  processing: 'bg-violet-500/15 text-violet-400',
  shipped: 'bg-cyan-500/15 text-cyan-400',
  delivered: 'bg-emerald-500/15 text-emerald-400',
  cancelled: 'bg-red-500/15 text-red-400',
}

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const { id } = await params
  const order = await getAdminOrder(id)
  if (!order) notFound()

  return (
    <main className="site-shell min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-6">
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">← Orders</Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-mono text-sm text-muted-foreground">{order.id.slice(0, 8)}…</span>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_320px] lg:items-start">
          {/* Left: Order Detail */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">Order Detail</h1>
                <p className="mt-1 font-mono text-sm text-muted-foreground">{order.id}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${STATUS_COLORS[order.status] ?? 'bg-white/10 text-muted-foreground'}`}>
                {order.status}
              </span>
            </div>

            {/* Customer Info */}
            <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h2 className="mb-4 font-bold">Customer</h2>
              <dl className="grid gap-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Name</dt><dd className="font-medium">{order.customerName ?? '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Email</dt><dd>{order.customerEmail ?? '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Phone</dt><dd>{order.customerPhone ?? '—'}</dd></div>
              </dl>
            </section>

            {/* Order Items */}
            <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h2 className="mb-4 font-bold">Items ({order.items.length})</h2>
              <div className="divide-y divide-white/10">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 py-3.5">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{item.productName}</p>
                      {item.variantTitle && <p className="text-xs text-muted-foreground">{item.variantTitle}</p>}
                      {item.sku && <p className="text-xs text-muted-foreground font-mono">SKU: {item.sku}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold">৳{(item.unitPrice / 100 * item.quantity).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">৳{(item.unitPrice / 100).toLocaleString()} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t border-white/10 pt-4">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg">৳{(order.total).toLocaleString()}</span>
              </div>
            </section>

            {/* Tracking */}
            {order.trackingNumber && (
              <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h2 className="mb-2 font-bold">Tracking</h2>
                <p className="font-mono text-sm">{order.trackingNumber}</p>
              </section>
            )}

            {/* Admin Notes */}
            {order.adminNotes && (
              <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                <h2 className="mb-2 font-bold text-amber-400">Admin Notes</h2>
                <p className="text-sm text-muted-foreground">{order.adminNotes}</p>
              </section>
            )}

            {/* Notes from customer */}
            {order.notes && (
              <section className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h2 className="mb-2 font-bold">Customer Notes</h2>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </section>
            )}
          </div>

          {/* Right: Manage Panel */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <h2 className="mb-4 font-bold">Manage Order</h2>
            <OrderManagePanel
              orderId={order.id}
              currentStatus={order.status}
              currentPaymentStatus={order.paymentStatus}
              currentFulfillmentStatus={order.fulfillmentStatus}
              adminNotes={order.adminNotes}
              trackingNumber={order.trackingNumber}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
