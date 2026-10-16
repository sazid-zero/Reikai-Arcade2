'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Package,
  Search,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
  User,
  Zap,
  ChevronRight,
} from 'lucide-react'

export type OrderItem = {
  id: string
  productName: string
  variantTitle: string | null
  quantity: number
  unitPrice: number
}

export type OrderSummary = {
  id: string
  status: string
  paymentStatus: string
  fulfillmentStatus: string
  customerEmail: string | null
  customerName: string | null
  customerPhone: string | null
  total: number
  createdAt: string
  items: OrderItem[]
}

type Props = {
  initialOrders: OrderSummary[]
  user: {
    id: string
    email: string
    phone?: string | null
    name: string
    role: string
  } | null
}

function formatTaka(paisa: number) {
  return `৳${(paisa / 100).toLocaleString('en-BD')}`
}

function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case 'delivered':
      return {
        label: 'Delivered',
        className: 'border-emerald-500/30 bg-emerald-950/60 text-emerald-400',
        icon: CheckCircle2,
      }
    case 'shipped':
      return {
        label: 'Dispatched',
        className: 'border-[#a0e4f1]/40 bg-[#a0e4f1]/10 text-[#a0e4f1]',
        icon: Truck,
      }
    case 'processing':
    case 'confirmed':
      return {
        label: status === 'processing' ? 'Processing' : 'Confirmed',
        className: 'border-[#c673e2]/40 bg-[#4b22d2]/20 text-[#c673e2]',
        icon: Package,
      }
    case 'cancelled':
      return {
        label: 'Cancelled',
        className: 'border-rose-500/40 bg-rose-950/50 text-rose-400',
        icon: Clock,
      }
    default:
      return {
        label: 'Pending',
        className: 'border-amber-500/40 bg-amber-950/50 text-amber-300',
        icon: Clock,
      }
  }
}

export function OrdersClient({ initialOrders, user }: Props) {
  const router = useRouter()
  const [lookupQuery, setLookupQuery] = useState('')
  const [lookupError, setLookupError] = useState('')

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault()
    setLookupError('')
    const trimmed = lookupQuery.trim()
    if (!trimmed) {
      setLookupError('Please enter an Order ID or Phone number.')
      return
    }

    // Check if it looks like a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (uuidRegex.test(trimmed)) {
      router.push(`/orders/${trimmed}`)
    } else {
      // Look up within current user orders first
      const match = initialOrders.find(
        (o) =>
          o.id.toLowerCase().includes(trimmed.toLowerCase()) ||
          o.customerPhone?.includes(trimmed)
      )
      if (match) {
        router.push(`/orders/${match.id}`)
      } else {
        setLookupError('Order not found. Please verify the full Order ID.')
      }
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header / Hero */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/5 bg-black/90 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_20%,rgba(160,228,241,0.12),transparent_70%),radial-gradient(ellipse_60%_45%_at_20%_80%,rgba(75,34,210,0.2),transparent_65%)]" />

        <div className="relative">
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-white/40">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">Orders</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#a0e4f1]/40 bg-[#a0e4f1]/10 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-[#a0e4f1] shadow-[0_0_12px_rgba(160,228,241,0.25)]">
                <ShieldCheck className="h-3.5 w-3.5" /> ReiKai Vault Order Desk
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl font-black text-white">
                Track &amp; View{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4b22d2] via-[#c673e2] to-[#a0e4f1] drop-shadow-[0_0_20px_rgba(160,228,241,0.3)]">
                  Your Orders
                </span>
              </h1>
              <p className="mt-1 text-sm text-white/60">
                {user ? `Logged in as ${user.name} (${user.email})` : 'Track dispatch, check delivery courier status, or retrieve digital codes.'}
              </p>
            </div>

            {!user && (
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 rounded-xl border border-[#a0e4f1]/40 bg-[#a0e4f1]/10 px-4 py-2.5 font-['DM_Mono'] text-xs font-bold text-white hover:bg-[#a0e4f1]/20 transition shadow-[0_0_16px_rgba(160,228,241,0.25)]"
              >
                <User size={14} className="text-[#a0e4f1]" />
                <span>SIGN IN FOR FULL HISTORY</span>
              </Link>
            )}
          </div>

          {/* Direct Order Lookup Form */}
          <form onSubmit={handleLookup} className="mt-8 flex flex-col sm:flex-row items-stretch gap-2.5 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                placeholder="Enter 36-char Order ID to track..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#a0e4f1] focus:ring-1 focus:ring-[#a0e4f1]/50 transition font-mono"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4b22d2] via-[#c673e2] to-[#a0e4f1] px-5 py-2.5 font-['DM_Mono'] text-xs font-bold text-white shadow-[0_0_16px_rgba(75,34,210,0.35)] hover:opacity-90 transition cursor-pointer"
            >
              <span>TRACK ORDER</span>
              <ArrowRight size={14} />
            </button>
          </form>
          {lookupError && <p className="mt-2 text-xs text-rose-400 font-medium">{lookupError}</p>}
        </div>
      </div>

      {/* Orders List */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-[#a0e4f1]" />
          <span>{user ? 'Your Order History' : 'Recent Lookups'}</span>
          <span className="text-xs font-mono text-white/40">({initialOrders.length})</span>
        </h2>

        {initialOrders.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-white/5 bg-black/60 backdrop-blur-xl p-8 shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4b22d2]/20 border border-[#c673e2]/30 text-[#a0e4f1] shadow-[0_0_24px_rgba(160,228,241,0.2)]">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-xl font-extrabold text-white">No Orders Placed Yet</h3>
            <p className="mt-2 text-sm text-white/50 max-w-md mx-auto">
              You haven't completed any orders with this account yet. Ready to experience next-gen PlayStation gaming?
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link
                href="/games"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#4b22d2] to-[#c673e2] shadow-[0_0_20px_rgba(75,34,210,0.4)] hover:opacity-90 transition"
              >
                <span>Browse Games</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/top-up"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider text-zinc-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition"
              >
                <Zap size={14} className="text-[#a0e4f1]" />
                <span>Instant Top-Up</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {initialOrders.map((order) => {
              const badge = getStatusBadge(order.status)
              const BadgeIcon = badge.icon
              const dateStr = new Date(order.createdAt).toLocaleDateString('en-BD', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })

              return (
                <div
                  key={order.id}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 hover:border-[#a0e4f1]/50 hover:bg-white/[0.05] hover:shadow-[0_12px_36px_rgba(0,0,0,0.8),0_0_24px_rgba(160,228,241,0.2)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-white/50">ORDER</span>
                        <span className="font-mono text-xs font-bold text-white">{order.id}</span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.className}`}>
                          <BadgeIcon size={12} />
                          {badge.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/40">{dateStr}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="font-mono text-base font-black text-[#a0e4f1] drop-shadow-[0_0_10px_rgba(160,228,241,0.4)]">
                        {formatTaka(order.total)}
                      </span>
                      <p className="text-[11px] text-white/40 uppercase tracking-wider font-mono">
                        Payment: {order.paymentStatus}
                      </p>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="py-3 flex flex-col gap-1.5">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs text-white/80">
                        <span className="truncate pr-4">
                          {item.quantity}× {item.productName}
                          {item.variantTitle ? ` (${item.variantTitle})` : ''}
                        </span>
                        <span className="font-mono text-white/50 shrink-0">
                          {formatTaka(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer link to detail page */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-white/40">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} in shipment
                    </span>
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a0e4f1] group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Track &amp; View Details</span>
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
