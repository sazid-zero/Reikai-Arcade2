'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Search, ChevronRight } from 'lucide-react'

export type TopUpProduct = {
  id: string
  slug: string
  name: string
  imageUrl: string | null
  brand: string | null
  platform: string | null
  category: string | null
  shortDescription: string | null
  featured: boolean
  sortOrder: number
  minPrice: number | null
  maxPrice: number | null
}

function formatBDT(paisa: number) {
  return `৳${Math.round(paisa / 100).toLocaleString('en-BD')}`
}

export default function TopUpClient({ products }: { products: TopUpProduct[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set).sort()
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        if (!p.name.toLowerCase().includes(q) && !p.shortDescription?.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [products, searchQuery, selectedCategory])

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
            <span className="text-white/80 font-semibold">Game Top-Up</span>
          </nav>
          <span className="font-mono text-[11px] text-[#00f0ff]">{filtered.length} games</span>
        </div>

        {/* Responsive Compact Filter Bar */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Search games, PUBG, Valorant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-xs sm:text-sm placeholder:text-white/40 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50 transition"
            />
          </div>

          {/* Category filter */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-9 rounded-xl border border-white/10 bg-[#0d0822] px-3 text-xs text-white focus:outline-none focus:border-[#00f0ff]"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Results: 2 columns on phone, multi-column wrap on PC */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-white/5 bg-[#0d0822]/40 backdrop-blur-xl p-8">
            <p className="text-4xl mb-3">⚡</p>
            <p className="text-white/60">
              {products.length === 0 ? 'No top-up products in the catalog yet.' : 'No top-up products match your search.'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#00f0ff] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/top-up/${product.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-[#00f0ff]/50 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(0,240,255,0.2)] hover:-translate-y-1"
              >
                {/* Banner Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/5">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl sm:text-5xl opacity-30">🎮</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#06020e] via-[#06020e]/60 to-transparent" />
                  {product.featured && (
                    <span className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-[#a855f7] to-[#00f0ff] px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white shadow-[0_0_12px_rgba(0,240,255,0.5)]">
                      Featured
                    </span>
                  )}
                </div>

                {/* Price strip */}
                <div className="p-2.5 sm:p-3.5">
                  <p className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-1 sm:line-clamp-2 group-hover:text-[#00f0ff] transition-colors">
                    {product.name}
                  </p>
                  {(product.minPrice !== null || product.maxPrice !== null) && (
                    <p className="mt-1 font-mono text-[11px] sm:text-xs font-semibold text-[#00f0ff]">
                      {product.minPrice !== null ? formatBDT(product.minPrice) : ''}
                      {product.minPrice !== product.maxPrice && product.maxPrice !== null
                        ? ` - ${formatBDT(product.maxPrice)}`
                        : ''}{' '}
                      <span className="text-white/40 text-[9px] sm:text-[10px]">BDT</span>
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
