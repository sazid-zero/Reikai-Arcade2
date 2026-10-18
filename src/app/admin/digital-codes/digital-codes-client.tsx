'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  Copy,
  Gift,
  Key,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Zap,
} from 'lucide-react'
import { addBatchDigitalCodes, deleteDigitalCode } from '../actions'

type DigitalVariant = {
  variantId: string
  variantTitle: string
  sku: string
  price: number
  stockQuantity: number
  productId: string
  productName: string
  productType: string
  productSlug: string
}

type CodeItem = {
  id: string
  variantId: string
  code: string
  pin: string | null
  status: string
  orderId: string | null
  deliveredAt: Date | null
  createdAt: Date
  variantTitle: string
  productName: string
  productSlug: string
  productType: string
}

type Props = {
  variants: DigitalVariant[]
  codes: CodeItem[]
}

function formatTaka(paisa: number) {
  return `৳${(paisa / 100).toLocaleString('en-BD')}`
}

export function DigitalCodesClient({ variants, codes: initialCodes }: Props) {
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.variantId || '')
  const [batchText, setBatchText] = useState('')
  const [filterVariant, setFilterVariant] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [isPending, startTransition] = useTransition()

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    if (!selectedVariantId || !batchText.trim()) return

    startTransition(async () => {
      try {
        const res = await addBatchDigitalCodes(selectedVariantId, batchText)
        setSuccessMsg(`Successfully added ${res.addedCount} new voucher code(s)! Total stock updated to ${res.newStock}.`)
        setBatchText('')
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to add codes')
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this code?')) return
    startTransition(async () => {
      try {
        await deleteDigitalCode(id)
      } catch (err: any) {
        alert(err.message || 'Failed to delete code')
      }
    })
  }

  const availableCount = initialCodes.filter((c) => c.status === 'available').length
  const deliveredCount = initialCodes.filter((c) => c.status === 'delivered').length

  const filteredCodes = initialCodes.filter((c) => {
    if (filterVariant !== 'all' && c.variantId !== filterVariant) return false
    if (filterStatus !== 'all' && c.status !== filterStatus) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        c.code.toLowerCase().includes(q) ||
        c.productName.toLowerCase().includes(q) ||
        c.variantTitle.toLowerCase().includes(q) ||
        (c.orderId && c.orderId.toLowerCase().includes(q))
      )
    }
    return true
  })

  return (
    <main className="min-h-screen bg-[#08080f] px-5 py-8 text-slate-100 selection:bg-white selection:text-black md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono"
              >
                <ArrowLeft size={14} /> Back to Dashboard
              </Link>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl flex items-center gap-3">
              <Key className="text-zinc-300 h-8 w-8" />
              Digital Codes &amp; Vouchers
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage instant redeemable codes for PlayStation Store Top-Ups and ReiKai Gift Cards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/top-up"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold text-zinc-200 hover:bg-white/10 transition"
            >
              <Zap size={14} /> View Top-Up Storefront
            </Link>
            <Link
              href="/gift-cards"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-pink-500/30 bg-pink-950/30 px-4 py-2.5 text-xs font-bold text-pink-300 hover:bg-pink-900/40 transition"
            >
              <Gift size={14} /> View Gift Cards Storefront
            </Link>
          </div>
        </header>

        {/* Overview Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Total Codes in Vault</span>
            <p className="mt-2 text-3xl font-black text-white">{initialCodes.length}</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-5">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">Available to Sell</span>
            <p className="mt-2 text-3xl font-black text-emerald-400">{availableCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">Delivered to Orders</span>
            <p className="mt-2 text-3xl font-black text-zinc-200">{deliveredCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Digital Denominations</span>
            <p className="mt-2 text-3xl font-black text-white">{variants.length}</p>
          </div>
        </div>

        {/* ── BATCH ADD CODES FORM ───────────────────────────────────────── */}
        <section className="mt-8 rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.04] via-black/40 to-black/60 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Plus className="text-zinc-300 h-5 w-5" />
            <h2 className="text-lg font-bold text-white">Batch Add New Digital Voucher Codes</h2>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Select a denomination, paste raw codes (one per line or separated by commas). The codes will be stored as available inventory and variant stock is updated automatically.
          </p>

          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-950/60 p-3 text-xs font-semibold text-emerald-300 flex items-center gap-2">
              <Check size={16} /> {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-950/60 p-3 text-xs font-semibold text-rose-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAddBatch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Digital Product / Denomination *
                </label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-3.5 py-2.5 text-sm text-white focus:border-white/30 focus:outline-none"
                  required
                >
                  {variants.map((v) => (
                    <option key={v.variantId} value={v.variantId}>
                      {v.productName} — {v.variantTitle} ({formatTaka(v.price)} | {v.stockQuantity} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Paste Redemption Codes (one per line) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={batchText}
                  onChange={(e) => setBatchText(e.target.value)}
                  placeholder={`e.g.\nPSN-US50-X21P-8834\nPSN-US50-Y76L-4412\nPSN-US50-K19M-3321`}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/60 p-3 text-sm font-mono text-white placeholder:text-slate-600 focus:border-white/30 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending || !batchText.trim()}
                className="flex items-center gap-2 rounded-xl bg-white text-black hover:bg-zinc-200 px-6 py-2.5 text-xs font-bold text-white  active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus size={16} />}
                <span>Add Codes to Vault</span>
              </button>
            </div>
          </form>
        </section>

        {/* ── CODES INVENTORY TABLE ──────────────────────────────────────── */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Voucher Inventory Log</h3>
              <p className="text-xs text-slate-400">All registered codes and fulfillment states</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search code or order..."
                  className="rounded-xl border border-white/10 bg-black/40 pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:border-white/30 focus:outline-none"
                />
              </div>

              <select
                value={filterVariant}
                onChange={(e) => setFilterVariant(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white focus:border-white/30 focus:outline-none"
              >
                <option value="all">All Denominations</option>
                {variants.map((v) => (
                  <option key={v.variantId} value={v.variantId}>
                    {v.variantTitle}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white focus:border-white/30 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available Only</option>
                <option value="delivered">Delivered Only</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="pb-3 px-3">Redemption Code</th>
                  <th className="pb-3 px-3">Product / Denomination</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Assigned Order</th>
                  <th className="pb-3 px-3">Added Date</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCodes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 font-mono">
                      No voucher codes matching the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredCodes.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-3 font-mono text-zinc-200 font-bold">
                        <div className="flex items-center gap-2">
                          <span>{item.code}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.id, item.code)}
                            title="Copy code"
                            className="text-slate-500 hover:text-white transition"
                          >
                            {copiedId === item.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-white">{item.productName}</p>
                        <p className="text-[11px] text-slate-400">{item.variantTitle}</p>
                      </td>
                      <td className="py-3 px-3">
                        {item.status === 'available' ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            ● Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-bold text-zinc-200">
                            ✓ Delivered
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {item.orderId ? (
                          <Link
                            href={`/admin/orders/${item.orderId}`}
                            className="font-mono text-xs text-zinc-300 hover:underline"
                          >
                            #{item.orderId.slice(0, 8)}
                          </Link>
                        ) : (
                          <span className="text-slate-600 font-mono">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={isPending || item.status === 'delivered'}
                          title={item.status === 'delivered' ? 'Cannot delete delivered code' : 'Delete code'}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-20 disabled:cursor-not-allowed transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
