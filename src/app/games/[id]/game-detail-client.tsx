'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useCart } from '@/components/cart-context'
import {
  ArrowRight, Check, ChevronRight, ShoppingBag, Star, Heart,
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

type Props = { game: Game; relatedGames: RelatedGame[] }

function formatTaka(paisa: number) {
  return `৳${(paisa / 100).toLocaleString('en-BD')}`
}

function StockBadge({ qty }: { qty: number }) {
  if (qty === 0) return <span className="stock-pill" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>⬤ OUT OF STOCK</span>
  if (qty <= 5) return <span className="stock-pill" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}>⬤ ONLY {qty} LEFT</span>
  return <span className="stock-pill"><span className="stock-dot" />IN STOCK</span>
}

export function GameDetailClient({ game, relatedGames }: Props) {
  const { addToCart } = useCart()
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'specs'>('overview')
  const [wishlisted, setWishlisted] = useState(false)
  const [addedNotice, setAddedNotice] = useState(false)
  const [mainImage, setMainImage] = useState(game.imageUrl ?? '')

  const selectedVariant = game.variants[selectedVariantIdx]
  const hasVariants = game.variants.length > 0
  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : false

  const handleAdd = () => {
    if (!selectedVariant || !inStock) return
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
    setAddedNotice(true)
    setTimeout(() => setAddedNotice(false), 3000)
  }

  const allImages = [game.imageUrl, ...game.galleryImages].filter(Boolean) as string[]

  return (
    <div className="site-shell noise">
      <SiteHeader />

      <main className="product-page-main game-page-main">
        {/* Breadcrumbs */}
        <div className="product-breadcrumbs">
          <Link href="/">Home</Link>
          <ChevronRight size={13} />
          <Link href="/games">Games</Link>
          <ChevronRight size={13} />
          <span className="current-crumb">{game.name}</span>
        </div>

        {/* Hero */}
        <section className="product-detail-hero game-detail-hero">
          {/* Left: Image */}
          <div className="product-stage-col">
            <div className="product-showcase-box game-showcase-box">
              {mainImage ? (
                <div className="relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden">
                  <Image
                    src={mainImage}
                    alt={game.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              ) : (
                <div className="showcase-glyph-wrap game-glyph-wrap">
                  <div className="showcase-glyph-card game-glyph-large">
                    <span>🎮</span>
                  </div>
                </div>
              )}
              {selectedVariant && <StockBadge qty={selectedVariant.stockQuantity} />}
              <div className="product-hud-corner" aria-hidden="true" />
            </div>

            {/* Gallery thumbnails */}
            {allImages.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${mainImage === img ? 'border-primary' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info + Buy */}
          <div className="product-info-col">
            <div className="product-kicker-row">
              <span className="section-kicker">SOFTWARE TITLE</span>
            </div>

            <h1 className="product-headline">{game.name}</h1>

            {/* Meta tags */}
            <div className="game-meta-tags-row">
              {game.tags.map((t) => <span key={t} className="genre-tag">{t}</span>)}
              {game.platform && <span className="release-tag">{game.platform}</span>}
              {game.category && <span className="release-tag">{game.category}</span>}
            </div>

            {/* Rating */}
            {game.rating > 0 && (
              <div className="product-rating-bar">
                <div className="stars-cluster">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.round(game.rating) ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-white/20'} />
                  ))}
                </div>
                <span className="rating-score">{game.rating.toFixed(1)}</span>
                {game.reviewCount > 0 && (
                  <>
                    <span className="rating-sep">·</span>
                    <span className="reviews-link">{game.reviewCount.toLocaleString()} ratings</span>
                  </>
                )}
              </div>
            )}

            {/* Price */}
            {hasVariants && selectedVariant && (
              <div className="product-price-row">
                <div className="price-main">{formatTaka(selectedVariant.price)}</div>
                {selectedVariant.compareAtPrice && (
                  <span className="price-strikethrough">{formatTaka(selectedVariant.compareAtPrice)}</span>
                )}
                {selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price && (
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                    {Math.round((1 - selectedVariant.price / selectedVariant.compareAtPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            )}

            {!hasVariants && (
              <p className="mt-4 text-muted-foreground text-sm">No pricing available. Check back soon.</p>
            )}

            <p className="product-short-summary">{game.shortDescription}</p>

            {/* Variant selector */}
            {game.variants.length > 1 && (
              <div className="editions-picker-block">
                <div className="option-label">
                  <span>SELECT EDITION:</span>
                  <strong>{selectedVariant?.title}</strong>
                </div>
                <div className="editions-list">
                  {game.variants.map((v, i) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantIdx(i)}
                      className={`edition-card-btn ${selectedVariantIdx === i ? 'active' : ''}`}
                    >
                      <div className="edition-btn-top">
                        <strong>{v.title}</strong>
                        <span className="edition-price">{formatTaka(v.price)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {v.stockQuantity > 0 ? `${v.stockQuantity} in stock` : 'Out of stock'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            {hasVariants && (
              <div className="purchase-controls">
                <button
                  type="button"
                  disabled={!inStock}
                  className="button-primary add-to-bag-btn disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAdd}
                >
                  <ShoppingBag size={18} />
                  <span>
                    {inStock
                      ? `ADD TO CART · ${formatTaka(selectedVariant.price)}`
                      : 'OUT OF STOCK'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setWishlisted(!wishlisted)}
                  className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
                  aria-label="Add to wishlist"
                >
                  <Heart size={18} className={wishlisted ? 'fill-[#ec4899] text-[#ec4899]' : ''} />
                </button>
              </div>
            )}

            {addedNotice && (
              <div className="added-toast">
                <Check size={16} />
                <span>ADDED TO CART!</span>
              </div>
            )}

            {/* Specs quick view */}
            {Object.keys(game.specs).length > 0 && (
              <div className="game-credits-grid">
                {Object.entries(game.specs).slice(0, 4).map(([k, v]) => (
                  <div key={k} className="credit-cell">
                    <span className="credit-label">{k.toUpperCase()}</span>
                    <span className="credit-val">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Tabbed section */}
        <section className="product-tabbed-section">
          <div className="product-tabs-header">
            <button type="button" className={`product-tab-nav ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              Overview
            </button>
            {game.features.length > 0 && (
              <button type="button" className={`product-tab-nav ${activeTab === 'features' ? 'active' : ''}`} onClick={() => setActiveTab('features')}>
                Features
              </button>
            )}
            {Object.keys(game.specs).length > 0 && (
              <button type="button" className={`product-tab-nav ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>
                Specs
              </button>
            )}
          </div>

          <div className="product-tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab-pane">
                {game.description
                  ? game.description.split('\n').map((p, i) => <p key={i} className="tab-lead-para mb-4">{p}</p>)
                  : <p className="tab-lead-para text-muted-foreground">No description provided.</p>
                }
              </div>
            )}

            {activeTab === 'features' && game.features.length > 0 && (
              <div className="overview-tab-pane">
                <h3>KEY FEATURES</h3>
                <div className="features-checklist-grid">
                  {game.features.map((feat, idx) => (
                    <div key={idx} className="feature-check-card">
                      <div className="feature-check-num">0{idx + 1}</div>
                      <p>{feat}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specs' && Object.keys(game.specs).length > 0 && (
              <div className="specs-tab-pane">
                <table className="specs-table">
                  <tbody>
                    {Object.entries(game.specs).map(([k, v], idx) => (
                      <tr key={idx}>
                        <th>{k}</th>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Related Games */}
        {relatedGames.length > 0 && (
          <section className="related-gear-section">
            <div className="section-head-simple">
              <div>
                <div className="section-kicker">MORE TITLES</div>
                <h2 className="section-title">EXPAND YOUR <span>LIBRARY.</span></h2>
              </div>
              <Link href="/games" className="view-all-link">
                View All Games <ArrowRight size={14} />
              </Link>
            </div>
            <div className="related-grid">
              {relatedGames.map((item) => (
                <Link key={item.id} href={`/games/${item.slug}`} className="related-card">
                  <div className="related-card-art" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                    ) : (
                      <div className="product-glyph"><span>🎮</span></div>
                    )}
                  </div>
                  <div className="related-card-info">
                    <span className="product-type">{item.category ?? item.platform ?? 'Game'}</span>
                    <h4>{item.name}</h4>
                    {item.price && <span className="related-price">{formatTaka(item.price)}</span>}
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
