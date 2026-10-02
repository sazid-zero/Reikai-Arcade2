'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useCart } from '@/components/cart-context'
import {
  Search, ShoppingCart, LayoutGrid, List, SlidersHorizontal, X, ChevronDown, Check,
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
      <Link href={`/games/${game.slug}`} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/20 hover:bg-white/[0.05] transition-all group">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white/5">
          {game.imageUrl ? <Image src={game.imageUrl} alt={game.name} fill className="object-cover" sizes="96px" /> : <span className="flex h-full items-center justify-center text-3xl">🎮</span>}
        </div>
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <p className="font-bold truncate group-hover:text-primary transition">{game.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{game.shortDescription}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {game.tags.slice(0, 3).map((t) => <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>)}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {lowestVariant ? <span className="font-bold text-primary">{formatTaka(lowestVariant.price)}</span> : <span className="text-muted-foreground text-sm">No price</span>}
            {inStock ? (
              <button onClick={handleAdd} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition">
                Add to Cart
              </button>
            ) : (
              <span className="text-xs text-red-400">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/games/${game.slug}`} className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-white/20 hover:bg-white/[0.05] transition-all">
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        {game.imageUrl ? (
          <Image src={game.imageUrl} alt={game.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 33vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">🎮</div>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="rounded-full bg-red-500/20 border border-red-500/30 px-3 py-1 text-xs font-bold text-red-400">OUT OF STOCK</span>
          </div>
        )}
        {game.featured && (
          <div className="absolute top-2 left-2 rounded-full bg-primary/20 border border-primary/30 px-2.5 py-0.5 text-xs font-bold text-primary">FEATURED</div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1">
          {game.tags.slice(0, 2).map((t) => <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground uppercase tracking-wider">{t}</span>)}
        </div>
        <h3 className="font-bold line-clamp-1 group-hover:text-primary transition">{game.name}</h3>
        {game.platform && <p className="text-xs text-muted-foreground">{game.platform}</p>}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/5">
          {lowestVariant ? (
            <div>
              <span className="font-bold text-primary">{formatTaka(lowestVariant.price)}</span>
              {lowestVariant.compareAtPrice && <span className="ml-2 text-xs text-muted-foreground line-through">{formatTaka(lowestVariant.compareAtPrice)}</span>}
            </div>
          ) : <span className="text-muted-foreground text-sm">No price</span>}
          {inStock && (
            <button onClick={handleAdd} className="rounded-xl bg-primary/10 border border-primary/30 p-2 text-primary hover:bg-primary/20 transition">
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Derive unique platform and category values from DB products
  const platforms = useMemo(() => {
    const set = new Set<string>()
    games.forEach((g) => { if (g.platform) g.platform.split(',').map((p) => p.trim()).forEach((p) => set.add(p)) })
    return Array.from(set).sort()
  }, [games])

  const categories = useMemo(() => {
    const set = new Set<string>()
    games.forEach((g) => { if (g.category) set.add(g.category) })
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
      // featured: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.sortOrder - b.sortOrder
    })
  }, [games, searchQuery, selectedPlatform, selectedCategory, sortBy])

  return (
    <div className="site-shell noise">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-8 md:px-10">
        {/* Page Header */}
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-2">Software Catalog</p>
          <h1 className="text-4xl font-bold md:text-5xl">Games</h1>
          <p className="mt-2 text-muted-foreground">{games.length} title{games.length !== 1 ? 's' : ''} available</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          {/* Platform filter */}
          <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50">
            <option value="all">All Platforms</option>
            {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* Category filter */}
          {categories.length > 0 && (
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50">
              <option value="all">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          )}

          {/* Sort */}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50">
            <option value="featured">Featured First</option>
            <option value="name">Name A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          <div className="flex gap-1 rounded-xl border border-white/10 p-1">
            <button onClick={() => setViewMode('grid')} className={`rounded-lg p-1.5 transition ${viewMode === 'grid' ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode('list')} className={`rounded-lg p-1.5 transition ${viewMode === 'list' ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Results */}
        {filteredGames.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-2xl mb-3">🎮</p>
            <p className="text-muted-foreground">
              {games.length === 0 ? 'No games in the catalog yet. Check back soon!' : 'No games match your filters.'}
            </p>
            {searchQuery || selectedPlatform !== 'all' || selectedCategory !== 'all' ? (
              <button onClick={() => { setSearchQuery(''); setSelectedPlatform('all'); setSelectedCategory('all') }} className="mt-4 text-sm text-primary hover:underline">
                Clear filters
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
