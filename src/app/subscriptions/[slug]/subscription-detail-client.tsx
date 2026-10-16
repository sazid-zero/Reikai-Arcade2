'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, ChevronRight, Crown, Minus, Plus, RefreshCw, ShieldCheck, Zap } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useCart } from '@/components/cart-context'

interface Variant {
  id: string
  title: string | null
  sku: string | null
  price: number
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

const DURATION_MAP: Record<string, string> = {
  '1 month': '1 Month',
  '3 months': '3 Months',
  '6 months': '6 Months',
  '12 months': '12 Months',
  '1 year': '1 Year',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annual: 'Annual',
}

export function SubscriptionDetailClient({ product }: Props) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart, setCartOpen } = useCart()

  const variants = product.variants
  const selectedVariant = variants[selectedVariantIdx]

  const handleAddToCart = () => {
    if (!selectedVariant) return
    for (let i = 0; i < quantity; i++) {
      addToCart(
        {
          id: selectedVariant.id,
          variantId: selectedVariant.id,
          sku: selectedVariant.sku ?? selectedVariant.id,
          name: product.name,
          price: Math.round(selectedVariant.price / 100), // convert paisa → taka for cart display
          type: 'subscription',
          image: product.imageUrl,
        },
        {
          edition: selectedVariant.title ?? undefined,
          price: Math.round(selectedVariant.price / 100),
        },
      )
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
    setCartOpen(true)
  }

  const discount =
    selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price
      ? Math.round(((selectedVariant.compareAtPrice - selectedVariant.price) / selectedVariant.compareAtPrice) * 100)
      : null

  return (
    <div className="min-h-screen bg-[#000000] text-[#f4f2ff]">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-xs text-white/40">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/subscriptions" className="hover:text-white transition">Subscriptions</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white/70 truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Left – Image */}
          <div className="flex flex-col gap-5">
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#4b22d2]/20 to-black shadow-2xl">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Crown className="h-24 w-24 text-[#c673e2]/40" />
                </div>
              )}
              {discount !== null && (
                <div className="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-sm font-black text-white">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Gallery thumbnails */}
            {product.galleryImages.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5"
                  >
                    <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" sizes="80px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right – Details */}
          <div className="flex flex-col">
            {/* Brand badge */}
            {product.brand && (
              <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#c673e2]/30 bg-[#c673e2]/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#c673e2]">
                <Crown className="h-3 w-3" /> {product.brand}
              </span>
            )}

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{product.name}</h1>

            {product.shortDescription && (
              <p className="mt-3 text-sm text-white/60 leading-relaxed">{product.shortDescription}</p>
            )}

            {/* Platform / category tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {product.platform && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                  {product.platform}
                </span>
              )}
              {product.category && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                  {product.category}
                </span>
              )}
            </div>

            {/* Duration / plan selector */}
            {variants.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">
                  Choose Plan Duration
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {variants.map((variant, idx) => {
                    const isSel = idx === selectedVariantIdx
                    const outOfStock = variant.stockQuantity <= 0
                    const label = DURATION_MAP[variant.title?.toLowerCase() ?? ''] ?? variant.title ?? `Plan ${idx + 1}`
                    const varDiscount =
                      variant.compareAtPrice && variant.compareAtPrice > variant.price
                        ? Math.round(((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100)
                        : null
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        disabled={outOfStock}
                        onClick={() => { setSelectedVariantIdx(idx); setQuantity(1) }}
                        className={`relative flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all ${
                          outOfStock
                            ? 'cursor-not-allowed opacity-40 border-white/10 bg-white/[0.02]'
                            : isSel
                            ? 'border-[#a0e4f1] bg-gradient-to-r from-[#4b22d2]/30 to-[#c673e2]/20 shadow-[0_0_22px_rgba(160,228,241,0.25)]'
                            : 'border-white/10 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]'
                        }`}
                      >
                        {isSel && (
                          <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#a0e4f1] shadow-[0_0_8px_#a0e4f1]">
                            <Check className="h-2.5 w-2.5 text-black font-black" />
                          </span>
                        )}
                        {varDiscount !== null && (
                          <span className="mb-1 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                            -{varDiscount}%
                          </span>
                        )}
                        <span className={`text-xs font-bold ${isSel ? 'text-[#a0e4f1]' : 'text-white'}`}>{label}</span>
                        <span className="mt-1 font-mono text-sm font-black text-white">
                          {formatBDT(variant.price)}
                        </span>
                        {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
                          <span className="font-mono text-[10px] text-white/40 line-through">
                            {formatBDT(variant.compareAtPrice)}
                          </span>
                        )}
                        {outOfStock && (
                          <span className="mt-1 text-[10px] text-red-400">Out of stock</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Price + discount */}
            {selectedVariant && (
              <div className="mt-6 flex items-end gap-3">
                <span className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#a0e4f1]">
                  {formatBDT(selectedVariant.price)}
                </span>
                <span className="text-sm text-white/40 font-mono">BDT</span>
                {selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price && (
                  <span className="text-xl text-white/30 line-through font-mono">{formatBDT(selectedVariant.compareAtPrice)}</span>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Qty</p>
              <div className="flex items-center rounded-xl border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-l-xl text-white/60 hover:text-white transition"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min((selectedVariant?.stockQuantity ?? 1), q + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-r-xl text-white/60 hover:text-white transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              {selectedVariant && (
                <span className="text-xs text-white/30">{selectedVariant.stockQuantity} in stock</span>
              )}
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
              onClick={handleAddToCart}
              className={`mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl font-extrabold text-base transition-all duration-300 ${
                added
                  ? 'bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                  : 'bg-gradient-to-r from-[#4b22d2] via-[#c673e2] to-[#a0e4f1] text-white shadow-[0_0_30px_rgba(75,34,210,0.4)] hover:shadow-[0_0_40px_rgba(160,228,241,0.5)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-5 w-5" /> Added to Cart!
                </>
              ) : selectedVariant?.stockQuantity === 0 ? (
                'Out of Stock'
              ) : (
                <>
                  <Crown className="h-5 w-5" /> Add to Cart · {selectedVariant ? formatBDT(selectedVariant.price * quantity) : '—'}
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: Zap, label: 'Instant Delivery', sub: 'Code sent right away' },
                { icon: ShieldCheck, label: '100% Genuine', sub: 'Official keys only' },
                { icon: RefreshCw, label: 'Any Region?', sub: 'Check description' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center">
                  <Icon className="h-4 w-4 text-[#a0e4f1]" />
                  <p className="text-[10px] font-bold text-white/80">{label}</p>
                  <p className="text-[10px] text-white/40">{sub}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">About This Subscription</p>
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Features */}
            {product.features.length > 0 && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">What's Included</p>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#a0e4f1]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Back link */}
            <Link
              href="/subscriptions"
              className="mt-8 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Subscriptions
            </Link>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
