import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Key } from 'lucide-react'
import { getAdminSession } from '@lib/admin-auth'
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
  const session = await getAdminSession()
  if (!session?.user) redirect('/sign-in')

  const { id } = await params
  const order = await getAdminOrder(id)
  if (!order) notFound()

  const deliveredCodes = order.codes || []
  const hasDigitalItems = order.items.some(
    (item) => item.sku?.startsWith('TOPUP-') || item.sku?.startsWith('GIFT-') || Boolean(item.variantId)
  )

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

            {/* Delivered Digital Codes */}
            {deliveredCodes.length > 0 && (
              <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold flex items-center gap-2 text-primary">
                    <Key className="h-4 w-4" /> Delivered Digital Codes ({deliveredCodes.length})
                  </h2>
                  <span className="text-xs font-mono uppercase bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold">
                    Fulfilled
                  </span>
                </div>
                <div className="space-y-3">
                  {deliveredCodes.map((codeItem) => (
                    <div
                      key={codeItem.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/40 p-4"
                    >
                      <div>
                        <span className="text-xs text-muted-foreground block">{codeItem.variantTitle}</span>
                        <span className="font-mono text-lg font-bold text-white tracking-widest selection:bg-primary">
                          {codeItem.code}
                        </span>
                        {codeItem.pin && (
                          <span className="text-xs font-mono text-muted-foreground ml-3">
                            PIN: {codeItem.pin}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {codeItem.deliveredAt
                          ? new Date(codeItem.deliveredAt).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

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
              hasDigitalItems={hasDigitalItems}
              deliveredCodesCount={deliveredCodes.length}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
