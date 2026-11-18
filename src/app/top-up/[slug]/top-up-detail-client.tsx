'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles,
  HelpCircle,
  Gem,
  CheckCircle2,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useCart } from '@/components/cart-context'

interface Variant {
  id: string
  title: string | null
  sku: string | null
  price: number // in paisa (100 paisa = 1 BDT)
  compareAtPrice: number | null
  stockQuantity: number
}

interface Product {
  id: string
  slug: string
  name: string
  brand: string | null
  platform: string | null
  category: string | null
  imageUrl: string | null
  galleryImages: string[]
  shortDescription: string | null
  description: string | null
  features: string[]
  rating: number
  reviewCount: number
  variants: Variant[]
}

interface Props {
  product: Product
}

function formatBDT(paisa: number) {
  return `৳${Math.round(paisa / 100).toLocaleString('en-BD')}`
}

type ServerConfig = {
  id: string
  name: string
  shortName: string
  flag: string
  tag: string
  badge: string
  prefix: string
  skuPrefix: string
}

const FREE_FIRE_SERVERS: ServerConfig[] = [
  {
    id: 'bd',
    name: 'Bangladesh Server',
    shortName: 'BD Server',
    flag: '🇧🇩',
    tag: 'Direct UID Top-Up',
    badge: 'Fastest 60s',
    prefix: 'BD:',
    skuPrefix: 'FF-BD',
  },
  {
    id: 'in',
    name: 'India Server',
    shortName: 'India Server',
    flag: '🇮🇳',
    tag: 'Direct UID Delivery',
    badge: 'Instant Sync',
    prefix: 'IN:',
    skuPrefix: 'FF-IN',
  },
  {
    id: 'id',
    name: 'Indonesia Server',
    shortName: 'Indonesia Server',
    flag: '🇮🇩',
    tag: 'Fast Server Credit',
    badge: 'Best Rates',
    prefix: 'ID:',
    skuPrefix: 'FF-ID',
  },
  {
    id: 'global',
    name: 'Global / Singapore',
    shortName: 'Global Server',
    flag: '🌐',
    tag: 'Worldwide Voucher / UID',
    badge: 'Global Code',
    prefix: 'Global:',
    skuPrefix: 'FF-GL',
  },
]

