'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useCart } from '@/components/cart-context'
import { ArrowRight, Check, ChevronRight, Minus, Plus, ShoppingBag, Star, Truck, RotateCcw, ShieldCheck } from 'lucide-react'

type Variant = { id: string; title: string | null; sku: string | null; price: number; compareAtPrice: number | null; stockQuantity: number }
type Accessory = {
  id: string; slug: string; name: string; type: string
  shortDescription: string | null; description: string | null
  brand: string | null; platform: string | null; category: string | null
  imageUrl: string | null; galleryImages: string[]; tags: string[]
  features: string[]; specs: Record<string, string>
  rating: number; reviewCount: number; featured: boolean
  variants: Variant[]
}
type RelatedAccessory = { id: string; slug: string; name: string; imageUrl: string | null; brand: string | null; category: string | null; price: number | null }

function formatTaka(paisa: number) { return `৳${(paisa / 100).toLocaleString('en-BD')}` }

export function AccessoryDetailClient({ accessory, relatedAccessories }: { accessory: Accessory; relatedAccessories: RelatedAccessory[] }) {
  const { addToCart } = useCart()
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'specs'>('overview')
  const [addedNotice, setAddedNotice] = useState(false)
  const [mainImage, setMainImage] = useState(accessory.imageUrl ?? '')

  const selectedVariant = accessory.variants[selectedVariantIdx]
  const inStock = selectedVariant ? selectedVariant.stockQuantity > 0 : false

  const handleAdd = () => {
    if (!selectedVariant || !inStock) return
    for (let i = 0; i < quantity; i++) {
      addToCart(
        { id: selectedVariant.id, name: accessory.name, price: selectedVariant.price / 100, image: accessory.imageUrl, type: 'accessory' } as any,
        { edition: selectedVariant.title ?? 'Standard', price: selectedVariant.price / 100 }
      )
    }
    setAddedNotice(true)
    setTimeout(() => setAddedNotice(false), 3000)
  }

  const allImages = [accessory.imageUrl, ...accessory.galleryImages].filter(Boolean) as string[]

  return (
    <div className="site-shell noise">
      <SiteHeader />
      <main className="product-page-main">
        {/* Breadcrumbs */}
        <div className="product-breadcrumbs">
          <Link href="/">Home</Link><ChevronRight size={13} />
          <Link href="/accessories">Accessories</Link><ChevronRight size={13} />
          <span className="current-crumb">{accessory.name}</span>
        </div>

        {/* Hero */}
        <section className="product-detail-hero">
          {/* Left: Image */}
          <div className="product-stage-col">
            <div className="product-showcase-box">
              {mainImage ? (
                <div className="relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden">
                  <Image src={mainImage} alt={accessory.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
                </div>
              ) : (
                <div className="showcase-glyph-wrap"><div className="showcase-glyph-card"><span>🎧</span></div></div>
              )}
              <div className="product-hud-corner" aria-hidden="true" />
            </div>
            {allImages.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setMainImage(img)} className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${mainImage === img ? 'border-primary' : 'border-white/10 opacity-60 hover:opacity-100'}`}>
                    <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info + Buy */}
          <div className="product-info-col">
            <div className="product-kicker-row">
              <span className="section-kicker">{accessory.category ?? 'ACCESSORY'}</span>
              {selectedVariant && (
                <span className="stock-pill" style={!inStock ? { background: 'rgba(239,68,68,0.12)', color: '#f87171' } : {}}>
                  <span className="stock-dot" style={!inStock ? { background: '#f87171' } : {}} />
                  {inStock ? `${selectedVariant.stockQuantity} IN STOCK` : 'OUT OF STOCK'}
                </span>
              )}
            </div>
            {accessory.brand && <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{accessory.brand}</p>}
            <h1 className="product-headline">{accessory.name}</h1>

            <div className="flex flex-wrap gap-1 mt-2">
              {accessory.tags.map((t) => <span key={t} className="genre-tag">{t}</span>)}
            </div>

            {accessory.rating > 0 && (
              <div className="product-rating-bar">
                <div className="stars-cluster">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < Math.round(accessory.rating) ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-white/20'} />)}
                </div>
                <span className="rating-score">{accessory.rating.toFixed(1)}</span>
                {accessory.reviewCount > 0 && <><span className="rating-sep">·</span><span className="reviews-link">{accessory.reviewCount.toLocaleString()} reviews</span></>}
              </div>
            )}

            {selectedVariant && (
              <div className="product-price-row">
                <div className="price-main">{formatTaka(selectedVariant.price)}</div>
                {selectedVariant.compareAtPrice && <span className="price-strikethrough">{formatTaka(selectedVariant.compareAtPrice)}</span>}
                {selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price && (
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                    {Math.round((1 - selectedVariant.price / selectedVariant.compareAtPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            )}

            <p className="product-short-summary">{accessory.shortDescription}</p>

            {/* Variant selector */}
            {accessory.variants.length > 1 && (
              <div className="editions-picker-block">
                <div className="option-label"><span>SELECT VARIANT:</span><strong>{selectedVariant?.title}</strong></div>
                <div className="editions-list">
                  {accessory.variants.map((v, i) => (
                    <button key={v.id} type="button" onClick={() => setSelectedVariantIdx(i)} className={`edition-card-btn ${selectedVariantIdx === i ? 'active' : ''}`}>
                      <div className="edition-btn-top"><strong>{v.title}</strong><span className="edition-price">{formatTaka(v.price)}</span></div>
                      <p className="text-xs text-muted-foreground mt-1">{v.stockQuantity > 0 ? `${v.stockQuantity} in stock` : 'Out of stock'}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add */}
            {selectedVariant && (
              <div className="purchase-controls">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="rounded-lg p-1 hover:bg-white/10 transition"><Minus size={14} /></button>
                  <span className="w-8 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(selectedVariant.stockQuantity, q + 1))} className="rounded-lg p-1 hover:bg-white/10 transition"><Plus size={14} /></button>
                </div>
                <button type="button" disabled={!inStock} onClick={handleAdd} className="button-primary add-to-bag-btn flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ShoppingBag size={18} />
                  <span>{inStock ? `ADD TO CART · ${formatTaka(selectedVariant.price * quantity)}` : 'OUT OF STOCK'}</span>
                </button>
              </div>
            )}

            {addedNotice && <div className="added-toast"><Check size={16} /><span>ADDED TO CART!</span></div>}

            {/* Trust badges */}
            <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Truck size={14} /><span>Free shipping over ৳5,000</span></div>
              <div className="flex items-center gap-1.5"><RotateCcw size={14} /><span>7-day returns</span></div>
              <div className="flex items-center gap-1.5"><ShieldCheck size={14} /><span>Genuine product guarantee</span></div>
            </div>

            {/* Quick specs */}
            {Object.keys(accessory.specs).length > 0 && (
              <div className="game-credits-grid mt-4">
                {Object.entries(accessory.specs).slice(0, 4).map(([k, v]) => (
                  <div key={k} className="credit-cell">
                    <span className="credit-label">{k}</span>
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
            <button type="button" className={`product-tab-nav ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
            {accessory.features.length > 0 && <button type="button" className={`product-tab-nav ${activeTab === 'features' ? 'active' : ''}`} onClick={() => setActiveTab('features')}>Features</button>}
            {Object.keys(accessory.specs).length > 0 && <button type="button" className={`product-tab-nav ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>Specifications</button>}
          </div>
          <div className="product-tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab-pane">
                {accessory.description ? accessory.description.split('\n').map((p, i) => <p key={i} className="tab-lead-para mb-4">{p}</p>) : <p className="tab-lead-para text-muted-foreground">No description provided.</p>}
              </div>
            )}
            {activeTab === 'features' && accessory.features.length > 0 && (
              <div className="overview-tab-pane">
                <div className="features-checklist-grid">
                  {accessory.features.map((f, i) => <div key={i} className="feature-check-card"><div className="feature-check-num">0{i + 1}</div><p>{f}</p></div>)}
                </div>
              </div>
            )}
            {activeTab === 'specs' && Object.keys(accessory.specs).length > 0 && (
              <div className="specs-tab-pane">
                <table className="specs-table"><tbody>
                  {Object.entries(accessory.specs).map(([k, v], i) => <tr key={i}><th>{k}</th><td>{v}</td></tr>)}
                </tbody></table>
              </div>
            )}
          </div>
        </section>

        {/* Related */}
        {relatedAccessories.length > 0 && (
          <section className="related-gear-section">
            <div className="section-head-simple">
              <div><div className="section-kicker">MORE GEAR</div><h2 className="section-title">EXPAND YOUR <span>SETUP.</span></h2></div>
              <Link href="/accessories" className="view-all-link">All Accessories <ArrowRight size={14} /></Link>
            </div>
            <div className="related-grid">
              {relatedAccessories.map((item) => (
                <Link key={item.id} href={`/accessories/${item.slug}`} className="related-card">
                  <div className="related-card-art" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {item.imageUrl ? <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="25vw" /> : <div className="product-glyph"><span>🎧</span></div>}
                  </div>
                  <div className="related-card-info">
                    <span className="product-type">{item.brand ?? item.category ?? 'Accessory'}</span>
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
