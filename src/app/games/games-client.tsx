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
  Gamepad2,
  Sparkles,
  Zap,
  ShieldCheck,
  Disc,
  ArrowRight,
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
  sortOrder: number
  variants: Variant[]
}

function formatTaka(paisa?: number | null) {
  if (paisa == null) return '৳0'
  return `৳${(paisa / 100).toLocaleString('en-BD')}`
}

function GameCard({ game, viewMode }: { game: Game; viewMode: 'grid' | 'list' }) {
  const { addToCart } = useCart()
  const lowestVariant = game.variants[0]
  const inStock = lowestVariant ? (lowestVariant.stockQuantity ?? 0) > 0 : false

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!lowestVariant || !lowestVariant.id || !inStock) return
    const priceInPaisa = lowestVariant.price ?? 0
    addToCart(
      { id: lowestVariant.id, name: game.name, price: priceInPaisa / 100, image: game.imageUrl, type: 'game' } as any,
      { edition: lowestVariant.title ?? 'Standard', price: priceInPaisa / 100 }
    )
  }

  if (viewMode === 'list') {
    return (
      <Link
        href={`/games/${game.slug}`}
        className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_12px_36px_rgba(0,0,0,0.8),0_0_24px_rgba(160,228,241,0.2)] group"
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white/5 border border-white/10 group-hover:border-white/15 transition">
          {game.imageUrl ? (
            <Image src={game.imageUrl} alt={game.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="96px" />
          ) : (
            <span className="flex h-full items-center justify-center text-3xl">🎮</span>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <p className="font-bold text-white truncate group-hover:text-white transition">{game.name}</p>
            <p className="mt-0.5 text-xs text-white/50 line-clamp-2">{game.shortDescription}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {game.tags.slice(0, 3).map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {lowestVariant ? (
              <span className="font-mono font-black text-sm text-[#a0e4f1] drop-shadow-lg">
                {formatTaka(lowestVariant.price)}
              </span>
            ) : (
              <span className="text-white/40 text-sm">No price</span>
            )}
            {inStock ? (
              <button
                onClick={handleAdd}
                className="rounded-lg bg-gradient-to-r from-[#4b22d2] via-[#c673e2] to-[#a0e4f1] px-3.5 py-1.5 text-xs font-bold text-white shadow-lg hover:shadow-lg transition"
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
      href={`/games/${game.slug}`}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_12px_36px_rgba(0,0,0,0.8),0_0_24px_rgba(160,228,241,0.2)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        {game.imageUrl ? (
          <Image
            src={game.imageUrl}
            alt={game.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl sm:text-5xl">🎮</div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
            <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-rose-300">
              OUT OF STOCK
            </span>
          </div>
        )}
        {game.featured && (
          <div className="absolute top-2 left-2 rounded-full bg-[#a0e4f1]/20 border border-[#a0e4f1]/40 px-2 py-0.5 text-[9px] sm:text-[11px] font-bold text-[#a0e4f1] backdrop-blur-md shadow-lg">
            FEATURED
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 sm:gap-2 p-2.5 sm:p-4 flex-1 justify-between">
        <div>
          <div className="hidden sm:flex flex-wrap gap-1">
            {game.tags.slice(0, 2).map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/50 uppercase tracking-wider font-mono">
                {t}
              </span>
            ))}
          </div>
          <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1 sm:line-clamp-2 group-hover:text-white transition mt-0.5">{game.name}</h3>
          {game.platform && <p className="text-[10px] sm:text-xs text-white/40 truncate">{game.platform}</p>}
        </div>
        <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-white/5">
          {lowestVariant ? (
            <div className="min-w-0">
              <span className="font-mono font-black text-xs sm:text-sm text-[#a0e4f1] drop-shadow-lg">
                {formatTaka(lowestVariant.price)}
              </span>
              {lowestVariant.compareAtPrice && (
                <span className="ml-1.5 text-[10px] sm:text-xs text-white/40 line-through">
                  {formatTaka(lowestVariant.compareAtPrice)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-white/40 text-xs">No price</span>
          )}
          {inStock && (
            <button
              onClick={handleAdd}
              className="rounded-xl border border-[#a0e4f1]/40 bg-[#a0e4f1]/10 p-1.5 sm:p-2 text-[#a0e4f1] hover:bg-gradient-to-r hover:from-[#4b22d2] hover:to-[#a0e4f1] hover:text-white hover:border-transparent transition shadow-lg shrink-0 ml-1 cursor-pointer"
              aria-label="Add game to bag"
            >
              <ShoppingCart size={14} />
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function GamesPageClient({ games }: { games: Game[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const platforms = useMemo(() => {
    const set = new Set<string>()
    games.forEach((g) => {
      if (g.platform) g.platform.split(',').map((p) => p.trim()).forEach((p) => set.add(p))
    })
    return Array.from(set).sort()
  }, [games])

  const categories = useMemo(() => {
    const set = new Set<string>()
    games.forEach((g) => {
      if (g.category) set.add(g.category)
    })
    return Array.from(set).sort()
  }, [games])

  const filteredGames = useMemo(() => {
    let result = games.filter((game) => {
      if (selectedPlatform !== 'all' && !game.platform?.toLowerCase().includes(selectedPlatform.toLowerCase())) return false
      if (selectedCategory !== 'all' && game.category !== selectedCategory) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        if (!game.name.toLowerCase().includes(q) && !game.shortDescription?.toLowerCase().includes(q) && !game.tags.some((t) => t.toLowerCase().includes(q))) return false
      }
      return true
    })

    return result.sort((a, b) => {
      if (sortBy === 'price-low') return (a.variants[0]?.price ?? Infinity) - (b.variants[0]?.price ?? Infinity)
      if (sortBy === 'price-high') return (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0)
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.sortOrder - b.sortOrder
    })
  }, [games, searchQuery, selectedPlatform, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-[#000000] text-[#f4f2ff]">
      <SiteHeader />

      {/* Main Catalog - Starts directly with filters & items */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-16">
        {/* Compact Breadcrumb & count */}
        <div className="mb-3 flex items-center justify-between text-xs text-white/50">
          <nav className="flex items-center gap-1.5">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/80 font-semibold">Games</span>
          </nav>
          <span className="font-mono text-[11px] text-[#a0e4f1]">{filteredGames.length} games</span>
        </div>

        {/* Responsive Compact Filter Bar */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-xs sm:text-sm placeholder:text-white/40 focus:outline-none focus:border-[#a0e4f1] focus:ring-1 focus:ring-[#a0e4f1]/50 transition"
            />
          </div>

          {/* Filters & Sort */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="h-9 rounded-xl border border-white/10 bg-black/90 px-2.5 text-xs text-white focus:outline-none focus:border-[#a0e4f1]"
            >
              <option value="all">All Platforms</option>
              {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>

            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 rounded-xl border border-white/10 bg-black/90 px-2.5 text-xs text-white focus:outline-none focus:border-[#a0e4f1]"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="col-span-2 sm:col-span-1 h-9 rounded-xl border border-white/10 bg-black/90 px-2.5 text-xs text-white focus:outline-none focus:border-[#a0e4f1]"
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
                className={`rounded-lg p-1.5 transition ${viewMode === 'grid' ? 'bg-[#a0e4f1]/20 text-[#a0e4f1]' : 'text-white/40 hover:text-white'}`}
                aria-label="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-1.5 transition ${viewMode === 'list' ? 'bg-[#a0e4f1]/20 text-[#a0e4f1]' : 'text-white/40 hover:text-white'}`}
                aria-label="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Results: 2 columns on phone, multi-column wrap on PC */}
        {filteredGames.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl p-8">
            <p className="text-4xl mb-3">🎮</p>
            <p className="text-white/60">
              {games.length === 0 ? 'No games in the catalog yet. Check back soon!' : 'No games match your filters.'}
            </p>
            {searchQuery || selectedPlatform !== 'all' || selectedCategory !== 'all' ? (
              <button
                onClick={() => { setSearchQuery(''); setSelectedPlatform('all'); setSelectedCategory('all') }}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#a0e4f1] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'flex flex-col gap-3'}>
            {filteredGames.map((game) => <GameCard key={game.id} game={game} viewMode={viewMode} />)}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}