export function TopUpDetailClient({ product }: Props) {
  const isFreeFire = product.slug.toLowerCase().includes('free-fire') || product.name.toLowerCase().includes('free fire')

  // Detect servers from variants
  const detectedServers = useMemo(() => {
    if (!isFreeFire) return []
    return FREE_FIRE_SERVERS
  }, [isFreeFire])

  const [selectedServerId, setSelectedServerId] = useState<string>(
    detectedServers.length > 0 ? detectedServers[0].id : 'all'
  )
  const [playerId, setPlayerId] = useState('')
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'diamonds' | 'passes'>('all')
  const [showUidHelp, setShowUidHelp] = useState(false)

  const { addToCart, setCartOpen } = useCart()

  // Filter variants belonging to the selected server
  const serverVariants = useMemo(() => {
    if (!isFreeFire) return product.variants

    const selectedServer = detectedServers.find((s) => s.id === selectedServerId)
    if (!selectedServer) return product.variants

    const filtered = product.variants.filter((v) => {
      const title = v.title || ''
      const sku = v.sku || ''
      return title.startsWith(selectedServer.prefix) || sku.startsWith(selectedServer.skuPrefix)
    })

    return filtered.length > 0 ? filtered : product.variants
  }, [isFreeFire, product.variants, selectedServerId, detectedServers])

  // Filter by category tab (diamonds vs passes)
  const displayVariants = useMemo(() => {
    if (activeTab === 'all') return serverVariants
    if (activeTab === 'passes') {
      return serverVariants.filter((v) => {
        const t = (v.title || '').toLowerCase()
        return t.includes('membership') || t.includes('pass') || t.includes('weekly') || t.includes('monthly')
      })
    }
    // Diamonds only
    return serverVariants.filter((v) => {
      const t = (v.title || '').toLowerCase()
      return !t.includes('membership') && !t.includes('pass')
    })
  }, [serverVariants, activeTab])

  // Keep selected variant in sync with current server packages
  const currentVariant = useMemo(() => {
    if (selectedVariantId) {
      const found = displayVariants.find((v) => v.id === selectedVariantId)
      if (found) return found
    }
    return displayVariants[0] || serverVariants[0] || null
  }, [displayVariants, serverVariants, selectedVariantId])

  const selectedServer = detectedServers.find((s) => s.id === selectedServerId) || detectedServers[0]

  // Clean package title for display (strip "BD:", "IN:", etc.)
  const getCleanTitle = (title: string | null) => {
    if (!title) return 'Standard Package'
    return title.replace(/^(BD|IN|ID|Global):\s*/i, '').trim()
  }

  // Calculate starting prices for server cards
  const getServerMinPrice = (server: ServerConfig) => {
    const vars = product.variants.filter(
      (v) => (v.title || '').startsWith(server.prefix) || (v.sku || '').startsWith(server.skuPrefix)
    )
    if (vars.length === 0) return null
    const min = Math.min(...vars.map((v) => v.price))
    return formatBDT(min)
  }

  const isUidValid = playerId.trim().length >= 6

  const handleAddToCart = () => {
    if (!currentVariant) return

    const cleanTitle = getCleanTitle(currentVariant.title)
    const serverLabel = selectedServer ? selectedServer.shortName : ''
    const uidLabel = playerId.trim() ? `UID: ${playerId.trim()}` : ''
    const editionDetails = [serverLabel, cleanTitle, uidLabel].filter(Boolean).join(' · ')

    for (let i = 0; i < quantity; i++) {
      addToCart(
        {
          id: currentVariant.id,
          variantId: currentVariant.id,
          sku: currentVariant.sku || currentVariant.id,
          name: product.name,
          price: Math.round(currentVariant.price / 100),
          type: 'topup',
          image: product.imageUrl,
        },
        {
          edition: editionDetails || cleanTitle,
          price: Math.round(currentVariant.price / 100),
        }
      )
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    setCartOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#f4f2ff]">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-16">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/40">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/top-up" className="hover:text-white transition">Game Top-Up</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white/80 font-semibold">{product.name}</span>
        </nav>

        {/* ── Main Two-Column Layout ── */}
        <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
          
          {/* ── Left Column: Game Media & Specs ── */}
          <div className="flex flex-col gap-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 380px"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-8xl opacity-20">🔥</span>
                </div>
              )}
              {/* Soft overlay vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                  Official Garena Partner
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs uppercase tracking-wider text-white/60 font-mono">Instant Top-Up</p>
                <h2 className="text-2xl font-black text-white">{product.name}</h2>
              </div>
            </div>

            {/* Quick trust metrics */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Delivery Speed</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Zap size={13} fill="currentColor" /> Instant (60 seconds)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-white/5 pt-2.5">
                <span className="text-white/50">Accepted Currency</span>
                <span className="font-bold text-white">BDT (৳ Taka)</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-white/5 pt-2.5">
                <span className="text-white/50">Payment Methods</span>
                <span className="font-mono text-white/80">bKash · Nagad · Cards</span>
              </div>
            </div>
          </div>

          {/* ── Right Column: Interactive Multi-Step Top-Up Flow ── */}
          <div className="flex flex-col gap-8">
            
            {/* Title Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/40 mb-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">Direct UID Top-Up</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">All Servers Online</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {product.name} <span className="text-white/40 font-light">Diamonds</span>
              </h1>
              <p className="mt-2 text-sm text-white/60 leading-relaxed max-w-2xl">
                Select your game server, enter your Player ID (UID), and choose your desired Diamond package or Membership.
              </p>
            </div>

            {/* ── STEP 1: Select Game Server Cards ── */}
            {detectedServers.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-black font-mono text-[10px] font-black">1</span>
                    Select Server
                  </span>
                  <span className="text-xs text-white/40 font-mono">4 Regions Available</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {detectedServers.map((server) => {
                    const isSelected = selectedServerId === server.id
                    const minPrice = getServerMinPrice(server)

                    return (
                      <button
                        key={server.id}
                        type="button"
                        onClick={() => {
                          setSelectedServerId(server.id)
                          setSelectedVariantId(null) // reset to first in server
                        }}
                        className={`group relative flex flex-col p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'border-white bg-white/10 shadow-[0_0_24px_rgba(255,255,255,0.15)] ring-1 ring-white/50'
                            : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl" role="img" aria-label={server.name}>{server.flag}</span>
                            <div>
                              <h3 className="text-sm font-bold text-white group-hover:text-white transition">
                                {server.name}
                              </h3>
                              <p className="text-[11px] text-white/50">{server.tag}</p>
                            </div>
                          </div>
                          {isSelected ? (
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-white/20" />
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-mono font-bold text-white/80">
                            {server.badge}
                          </span>
                          {minPrice && (
                            <span className="font-mono font-bold text-white">
                              From {minPrice} <span className="text-white/40 text-[10px]">BDT</span>
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── STEP 2: Player ID (UID) Input ── */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-black font-mono text-[10px] font-black">2</span>
                  Enter Player ID (UID)
                </span>
                <button
                  type="button"
                  onClick={() => setShowUidHelp(!showUidHelp)}
                  className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white transition cursor-pointer"
                >
                  <HelpCircle size={13} /> Where is my UID?
                </button>
              </div>

              {showUidHelp && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-white/70 leading-relaxed">
                  <strong className="text-white">How to find your Free Fire UID:</strong>
                  <ol className="list-decimal list-inside mt-1.5 space-y-1 text-white/60">
                    <li>Open Free Fire on your device.</li>
                    <li>Tap your avatar / profile banner in the top-left corner.</li>
                    <li>Look for <strong className="text-white">UID</strong> under your nickname and tap the copy icon.</li>
                    <li>Paste your numeric UID into the field below.</li>
                  </ol>
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 1827364521 (Enter your Player ID)"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full h-12 rounded-2xl border border-white/15 bg-white/5 px-4 pr-24 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/40 transition"
                  maxLength={12}
                />
                {isUidValid && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-400 text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                    <Check size={12} /> Ready
                  </div>
                )}
              </div>
            </div>

            {/* ── STEP 3: Select Package ── */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-black font-mono text-[10px] font-black">3</span>
                  Select Package
                </span>

                {/* Filter Tabs */}
                <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('all')}
                    className={`rounded-lg px-3 py-1 font-semibold transition ${
                      activeTab === 'all' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('diamonds')}
                    className={`rounded-lg px-3 py-1 font-semibold transition ${
                      activeTab === 'diamonds' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    💎 Diamonds
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('passes')}
                    className={`rounded-lg px-3 py-1 font-semibold transition ${
                      activeTab === 'passes' ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    🎫 Passes
                  </button>
                </div>
              </div>

              {/* Package Tiles Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {displayVariants.map((v) => {
                  const isSelected = currentVariant?.id === v.id
                  const cleanTitle = getCleanTitle(v.title)
                  const isPass = cleanTitle.toLowerCase().includes('pass') || cleanTitle.toLowerCase().includes('membership')

                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`group relative flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-white bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.18)] ring-1 ring-white/60'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="text-xl">{isPass ? '🎫' : '💎'}</span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-white shrink-0" />}
                      </div>

                      <div className="mt-2.5">
                        <p className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                          {cleanTitle}
                        </p>
                        
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="font-mono text-sm sm:text-base font-black text-white">
                            {formatBDT(v.price)}
                          </span>
                          {v.compareAtPrice && (
                            <span className="font-mono text-[11px] text-white/30 line-through">
                              {formatBDT(v.compareAtPrice)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-white/40 font-mono">BDT</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── STEP 4: Quantity & Live Order Bar ── */}
            {currentVariant && (
              <div className="rounded-3xl border border-white/15 bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5">
                
                {/* Summary Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Selected Item</p>
                    <p className="text-base font-bold text-white mt-0.5">
                      {selectedServer?.flag} {selectedServer?.shortName} — {getCleanTitle(currentVariant.title)}
                    </p>
                    {playerId.trim() ? (
                      <p className="text-xs text-emerald-400 font-mono mt-0.5">UID: {playerId.trim()}</p>
                    ) : (
                      <p className="text-xs text-amber-300/80 font-mono mt-0.5">⚠️ No Player ID entered yet</p>
                    )}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/50 font-mono">Qty:</span>
                    <div className="flex items-center rounded-xl border border-white/15 bg-white/5 px-2 py-1">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10 transition text-white"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-7 text-center font-mono text-sm font-bold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/10 transition text-white"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Total & Checkout Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-white/40 uppercase tracking-wider font-mono">Total in BDT:</span>
                    <div className="font-mono text-3xl font-black text-white">
                      {formatBDT(currentVariant.price * quantity)}{' '}
                      <span className="text-xs text-white/40 font-normal">BDT</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-black shadow-lg hover:bg-zinc-200 transition active:scale-[0.98] cursor-pointer"
                    >
                      <Zap size={15} fill="currentColor" />
                      Place Order Now
                    </button>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/15 transition active:scale-[0.98] cursor-pointer"
                    >
                      {added ? (
                        <>
                          <Check size={15} className="text-emerald-400" /> Added!
                        </>
                      ) : (
                        'Add to Bag'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* How to redeem instructions */}
            <div className="border-t border-white/5 pt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 mb-3">
                How It Works
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white/60">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <span className="font-mono font-bold text-white">01 // Select Server</span>
                  <p className="mt-1 text-white/50">Pick your region (Bangladesh, India, Indonesia, or Global).</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <span className="font-mono font-bold text-white">02 // Enter UID</span>
                  <p className="mt-1 text-white/50">Copy your numeric Player ID from your in-game Free Fire profile.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <span className="font-mono font-bold text-white">03 // Instant Delivery</span>
                  <p className="mt-1 text-white/50">Diamonds are credited directly to your account within 60 seconds.</p>
                </div>
              </div>
            </div>

            {/* Back link */}
            <div className="pt-2">
              <Link
                href="/top-up"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition"
              >
                <ArrowLeft size={13} /> Back to all Game Top-Ups
              </Link>
            </div>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
