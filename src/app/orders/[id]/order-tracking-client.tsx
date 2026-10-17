'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  CheckCheck,
  Copy,
  Check,
  ArrowLeft,
  Printer,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  FileText,
  Key,
  Zap,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export type OrderData = {
  id: string
  status: string
  paymentStatus: string
  fulfillmentStatus: string
  customerEmail: string | null
  customerName: string | null
  customerPhone: string | null
  shippingAddress: any
  total: number
  notes: string | null
  adminNotes: string | null
  trackingNumber: string | null
  createdAt: string
  items: Array<{
    id: string
    productName: string
    variantTitle: string | null
    sku: string | null
    quantity: number
    unitPrice: number
  }>
  digitalCodes?: Array<{
    id: string
    code: string
    pin: string | null
    status: string
    variantTitle: string | null
  }>
}

const STEPS = [
  { key: 'pending', label: 'Order Placed', desc: 'Received & Queued', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', desc: 'Verified by Vault', icon: CheckCircle2 },
  { key: 'processing', label: 'Packing', desc: 'Assembling Gear', icon: Package },
  { key: 'shipped', label: 'Dispatched', desc: 'Handed to Courier', icon: Truck },
  { key: 'delivered', label: 'Delivered', desc: 'Mission Complete', icon: CheckCheck },
]

function getStepIndex(status: string) {
  switch (status.toLowerCase()) {
    case 'pending': return 0
    case 'confirmed': return 1
    case 'processing': return 2
    case 'shipped': return 3
    case 'delivered': return 4
    case 'cancelled': return -1
    default: return 0
  }
}

function formatTaka(paisa: number) {
  return `৳${(paisa / 100).toLocaleString('en-BD')}`
}

export function OrderTrackingClient({ order }: { order: OrderData }) {
  const [copied, setCopied] = useState(false)
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)
  const currentStep = getStepIndex(order.status)
  const isCancelled = order.status.toLowerCase() === 'cancelled'

  const copyId = () => {
    navigator.clipboard.writeText(order.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyCode = (codeId: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCodeId(codeId)
    setTimeout(() => setCopiedCodeId(null), 2000)
  }

  const deliveredCodes = order.digitalCodes || []
  const hasDigitalItems = order.items.some(
    (item) => item.sku?.startsWith('TOPUP-') || item.sku?.startsWith('GIFT-')
  )

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="min-h-screen bg-[#000000] text-[#f4f2ff]">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-5 py-10 md:px-8">
        {/* Top navigation */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/orders"
            className="flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white transition"
          >
            <ArrowLeft size={14} /> Back to My Orders
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white transition print:hidden"
          >
            <Printer size={13} /> Print Invoice
          </button>
        </div>

        {/* Success Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-zinc-950 p-6 md:p-8 backdrop-blur-xl mb-8 shadow-2xl">
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-3 py-1 text-xs font-bold text-white/90 mb-3">
                <ShieldCheck size={14} className="text-emerald-400" /> ReiKai Vault Verified Order
              </div>
              <h1 className="text-3xl font-extrabold md:text-4xl text-white">Order Confirmed</h1>
              <p className="mt-1 text-xs text-white/50">
                Placed on <span className="text-white font-medium">{orderDate}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-md">
              <div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-white/40">Order ID</p>
                <p className="font-mono text-xs font-bold text-white truncate max-w-[200px] md:max-w-[240px]">{order.id}</p>
              </div>
              <button
                onClick={copyId}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition ml-2 cursor-pointer"
                title="Copy Order ID"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Stepper */}
          <div className="relative mt-8 pt-6 border-t border-white/10">
            {isCancelled ? (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-center text-sm text-rose-400 font-bold">
                This order has been cancelled.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon
                  const isDone = idx < currentStep
                  const isCurrent = idx === currentStep
                  return (
                    <div
                      key={step.key}
                      className={`relative flex flex-col items-center rounded-2xl border p-3.5 text-center transition ${
                        isCurrent
                          ? 'border-white bg-white/10 shadow-lg'
                          : isDone
                          ? 'border-emerald-500/30 bg-emerald-500/10'
                          : 'border-white/5 bg-white/[0.01] opacity-50'
                      }`}
                    >
                      <div
                        className={`mb-2 flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold ${
                          isCurrent
                            ? 'bg-white text-black shadow-md'
                            : isDone
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-white/10 text-white/40'
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <p className={`text-xs font-bold ${isCurrent ? 'text-white' : isDone ? 'text-emerald-400' : 'text-white/40'}`}>
                        {step.label}
                      </p>
                      <p className="mt-0.5 text-[10px] text-white/40 line-clamp-1">{step.desc}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Digital Voucher Codes Section */}
        {deliveredCodes.length > 0 && (
          <div className="mb-8 rounded-3xl border border-white/15 bg-zinc-950/80 p-6 md:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-white/70 font-bold flex items-center gap-1.5">
                  <Key className="h-4 w-4" /> Digital Voucher Keys
                </span>
                <h2 className="mt-1 text-2xl font-black text-white">Your Digital Codes Are Ready!</h2>
              </div>
              <span className="self-start sm:self-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 font-mono text-xs font-bold text-emerald-400">
                100% Genuine · Verified
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {deliveredCodes.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/[0.04] p-5 backdrop-blur"
                >
                  <div>
                    <span className="text-xs text-white/50 block font-mono uppercase tracking-wider">
                      {item.variantTitle || 'Digital Code'}
                    </span>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-widest selection:bg-white/20">
                        {item.code}
                      </span>
                      {item.pin && (
                        <span className="rounded-lg bg-white/10 px-2 py-1 font-mono text-xs text-white/70">
                          PIN: {item.pin}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyCode(item.id, item.code)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-mono text-xs font-bold text-black shadow-lg hover:bg-zinc-200 transition active:scale-95 shrink-0 cursor-pointer"
                  >
                    {copiedCodeId === item.id ? (
                      <>
                        <Check className="h-4 w-4" /> COPIED!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> COPY CODE
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Redemption Instructions */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-white/60">
              <span className="font-bold text-white block mb-1">🎮 How to Redeem on PlayStation:</span>
              <span>
                On your PS5 or PS4 console, open the <strong>PlayStation Store</strong>, select your profile avatar in the upper right, choose <strong>Redeem Code</strong>, and enter your 12-digit code above. Funds apply to your wallet immediately!
              </span>
            </div>
          </div>
        )}

        {/* Digital codes pending notice */}
        {hasDigitalItems && deliveredCodes.length === 0 && !isCancelled && (
          <div className="mb-8 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 flex items-start gap-4">
            <Zap className="h-6 w-6 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h3 className="font-bold text-amber-300 text-sm">Digital Delivery In Progress</h3>
              <p className="mt-1 text-xs text-amber-200/70 leading-relaxed">
                Your order includes digital top-up or gift card items. Our automated vault verifies your payment and issues your unique 12-digit codes directly here. Please refresh this page in a moment or wait for confirmation.
              </p>
            </div>
          </div>
        )}

        {/* Tracking info if available */}
        {order.trackingNumber && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-blue-400" />
              <div>
                <p className="text-xs font-bold text-blue-300">Courier Tracking Code</p>
                <p className="font-mono text-sm font-bold text-white">{order.trackingNumber}</p>
              </div>
            </div>
            {order.adminNotes && (
              <p className="text-xs text-muted-foreground text-right">{order.adminNotes}</p>
            )}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Order items (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <Package size={16} className="text-[#a0e4f1]" /> Purchased Artifacts ({order.items.length})
              </h2>

              <div className="divide-y divide-white/5">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-foreground truncate">{item.productName}</p>
                      {item.variantTitle && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.variantTitle}</p>
                      )}
                      {item.sku && (
                        <p className="font-mono text-[10px] text-muted-foreground/60 mt-0.5">SKU: {item.sku}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm text-[#a0e4f1]">{formatTaka(item.unitPrice * item.quantity)}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.quantity} × {formatTaka(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total calculation */}
              <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatTaka(order.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Vault Shipping & Delivery</span>
                  <span className="text-emerald-400 font-semibold">FREE (Cosmic Express)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-foreground pt-3 border-t border-white/5">
                  <span>Total Amount</span>
                  <span className="text-white text-xl font-black">{formatTaka(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details (1 col) */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-white/60" /> Delivery Info
              </h2>

              <div className="space-y-3 text-xs">
                {order.customerName && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-mono">Recipient</span>
                    <span className="font-semibold text-foreground text-sm">{order.customerName}</span>
                  </div>
                )}
                {order.customerPhone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone size={12} className="text-white/40" />
                    <span>{order.customerPhone}</span>
                  </div>
                )}
                {order.customerEmail && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail size={12} className="text-white/40" />
                    <span className="truncate">{order.customerEmail}</span>
                  </div>
                )}

                {order.shippingAddress && (order.shippingAddress.address || order.shippingAddress.city) && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-muted-foreground block text-[10px] uppercase font-mono">Address</span>
                    <p className="text-foreground mt-0.5">
                      {order.shippingAddress.address}
                      {order.shippingAddress.city ? `, ${order.shippingAddress.city}` : ''}
                      {order.shippingAddress.postalCode ? ` - ${order.shippingAddress.postalCode}` : ''}
                    </p>
                  </div>
                )}

                {order.notes && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-muted-foreground block text-[10px] uppercase font-mono">Customer Notes</span>
                    <p className="text-muted-foreground mt-0.5 italic">"{order.notes}"</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur text-center space-y-3">
              <p className="text-xs text-muted-foreground">
                Need to modify your order or have questions? Contact support via ReiKai frequency.
              </p>
              <Link
                href="/"
                className="block w-full rounded-xl bg-white/5 border border-white/15 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition text-center"
              >
                Continue Browsing Vault
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
