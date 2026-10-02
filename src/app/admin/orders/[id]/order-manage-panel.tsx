'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateOrder } from '../../actions'

type Props = {
  orderId: string
  currentStatus: string
  currentPaymentStatus: string
  currentFulfillmentStatus: string
  adminNotes: string | null
  trackingNumber: string | null
}

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['unpaid', 'paid', 'refunded']
const FULFILLMENT_STATUSES = ['unfulfilled', 'partial', 'fulfilled', 'shipped']

export function OrderManagePanel({
  orderId,
  currentStatus,
  currentPaymentStatus,
  currentFulfillmentStatus,
  adminNotes: initialNotes,
  trackingNumber: initialTracking,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(currentStatus)
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus)
  const [fulfillmentStatus, setFulfillmentStatus] = useState(currentFulfillmentStatus)
  const [adminNotes, setAdminNotes] = useState(initialNotes ?? '')
  const [trackingNumber, setTrackingNumber] = useState(initialTracking ?? '')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSave = () => {
    startTransition(async () => {
      await updateOrder(orderId, { status: status as any, paymentStatus: paymentStatus as any, fulfillmentStatus: fulfillmentStatus as any, adminNotes, trackingNumber })
      setSuccessMsg('Order updated!')
      setTimeout(() => setSuccessMsg(''), 3000)
      router.refresh()
    })
  }

  const selectCls = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition capitalize'
  const labelCls = 'block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5'

  return (
    <div className="space-y-4">
      {successMsg && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-400">{successMsg}</div>}

      <label><span className={labelCls}>Order Status</span>
        <select className={selectCls} value={status} onChange={(e) => setStatus(e.target.value)}>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

      <label><span className={labelCls}>Payment Status</span>
        <select className={selectCls} value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

      <label><span className={labelCls}>Fulfillment Status</span>
        <select className={selectCls} value={fulfillmentStatus} onChange={(e) => setFulfillmentStatus(e.target.value)}>
          {FULFILLMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

      <label>
        <span className={labelCls}>Tracking Number</span>
        <input className={selectCls} value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="e.g. BD1234567890" />
      </label>

      <label>
        <span className={labelCls}>Admin Notes</span>
        <textarea className={selectCls} rows={3} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Internal notes..." />
      </label>

      <button onClick={handleSave} disabled={isPending} className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition">
        {isPending ? 'Saving…' : 'Update Order'}
      </button>
    </div>
  )
}
