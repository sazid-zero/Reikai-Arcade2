'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Search, ChevronRight, Crown } from 'lucide-react'

export type SubscriptionProduct = {
  id: string
  slug: string
  name: string
  imageUrl: string | null
  brand: string | null
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

export default function SubscriptionsClient({ products }: { products: SubscriptionProduct[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('all')

  const brands = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.brand) set.add(p.brand)
    })
    return Array.from(set).sort()
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        if (!p.name.toLowerCase().includes(q) && !p.shortDescription?.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [products, searchQuery, selectedBrand])

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
            <span className="text-white/80 font-semibold">Subscriptions</span>
          </nav>
          <span className="font-mono text-[11px] text-[#a0e4f1]">{filtered.length} plans</span>
        </div>

        {/* Responsive Compact Filter Bar */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Search PS Plus, Game Pass, EA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-xs sm:text-sm placeholder:text-white/40 focus:outline-none focus:border-[#a0e4f1] focus:ring-1 focus:ring-[#a0e4f1]/50 transition"
            />
          </div>

          {/* Brand filter */}
          {brands.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="h-9 rounded-xl border border-white/10 bg-black/90 px-3 text-xs text-white focus:outline-none focus:border-[#a0e4f1]"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Results: 2 columns on phone, multi-column wrap on PC */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl p-8">
            <p className="text-4xl mb-3">👑</p>
            <p className="text-white/60">
              {products.length === 0 ? 'No subscription products in the catalog yet.' : 'No subscriptions match your search.'}
            </p>
            {(searchQuery || selectedBrand !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedBrand('all'); }}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#a0e4f1] hover:underline cursor-pointer"
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
                href={`/subscriptions/${product.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-[#a0e4f1]/50 hover:shadow-[0_12px_36px_rgba(0,0,0,0.8),0_0_24px_rgba(160,228,241,0.2)] hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-black/60">
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
                      <Crown className="h-8 w-8 text-[#a0e4f1]/40 transition-colors group-hover:text-[#a0e4f1]" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  {product.featured && (
                    <span className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-[#4b22d2] via-[#c673e2] to-[#a0e4f1] px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white shadow-[0_0_12px_rgba(160,228,241,0.4)]">
                      Featured
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-2.5 sm:p-3.5">
                  <p className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-1 sm:line-clamp-2 group-hover:text-[#a0e4f1] transition-colors">
                    {product.name}
                  </p>
                  {product.brand && (
                    <p className="mt-0.5 text-[10px] sm:text-[11px] font-semibold text-white/50">{product.brand}</p>
                  )}
                  {(product.minPrice !== null || product.maxPrice !== null) && (
                    <p className="mt-1 font-mono text-[11px] sm:text-xs font-semibold text-[#a0e4f1]">
                      {product.minPrice !== null ? formatBDT(product.minPrice) : ''}
                      {product.minPrice !== product.maxPrice && product.maxPrice !== null
                        ? ` – ${formatBDT(product.maxPrice)}`
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
