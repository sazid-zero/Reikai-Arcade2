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
        className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-300 hover:border-[#00f0ff]/50 hover:bg-white/[0.06] hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(0,240,255,0.2)] group"
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white/5 border border-white/10 group-hover:border-[#00f0ff]/40 transition">
          {game.imageUrl ? (
            <Image src={game.imageUrl} alt={game.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="96px" />
          ) : (
            <span className="flex h-full items-center justify-center text-3xl">🎮</span>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <p className="font-bold text-white truncate group-hover:text-[#00f0ff] transition">{game.name}</p>
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
              <span className="font-mono font-black text-sm text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                {formatTaka(lowestVariant.price)}
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
      href={`/games/${game.slug}`}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-[#00f0ff]/50 hover:bg-white/[0.06] hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(0,240,255,0.2)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        {game.imageUrl ? (
          <Image
            src={game.imageUrl}
            alt={game.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">🎮</div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-xs">
            <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-xs font-bold text-rose-300">
              OUT OF STOCK
            </span>
          </div>
        )}
        {game.featured && (
          <div className="absolute top-2.5 left-2.5 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff]/40 px-2.5 py-0.5 text-[11px] font-bold text-[#00f0ff] backdrop-blur-md shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            FEATURED
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1">
          {game.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/50 uppercase tracking-wider font-mono">
              {t}
            </span>
          ))}
        </div>
        <h3 className="font-bold text-white line-clamp-1 group-hover:text-[#00f0ff] transition">{game.name}</h3>
        {game.platform && <p className="text-xs text-white/40">{game.platform}</p>}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/5">
          {lowestVariant ? (
            <div>
              <span className="font-mono font-black text-sm text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                {formatTaka(lowestVariant.price)}
              </span>
              {lowestVariant.compareAtPrice && (
                <span className="ml-2 text-xs text-white/40 line-through">
                  {formatTaka(lowestVariant.compareAtPrice)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-white/40 text-sm">No price</span>
          )}
          {inStock && (
            <button
              onClick={handleAdd}
              className="rounded-xl border border-[#00f0ff]/40 bg-[#00f0ff]/10 p-2 text-[#00f0ff] hover:bg-gradient-to-r hover:from-[#a855f7] hover:to-[#00f0ff] hover:text-white hover:border-transparent transition shadow-[0_0_12px_rgba(0,240,255,0.2)]"
              aria-label="Add game to bag"
            >
              <ShoppingCart size={15} />
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
    <div className="min-h-screen bg-[#06020e] text-[#f4f2ff]">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/5 bg-[#06020e] px-4 pb-14 pt-16 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_75%_25%,rgba(168,85,247,0.24),transparent_70%),radial-gradient(ellipse_60%_45%_at_20%_70%,rgba(0,240,255,0.18),transparent_65%),radial-gradient(circle_at_50%_40%,rgba(236,72,153,0.1),transparent_55%)]" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/40">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">Games</span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#00f0ff] shadow-[0_0_16px_rgba(0,240,255,0.25)]">
            <Gamepad2 className="h-3.5 w-3.5 text-[#00f0ff]" /> PlayStation 5 Software Catalog
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Legendary Titles.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#00f0ff] drop-shadow-[0_0_25px_rgba(0,240,255,0.3)]">
              Pure Next-Gen Power.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-white/60 leading-relaxed sm:text-base">
            Original factory sealed PS5 physical discs, digital vouchers, and collector editions. Sourced directly from official publishers with instant Dhaka dispatch.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: Disc, text: '100% Genuine Discs' },
              { icon: Zap, text: 'Same Day Dispatch' },
              { icon: ShieldCheck, text: '7-Day Replacement' },
              { icon: Sparkles, text: 'Exclusive Steelbooks' },
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md"
              >
                <Icon className="h-3.5 w-3.5 text-[#00f0ff]" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <main className="mx-auto max-w-7xl px-5 py-8 md:px-10">
        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50 transition"
            />
          </div>

          {/* Platform filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0d0822] px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50"
          >
            <option value="all">All Platforms</option>
            {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* Category filter */}
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0d0822] px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          )}

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#0d0822] px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50"
          >
            <option value="featured">Featured First</option>
            <option value="name">Name A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          <div className="flex gap-1 rounded-xl border border-white/10 p-1 bg-white/[0.03]">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-1.5 transition ${viewMode === 'grid' ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 'text-white/40 hover:text-white'}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-1.5 transition ${viewMode === 'list' ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 'text-white/40 hover:text-white'}`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Results */}
        {filteredGames.length === 0 ? (
          <div className="py-24 text-center rounded-3xl border border-white/5 bg-[#0d0822]/40 backdrop-blur-xl p-8">
            <p className="text-4xl mb-3">🎮</p>
            <p className="text-white/60">
              {games.length === 0 ? 'No games in the catalog yet. Check back soon!' : 'No games match your filters.'}
            </p>
            {searchQuery || selectedPlatform !== 'all' || selectedCategory !== 'all' ? (
              <button
                onClick={() => { setSearchQuery(''); setSelectedPlatform('all'); setSelectedCategory('all') }}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#00f0ff] hover:underline"
              >
                Clear all filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'flex flex-col gap-3'}>
            {filteredGames.map((game) => <GameCard key={game.id} game={game} viewMode={viewMode} />)}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}

