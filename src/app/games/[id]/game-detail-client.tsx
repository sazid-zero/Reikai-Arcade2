'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useCart } from '@/components/cart-context'
import {
  ArrowRight,
  Check,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  ThumbsUp,
  Truck,
  Zap,
} from 'lucide-react'

type Variant = {
  id: string
  title: string | null
  sku: string | null
  price: number
  compareAtPrice: number | null
  stockQuantity: number
}

type Game = {
  id: string
  slug: string
  name: string
  type: string
  shortDescription: string | null
  description: string | null
  brand: string | null
  platform: string | null
  category: string | null
  imageUrl: string | null
  galleryImages: string[]
  tags: string[]
  features: string[]
  specs: Record<string, string>
  rating: number
  reviewCount: number
  featured: boolean
  variants: Variant[]
}

type RelatedGame = {
  id: string
  slug: string
  name: string
  imageUrl: string | null
  category: string | null
  platform: string | null
  price: number | null
}

type Review = {
  id: string
  author: string
  rating: number
  date: string
  title: string
  comment: string
  verified: boolean
  helpful: number
}

type Props = { game: Game; relatedGames: RelatedGame[] }

function formatTaka(paisa: number) {
  return `৳${(paisa / 100).toLocaleString('en-BD')}`
}

export function GameDetailClient({ game, relatedGames }: Props) {
  const { addToCart, setCartOpen } = useCart()
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'specs' | 'reviews'>('overview')
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToast, setAddedToast] = useState(false)
  const [mainImage, setMainImage] = useState(game.imageUrl ?? '')

  // User review state
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      author: 'Tanvir Hossain',
      rating: 5,
      date: 'October 3, 2026',
      title: 'Absolute masterpiece on PS5 Pro!',
      comment:
        'Game runs buttery smooth at locked 60 FPS. The DualSense haptic feedback and adaptive triggers give an unbelievable level of immersion. Delivery in Dhaka took less than 24 hours!',
      verified: true,
      helpful: 14,
    },
    {
      id: 'rev-2',
      author: 'Shahriar Ahmed',
      rating: 5,
      date: 'September 28, 2026',
      title: 'Original sealed disc, top quality packaging',
      comment:
        'Package arrived completely intact with bubble wrap. 100% genuine PlayStation disc. ReiKai Arcade has been my go-to shop for console physical releases.',
      verified: true,
      helpful: 8,
    },
    {
      id: 'rev-3',
      author: 'Rifat Chowdhury',
      rating: 4,
      date: 'September 15, 2026',
      title: 'Incredible graphics & soundtrack',
      comment:
        'Visuals and 3D audio are mind-blowing. Story paced wonderfully. Only minor wish is that more bonus DLC codes were bundled, but Standard Edition is well worth every taka.',
      verified: true,
      helpful: 5,
    },
  ])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReviewAuthor, setNewReviewAuthor] = useState('')
  const [newReviewTitle, setNewReviewTitle] = useState('')
  const [newReviewRating, setNewReviewRating] = useState(5)
  const [newReviewComment, setNewReviewComment] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  const selectedVariant = game.variants[selectedVariantIdx]
  const hasVariants = game.variants.length > 0
  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : false

  const handleAddToCart = (openDrawer = false) => {
    if (!selectedVariant || !inStock) return
    for (let i = 0; i < quantity; i++) {
      addToCart(
        {
          id: selectedVariant.id,
          name: game.name,
          price: selectedVariant.price / 100,
          image: game.imageUrl,
          type: 'game',
        } as any,
        { edition: selectedVariant.title ?? 'Standard', price: selectedVariant.price / 100 }
      )
    }
    setAddedToast(true)
    setTimeout(() => setAddedToast(false), 3000)
    if (openDrawer) {
      setCartOpen(true)
    }
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      title: newReviewTitle.trim() || 'Great title',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
      verified: true,
      helpful: 0,
    }

    setReviews([newRev, ...reviews])
    setNewReviewAuthor('')
    setNewReviewTitle('')
    setNewReviewComment('')
    setShowReviewForm(false)
    setReviewSubmitted(true)
    setTimeout(() => setReviewSubmitted(false), 4000)
  }

  const allImages = Array.from(new Set([game.imageUrl, ...game.galleryImages].filter(Boolean))) as string[]

  const discountPercent =
    selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price
      ? Math.round((1 - selectedVariant.price / selectedVariant.compareAtPrice) * 100)
      : 0

  return (
    <div className="min-h-screen bg-[#08080f] text-slate-100 selection:bg-purple-600 selection:text-white">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link href="/" className="hover:text-purple-400 transition">
            Home
          </Link>
          <ChevronRight size={13} className="text-slate-600" />
          <Link href="/games" className="hover:text-purple-400 transition">
            Games
          </Link>
          {game.category && (
            <>
              <ChevronRight size={13} className="text-slate-600" />
              <span className="text-slate-400">{game.category}</span>
            </>
          )}
          <ChevronRight size={13} className="text-slate-600" />
          <span className="truncate text-purple-300 font-semibold">{game.name}</span>
        </nav>

        {/* ── 2-COLUMN MAIN PRODUCT HERO ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ── LEFT COLUMN: IMAGES & ASSURANCE ──────────────────────────── */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Showcase Card */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl backdrop-blur-sm group">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={game.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-7xl">🎮</div>
              )}

              {/* Top overlay badges */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                {inStock ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/80 px-3 py-1 text-xs font-bold text-emerald-400 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-950/80 px-3 py-1 text-xs font-bold text-rose-400 backdrop-blur-md">
                    Out of Stock
                  </span>
                )}

                {game.platform && (
                  <span className="rounded-full border border-white/15 bg-black/60 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur-md">
                    {game.platform}
                  </span>
                )}
              </div>

              {discountPercent > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="rounded-full border border-purple-500/30 bg-purple-600/90 px-3 py-1 text-xs font-extrabold text-white shadow-lg backdrop-blur-md">
                    {discountPercent}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMainImage(img)}
                    className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      mainImage === img
                        ? 'border-purple-500 shadow-md shadow-purple-500/20 opacity-100 scale-102'
                        : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <Image src={img} alt={`${game.name} preview ${idx + 1}`} fill className="object-cover" sizes="112px" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees & Trust Badges */}
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <Truck className="h-5 w-5 text-purple-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-slate-200 leading-tight">Fast Delivery</p>
                  <p className="text-[11px] text-slate-400">24-48h in BD</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-slate-200 leading-tight">100% Genuine</p>
                  <p className="text-[11px] text-slate-400">Original Physical Disc</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <RotateCcw className="h-5 w-5 text-blue-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-slate-200 leading-tight">7-Day Warranty</p>
                  <p className="text-[11px] text-slate-400">Replacement Guarantee</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <Zap className="h-5 w-5 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-semibold text-slate-200 leading-tight">Easy Payment</p>
                  <p className="text-[11px] text-slate-400">Cash / bKash / Cards</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: DETAILS, VARIANTS, ACTIONS ─────────────────── */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Publisher & Category kicker */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-purple-400">
                {game.brand || 'PlayStation Studios'}
              </span>
              {selectedVariant?.sku && (
                <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                  SKU: {selectedVariant.sku}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
              {game.name}
            </h1>

            {/* Rating & Review quick link */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={
                      i < Math.round(game.rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-white/10 text-white/20'
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-200">
                {(game.rating || 4.9).toFixed(1)}
              </span>
              <span className="text-slate-600">·</span>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2 transition"
              >
                {(game.reviewCount || reviews.length).toLocaleString()} Verified Ratings
              </button>
            </div>

            {/* Price Box */}
            {hasVariants && selectedVariant ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 mb-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {formatTaka(selectedVariant.price * quantity)}
                  </span>
                  {quantity > 1 && (
                    <span className="text-xs text-slate-400 font-mono">
                      ({formatTaka(selectedVariant.price)} each)
                    </span>
                  )}
                  {selectedVariant.compareAtPrice && (
                    <span className="text-base text-slate-500 line-through">
                      {formatTaka(selectedVariant.compareAtPrice * quantity)}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-400">
                      Save {formatTaka((selectedVariant.compareAtPrice! - selectedVariant.price) * quantity)}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Price inclusive of VAT. Free delivery on orders above ৳10,000 across Bangladesh.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 mb-5 text-sm text-slate-400">
                Pricing currently unavailable. Check back soon.
              </div>
            )}

            {/* Short Description */}
            {game.shortDescription && (
              <p className="text-sm leading-relaxed text-slate-300 mb-5">
                {game.shortDescription}
              </p>
            )}

            {/* Edition / Variant Selector */}
            {game.variants.length > 1 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Choose Edition:
                  </span>
                  <span className="text-xs font-semibold text-purple-300">
                    {selectedVariant?.title}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {game.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantIdx(idx)}
                      className={`flex flex-col rounded-xl border p-3 text-left transition-all ${
                        selectedVariantIdx === idx
                          ? 'border-purple-500 bg-purple-950/30 shadow-md shadow-purple-500/10'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{v.title}</span>
                        <span className="text-xs font-bold text-purple-300 font-mono">
                          {formatTaka(v.price)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1">
                        {v.stockQuantity > 0 ? `${v.stockQuantity} copies available` : 'Out of stock'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {inStock && (
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Quantity:
                </span>
                <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.03] p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(selectedVariant?.stockQuantity || 10, q + 1))}
                    disabled={quantity >= (selectedVariant?.stockQuantity || 10)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-xs text-slate-400">
                  ({selectedVariant?.stockQuantity} available)
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-6">
              <button
                type="button"
                disabled={!inStock}
                onClick={() => handleAddToCart(false)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3.5 font-bold text-sm text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ShoppingBag size={18} />
                <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>

              {inStock && (
                <button
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-purple-500/40 bg-purple-950/40 px-6 py-3.5 font-bold text-sm text-purple-200 hover:bg-purple-900/50 hover:border-purple-400 active:scale-[0.98] transition-all"
                >
                  <Sparkles size={16} className="text-purple-400" />
                  <span>Buy Now</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setWishlisted(!wishlisted)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`flex h-12 w-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border transition-all ${
                  wishlisted
                    ? 'border-pink-500/50 bg-pink-950/40 text-pink-400'
                    : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <Heart size={20} className={wishlisted ? 'fill-pink-500' : ''} />
              </button>
            </div>

            {/* Added Notice Toast */}
            {addedToast && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/60 p-3 text-xs font-semibold text-emerald-300 animate-in fade-in slide-in-from-top-2 duration-200">
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span>Added {quantity} copy to your shopping bag!</span>
              </div>
            )}

            {/* Quick Specs Chips */}
            {game.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-white/10">
                <span className="text-xs text-slate-400 mr-1 font-mono">Tags:</span>
                {game.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-xs text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── TABBED DEEP DIVE SECTION ───────────────────────────────────── */}
        <section className="mt-14 border-t border-white/10 pt-10">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-px overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`border-b-2 px-5 py-3 text-sm font-bold transition-all ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Overview &amp; Story
            </button>
            {game.features.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('features')}
                className={`border-b-2 px-5 py-3 text-sm font-bold transition-all ${
                  activeTab === 'features'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Key Features ({game.features.length})
              </button>
            )}
            {Object.keys(game.specs).length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`border-b-2 px-5 py-3 text-sm font-bold transition-all ${
                  activeTab === 'specs'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Specifications
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`border-b-2 px-5 py-3 text-sm font-bold transition-all ${
                activeTab === 'reviews'
                  ? 'border-purple-500 text-purple-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {/* ── TAB 1: OVERVIEW ── */}
            {activeTab === 'overview' && (
              <div className="max-w-4xl space-y-5 text-slate-300 leading-relaxed text-sm sm:text-base">
                {game.description ? (
                  game.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-slate-400">
                    No detailed description provided for this software release.
                  </p>
                )}
              </div>
            )}

            {/* ── TAB 2: KEY FEATURES ── */}
            {activeTab === 'features' && game.features.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
                {game.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-purple-500/30 transition"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/30 font-mono text-xs font-bold text-purple-300">
                      0{idx + 1}
                    </span>
                    <p className="text-sm text-slate-200 leading-relaxed pt-0.5">{feat}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── TAB 3: SPECIFICATIONS ── */}
            {activeTab === 'specs' && Object.keys(game.specs).length > 0 && (
              <div className="max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {Object.entries(game.specs).map(([key, val], idx) => (
                      <tr
                        key={key}
                        className={`border-b border-white/5 ${
                          idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]'
                        }`}
                      >
                        <th className="py-3.5 px-5 font-medium text-slate-400 w-1/3 text-xs uppercase tracking-wider font-mono">
                          {key}
                        </th>
                        <td className="py-3.5 px-5 text-white font-medium">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── TAB 4: RATINGS & REVIEWS ── */}
            {activeTab === 'reviews' && (
              <div className="max-w-4xl space-y-8">
                {/* Score Summary Box */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 items-center">
                  <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                    <div className="text-5xl font-black text-white">
                      {(game.rating || 4.9).toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-1 my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400">
                      Based on {reviews.length} verified customer reviews
                    </p>
                  </div>

                  <div className="md:col-span-5 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>5★</span>
                      <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '85%' }} />
                      </div>
                      <span>85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>4★</span>
                      <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '12%' }} />
                      </div>
                      <span>12%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>3★</span>
                      <div className="h-2 flex-1 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '3%' }} />
                      </div>
                      <span>3%</span>
                    </div>
                  </div>

                  <div className="md:col-span-3 text-center md:text-right">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="rounded-xl border border-purple-500/40 bg-purple-950/30 px-4 py-2.5 text-xs font-bold text-purple-300 hover:bg-purple-900/40 transition"
                    >
                      {showReviewForm ? 'Close Form' : 'Write a Review'}
                    </button>
                  </div>
                </div>

                {reviewSubmitted && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/60 p-4 text-xs font-semibold text-emerald-300 flex items-center gap-2">
                    <Check size={16} className="text-emerald-400" />
                    <span>Thank you! Your verified review has been published.</span>
                  </div>
                )}

                {/* Write a Review Form */}
                {showReviewForm && (
                  <form
                    onSubmit={handleReviewSubmit}
                    className="rounded-2xl border border-purple-500/20 bg-purple-950/20 p-6 space-y-4"
                  >
                    <h3 className="text-base font-bold text-white">Share Your Experience</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          placeholder="e.g. Arifur Rahman"
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-sm text-white placeholder:text-slate-600 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Review Headline
                        </label>
                        <input
                          type="text"
                          value={newReviewTitle}
                          onChange={(e) => setNewReviewTitle(e.target.value)}
                          placeholder="e.g. Masterpiece on PS5"
                          className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-sm text-white placeholder:text-slate-600 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Rating Star Score
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="p-1 hover:scale-110 transition"
                          >
                            <Star
                              size={20}
                              className={
                                star <= newReviewRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-600'
                              }
                            />
                          </button>
                        ))}
                        <span className="text-xs text-slate-400 ml-2">({newReviewRating} / 5)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Detailed Review *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        placeholder="Tell fellow gamers about the gameplay, performance, delivery, etc."
                        className="w-full rounded-xl border border-white/10 bg-black/40 p-3.5 text-sm text-white placeholder:text-slate-600 focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-purple-600 text-xs font-bold text-white hover:bg-purple-500 transition"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600/20 border border-purple-500/30 font-bold text-xs text-purple-300">
                            {rev.author.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{rev.author}</span>
                              {rev.verified && (
                                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                                  <Check size={10} /> Verified Buyer
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500">{rev.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-white/10'
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-slate-200">{rev.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{rev.comment}</p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                        <button
                          type="button"
                          className="flex items-center gap-1 hover:text-purple-400 transition"
                        >
                          <ThumbsUp size={12} />
                          Helpful ({rev.helpful})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── SIMILAR / RELATED GAMES SECTION ────────────────────────────── */}
        {relatedGames.length > 0 && (
          <section className="mt-14 border-t border-white/10 pt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-purple-400 mb-1">
                  Expand Your Vault
                </p>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  More PS5 Titles You May Like
                </h2>
              </div>
              <Link
                href="/games"
                className="flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition"
              >
                <span>Browse All</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedGames.map((item) => (
                <Link
                  key={item.id}
                  href={`/games/${item.slug}`}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-purple-500/40 hover:bg-white/[0.05] transition-all"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl">🎮</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-3">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block mb-1">
                        {item.category || item.platform || 'Game'}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-purple-300 transition leading-snug">
                        {item.name}
                      </h4>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-white font-mono">
                        {item.price ? formatTaka(item.price) : 'See Details'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
