'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useCart } from '@/components/cart-context'
import {
  Search,
  ShoppingCart,
  LayoutGrid,
  List,
  Headphones,
  Sparkles,
  Zap,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
} from 'lucide-react'

type Variant = {
  id: string | null
  title: string | null
  sku: string | null
  price: number | null
  compareAtPrice: number | null
  stockQuantity: number | null
}

type Accessory = {
  id: string
  slug: string
  name: string
  type: string
  shortDescription: string | null
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
  sortOrder: number
  variants: Variant[]
}

function formatTaka(paisa: number) {
  return `৳${(paisa / 100).toLocaleString('en-BD')}`
}

function AccessoryCard({ item, viewMode }: { item: Accessory; viewMode: 'grid' | 'list' }) {
  const { addToCart } = useCart()
  const firstVariant = item.variants.find((v) => v.id && v.price !== null)
  const inStock = firstVariant ? (firstVariant.stockQuantity ?? 0) > 0 : false

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!firstVariant?.id || !inStock) return
    addToCart(
      { id: firstVariant.id, name: item.name, price: firstVariant.price! / 100, image: item.imageUrl, type: 'accessory' } as any,
      { edition: firstVariant.title ?? 'Standard', price: firstVariant.price! / 100 }
    )
  }

  if (viewMode === 'list') {
    return (
      <Link
        href={`/accessories/${item.slug}`}
        className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-300 hover:border-[#00f0ff]/50 hover:bg-white/[0.06] hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(0,240,255,0.2)] group"
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white/5 border border-white/10 group-hover:border-[#00f0ff]/40 transition">
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="96px" />
          ) : (
            <span className="flex h-full items-center justify-center text-3xl">🎧</span>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <p className="font-bold text-white truncate group-hover:text-[#00f0ff] transition">{item.name}</p>
            <p className="text-xs text-purple-300/80 font-mono mt-0.5">{item.brand}</p>
            <p className="text-xs text-white/50 line-clamp-1 mt-0.5">{item.shortDescription}</p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {firstVariant?.price != null ? (
              <span className="font-mono font-black text-sm text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                {formatTaka(firstVariant.price)}
              </span>
            ) : (
              <span className="text-white/40 text-sm">No price</span>
            )}
            {inStock ? (
              <button
                onClick={handleAdd}
                className="rounded-lg bg-gradient-to-r from-[#a855f7] to-[#00f0ff] px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_0_16px_rgba(0,240,255,0.35)] hover:shadow-[0_0_22px_rgba(0,240,255,0.5)] transition"
              >
                Add to Cart
              </button>
            ) : (
              <span className="text-xs font-semibold text-rose-400">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/accessories/${item.slug}`}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-[#00f0ff]/50 hover:bg-white/[0.06] hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(0,240,255,0.2)]"
    >
      <div className="relative aspect-square overflow-hidden bg-white/5">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl sm:text-5xl">🎧</div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
            <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-rose-300">
              OUT OF STOCK
            </span>
          </div>
        )}
        {item.featured && (
          <div className="absolute top-2 left-2 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff]/40 px-2 py-0.5 text-[9px] sm:text-[11px] font-bold text-[#00f0ff] backdrop-blur-md shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            FEATURED
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 sm:gap-2 p-2.5 sm:p-4 flex-1 justify-between">
        <div>
          {item.brand && (
            <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-purple-300/80">{item.brand}</p>
          )}
          <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-2 group-hover:text-[#00f0ff] transition mt-0.5">{item.name}</h3>
          <div className="hidden sm:flex flex-wrap gap-1 mt-1.5">
            {item.tags.slice(0, 2).map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/50 font-mono">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-white/5">
          {firstVariant?.price != null ? (
            <div className="min-w-0">
              <span className="font-mono font-black text-xs sm:text-sm text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                {formatTaka(firstVariant.price)}
              </span>
              {firstVariant.compareAtPrice && (
                <span className="ml-1.5 text-[10px] sm:text-xs text-white/40 line-through">
                  {formatTaka(firstVariant.compareAtPrice)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-white/40 text-xs">No price</span>
          )}
          {inStock && (
            <button
              onClick={handleAdd}
              className="rounded-xl border border-[#00f0ff]/40 bg-[#00f0ff]/10 p-1.5 sm:p-2 text-[#00f0ff] hover:bg-gradient-to-r hover:from-[#a855f7] hover:to-[#00f0ff] hover:text-white hover:border-transparent transition shadow-[0_0_12px_rgba(0,240,255,0.2)] shrink-0 ml-1 cursor-pointer"
              aria-label="Add accessory to bag"
            >
              <ShoppingCart size={14} />
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function AccessoriesPageClient({ accessories }: { accessories: Accessory[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const brands = useMemo(() => {
    const set = new Set<string>()
    accessories.forEach((a) => {
      if (a.brand) set.add(a.brand)
    })
    return Array.from(set).sort()
  }, [accessories])

  const categories = useMemo(() => {
    const set = new Set<string>()
    accessories.forEach((a) => {
      if (a.category) set.add(a.category)
    })
    return Array.from(set).sort()
  }, [accessories])

  const filtered = useMemo(() => {
    let result = accessories.filter((a) => {
      if (selectedBrand !== 'all' && a.brand !== selectedBrand) return false
      if (selectedCategory !== 'all' && a.category !== selectedCategory) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        if (!a.name.toLowerCase().includes(q) && !a.shortDescription?.toLowerCase().includes(q) && !a.tags.some((t) => t.toLowerCase().includes(q))) return false
      }
      return true
    })
    return result.sort((a, b) => {
      if (sortBy === 'price-low') return (a.variants.find((v) => v.price != null)?.price ?? Infinity) - (b.variants.find((v) => v.price != null)?.price ?? Infinity)
      if (sortBy === 'price-high') return (b.variants.find((v) => v.price != null)?.price ?? 0) - (a.variants.find((v) => v.price != null)?.price ?? 0)
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.sortOrder - b.sortOrder
    })
  }, [accessories, searchQuery, selectedBrand, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-[#06020e] text-[#f4f2ff]">
      <SiteHeader />

      {/* Main Catalog - Starts directly with filters & items */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-16">
        {/* Compact Breadcrumb & count */}
        <div className="mb-3 flex items-center justify-between text-xs text-white/50">
          <nav className="flex items-center gap-1.5">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/80 font-semibold">Accessories</span>
          </nav>
          <span className="font-mono text-[11px] text-[#00f0ff]">{filtered.length} items</span>
        </div>

        {/* Responsive Compact Filter Bar */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Search accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-xs sm:text-sm placeholder:text-white/40 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50 transition"
            />
          </div>

          {/* Filter dropdowns & Sort - nicely arranged on phone */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            {brands.length > 0 && (
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="h-9 rounded-xl border border-white/10 bg-[#0d0822] px-2.5 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            )}

            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 rounded-xl border border-white/10 bg-[#0d0822] px-2.5 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="col-span-2 sm:col-span-1 h-9 rounded-xl border border-white/10 bg-[#0d0822] px-2.5 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
            >
              <option value="featured">Featured First</option>
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <div className="hidden sm:flex gap-1 rounded-xl border border-white/10 p-0.5 bg-white/[0.03] h-9 items-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-1.5 transition ${viewMode === 'grid' ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 'text-white/40 hover:text-white'}`}
                aria-label="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-1.5 transition ${viewMode === 'list' ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 'text-white/40 hover:text-white'}`}
                aria-label="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Results: 2 columns on phone, multi-column wrap on PC */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-white/5 bg-[#0d0822]/40 backdrop-blur-xl p-8">
            <p className="text-4xl mb-3">🎧</p>
            <p className="text-white/60">
              {accessories.length === 0 ? 'No accessories in the catalog yet.' : 'No accessories match your filters.'}
            </p>
            {(searchQuery || selectedBrand !== 'all' || selectedCategory !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedBrand('all'); setSelectedCategory('all') }}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#00f0ff] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'flex flex-col gap-3'}>
            {filtered.map((a) => <AccessoryCard key={a.id} item={a} viewMode={viewMode} />)}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}

