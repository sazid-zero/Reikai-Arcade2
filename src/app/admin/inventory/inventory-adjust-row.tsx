'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { adjustStock } from '../actions'
import { Minus, Plus } from 'lucide-react'

type InventoryItem = {
  id: string
  sku: string
  title: string
  stockQuantity: number
  productId: string
  productName: string
  productType: string
}

export function InventoryAdjustRow({ item }: { item: InventoryItem }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showModal, setShowModal] = useState(false)
  const [delta, setDelta] = useState('')
  const [reason, setReason] = useState('')

  const handleAdjust = () => {
    const d = parseInt(delta)
    if (!d || isNaN(d)) return
    startTransition(async () => {
      await adjustStock(item.id, d, reason || 'Manual adjustment')
      setShowModal(false)
      setDelta('')
      setReason('')
      router.refresh()
    })
  }

  return (
    <>
      <tr className="border-b border-white/10 hover:bg-white/[0.02] transition-colors">
        <td className="px-5 py-4">
          <p className="font-semibold">{item.productName}</p>
          <p className="text-xs text-muted-foreground">{item.title}</p>
        </td>
        <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{item.sku}</td>
        <td className="px-5 py-4 capitalize text-sm text-muted-foreground">{item.productType}</td>
        <td className="px-5 py-4">
          <span className={`font-bold ${item.stockQuantity === 0 ? 'text-red-400' : item.stockQuantity <= 5 ? 'text-orange-400' : 'text-emerald-400'}`}>
            {item.stockQuantity}
          </span>
        </td>
        <td className="px-5 py-4">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.stockQuantity === 0 ? 'bg-red-500/15 text-red-400' : item.stockQuantity <= 5 ? 'bg-orange-500/15 text-orange-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
            {item.stockQuantity === 0 ? 'Out of stock' : item.stockQuantity <= 5 ? 'Low stock' : 'In stock'}
          </span>
        </td>
        <td className="px-5 py-4">
          <button onClick={() => setShowModal(true)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/5 hover:border-white/20 transition">
            Adjust
          </button>
        </td>
      </tr>

      {showModal && (
        <tr>
          <td colSpan={6} className="bg-primary/5 border-b border-primary/20 px-5 py-4">
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Adjustment (+/-)</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setDelta((d) => String((parseInt(d) || 0) - 1))} className="rounded-lg border border-white/10 p-2 hover:bg-white/5 transition">
                    <Minus className="h-3 w-3" />
                  </button>
                  <input type="number" className="w-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center text-sm" value={delta} onChange={(e) => setDelta(e.target.value)} placeholder="e.g. +10" />
                  <button onClick={() => setDelta((d) => String((parseInt(d) || 0) + 1))} className="rounded-lg border border-white/10 p-2 hover:bg-white/5 transition">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Reason</p>
                <input type="text" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Restock, correction, sale..." />
              </div>
              <div className="flex gap-2">
                <button onClick={handleAdjust} disabled={isPending || !delta} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition">
                  {isPending ? 'Saving…' : 'Apply'}
                </button>
                <button onClick={() => setShowModal(false)} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/5 transition">Cancel</button>
              </div>
              <p className="w-full text-xs text-muted-foreground">
                Current: <strong>{item.stockQuantity}</strong> → After: <strong>{item.stockQuantity + (parseInt(delta) || 0)}</strong>
              </p>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
