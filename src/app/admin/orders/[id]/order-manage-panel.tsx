'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Key, Zap } from 'lucide-react'
import { assignAndDeliverDigitalCodesForOrder, updateOrder } from '../../actions'

type Props = {
  orderId: string
  currentStatus: string
  currentPaymentStatus: string
  currentFulfillmentStatus: string
  adminNotes: string | null
  trackingNumber: string | null
  hasDigitalItems?: boolean
  deliveredCodesCount?: number
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
  hasDigitalItems,
  deliveredCodesCount = 0,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState(currentStatus)
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus)
  const [fulfillmentStatus, setFulfillmentStatus] = useState(currentFulfillmentStatus)
  const [adminNotes, setAdminNotes] = useState(initialNotes ?? '')
  const [trackingNumber, setTrackingNumber] = useState(initialTracking ?? '')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSave = () => {
    setErrorMsg('')
    startTransition(async () => {
      try {
        await updateOrder(orderId, {
          status: status as any,
          paymentStatus: paymentStatus as any,
          fulfillmentStatus: fulfillmentStatus as any,
          adminNotes,
          trackingNumber,
        })
        setSuccessMsg('Order updated!')
        setTimeout(() => setSuccessMsg(''), 3000)
        router.refresh()
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to update order')
      }
    })
  }

  const handleDeliverCodes = () => {
    setErrorMsg('')
    startTransition(async () => {
      try {
        await assignAndDeliverDigitalCodesForOrder(orderId)
        setSuccessMsg('Digital codes delivered from vault!')
        setTimeout(() => setSuccessMsg(''), 3000)
        router.refresh()
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to deliver codes')
      }
    })
  }

  const selectCls =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition capitalize'
  const labelCls =
    'block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5'

  return (
    <div className="space-y-4">
      {successMsg && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-400">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Digital Code Quick Action */}
      {hasDigitalItems && (
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
          <div className="flex items-center gap-2 font-bold text-sm text-primary mb-1">
            <Key className="h-4 w-4" /> Digital Order Fulfillment
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {deliveredCodesCount > 0
              ? `${deliveredCodesCount} code(s) delivered.`
              : 'Digital codes have not been delivered yet.'}
          </p>
          <button
            type="button"
            onClick={handleDeliverCodes}
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
          >
            <Zap className="h-3.5 w-3.5" />
            {isPending ? 'Delivering…' : '⚡ Deliver Vault Codes Now'}
          </button>
        </div>
      )}

      <label>
        <span className={labelCls}>Order Status</span>
        <select className={selectCls} value={status} onChange={(e) => setStatus(e.target.value)}>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className={labelCls}>Payment Status</span>
        <select className={selectCls} value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className={labelCls}>Fulfillment Status</span>
        <select className={selectCls} value={fulfillmentStatus} onChange={(e) => setFulfillmentStatus(e.target.value)}>
          {FULFILLMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className={labelCls}>Tracking Number</span>
        <input
          className={selectCls}
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="e.g. BD1234567890"
        />
      </label>

      <label>
        <span className={labelCls}>Admin Notes</span>
        <textarea
          className={selectCls}
          rows={3}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Internal notes..."
        />
      </label>

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition"
      >
        {isPending ? 'Saving…' : 'Update Order'}
      </button>
    </div>
  )
}
