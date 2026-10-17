'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, ChevronRight, Minus, Plus, ShieldCheck, Zap } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useCart } from '@/components/cart-context'

interface Variant {
  id: string
  title: string | null
  sku: string | null
  price: number // paisa
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

export function TopUpDetailClient({ product }: Props) {
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
          sku: selectedVariant.sku || selectedVariant.id,
          name: product.name,
          price: Math.round(selectedVariant.price / 100), // convert to taka for cart display
          type: 'topup',
          image: product.imageUrl,
        },
        {
          edition: selectedVariant.title || undefined,
          price: Math.round(selectedVariant.price / 100),
        },
      )
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    setCartOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#f4f2ff]">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-xs text-white/40">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/top-up" className="hover:text-white transition">Game Top-Up</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white/70">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
          {/* ── Left: Game Banner ── */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
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
                  <span className="text-8xl opacity-20">🎮</span>
                </div>
              )}
            </div>

            {/* Gallery thumbnails */}
            {product.galleryImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10"
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Package Selector ── */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
                {product.platform && <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">{product.platform}</span>}
                {product.brand && <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">{product.brand}</span>}
                {product.category && <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">{product.category}</span>}
              </div>
              <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{product.name}</h1>
              {product.shortDescription && (
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{product.shortDescription}</p>
              )}
            </div>

            {/* Package Selector */}
            {variants.length > 0 ? (
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/50">
                  Select Package — Amount
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, idx) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantIdx(idx)}
                      className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                        selectedVariantIdx === idx
                          ? 'border-white bg-white text-black shadow-lg font-bold'
                          : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-300">
                No packages configured yet. Admin needs to add variants to this product.
              </div>
            )}

            {/* Price + Quantity */}
            {selectedVariant && (
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="font-mono text-4xl font-black text-white">
                    {formatBDT(selectedVariant.price)}
                  </span>
                  {selectedVariant.compareAtPrice && (
                    <span className="ml-3 font-mono text-lg text-white/30 line-through">
                      {formatBDT(selectedVariant.compareAtPrice)}
                    </span>
                  )}
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono text-lg font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedVariant && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-bold text-black shadow-lg transition-all duration-300 hover:bg-zinc-200 active:scale-[0.98]"
                >
                  <Zap className="h-4 w-4 fill-black" />
                  Place Order Now
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 py-4 text-sm font-bold text-white transition hover:bg-white/10 hover:border-white/15 active:scale-[0.98]"
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
                      Added to Bag!
                    </>
                  ) : (
                    'Add to Bag'
                  )}
                </button>
              </div>
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 border-t border-white/5 pt-4">
              {[
                { icon: Zap, text: 'Instant digital delivery' },
                { icon: ShieldCheck, text: '100% genuine & verified' },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-xs text-white/40">
                  <Icon className="h-3.5 w-3.5 text-white/60" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Description + Instructions below ── */}
        <div className="mt-14 border-t border-white/5 pt-10">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Description */}
            {product.description && (
              <div>
                <h2 className="text-lg font-black text-white mb-4">{product.name}</h2>
                <div
                  className="prose prose-sm prose-invert max-w-none text-white/60 leading-relaxed [&_a]:text-primary [&_strong]:text-white"
                  dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }}
                />
              </div>
            )}

            {/* Features / Instructions */}
            {product.features.length > 0 && (
              <div>
                <h2 className="text-lg font-black text-white mb-4">How to Top-Up</h2>
                <ul className="space-y-2.5">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="mt-0.5 text-primary">👉</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/top-up"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Game Top-Up
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
