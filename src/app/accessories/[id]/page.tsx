'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { getAccessoryById, ACCESSORIES, Product } from '@/lib/products';
import { useCart } from '@/components/cart-context';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Zap,
} from 'lucide-react';

export default function AccessoryDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const accessory = getAccessoryById(id);

  if (!accessory) {
    notFound();
  }

  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(
    accessory.colors && accessory.colors.length > 0 ? accessory.colors[0].name : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'box' | 'warranty'>('overview');
  const [addedNotice, setAddedNotice] = useState(false);

  const relatedGear = ACCESSORIES.filter((item) => item.id !== accessory.id).slice(0, 3);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(accessory, { color: selectedColor });
    }
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
    <div className="site-shell noise">
      <SiteHeader />

      <main className="product-page-main">
        {/* Breadcrumbs */}
        <div className="product-breadcrumbs">
          <Link href="/">Home</Link>
          <ChevronRight size={13} />
          <Link href="/accessories">Accessories</Link>
          <ChevronRight size={13} />
          <span className="current-crumb">{accessory.name}</span>
        </div>

        {/* Product Hero Section */}
        <section className="product-detail-hero">
          {/* Left: 3D Art & Visual Showcase */}
          <div className="product-stage-col">
            <div className="product-showcase-box" style={{ '--product-wash': accessory.wash } as React.CSSProperties}>
              {accessory.badge && (
                <div className="product-badge-large">
                  <span className="product-badge-dot" />
                  {accessory.badge}
                </div>
              )}

              <div className="showcase-glyph-wrap">
                <div className="showcase-glyph-card">
                  <span>{accessory.glyph}</span>
                </div>
              </div>

              <div className="showcase-hud-telemetry">
                <div className="hud-pill">
                  <span className="telemetry-dot" />
                  <span>SECTOR: HARDWARE VAULT</span>
                </div>
                <div className="hud-pill">
                  <span>AUTHENTIC SONY PART</span>
                </div>
              </div>

              <div className="product-hud-corner" aria-hidden="true" />
            </div>

            {/* Quick Box Contents */}
            <div className="box-contents-card">
              <div className="box-contents-head">
                <Box size={16} className="text-[#c084fc]" />
                <h3>PACKAGE MANIFEST</h3>
              </div>
              <ul className="box-contents-list">
                <li>1x {accessory.name}</li>
                <li>1x High-Purity Braided USB-C Cable</li>
                <li>1x Quick Start Holographic Deployment Manual</li>
                <li>1x ReiKai Void Authenticity Seal Card</li>
              </ul>
            </div>
          </div>

          {/* Right: Purchasing & Customization Panel */}
          <div className="product-info-col">
            <div className="product-kicker-row">
              <span className="section-kicker">02 // ACCESSORY ARCHITECTURE</span>
              <span className="stock-pill">
                <span className="stock-dot" />
                VERIFIED IN STOCK
              </span>
            </div>

            <h1 className="product-headline">{accessory.name}</h1>

            <div className="product-rating-bar">
              <div className="stars-cluster">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#f59e0b] text-[#f59e0b]" />
                ))}
              </div>
              <span className="rating-score">{accessory.rating}</span>
              <span className="rating-sep">·</span>
              <span className="reviews-link">{accessory.reviewsCount.toLocaleString()} verified operative reviews</span>
            </div>

            <div className="product-price-row">
              <div className="price-main">${accessory.price.toFixed(2)}</div>
              {accessory.originalPrice && (
                <>
                  <span className="price-strikethrough">${accessory.originalPrice.toFixed(2)}</span>
                  <span className="savings-badge">
                    SAVE ${(accessory.originalPrice - accessory.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <p className="product-short-summary">{accessory.fullDesc}</p>

            {/* Color / Finish Selection */}
            {accessory.colors && accessory.colors.length > 0 && (
              <div className="product-option-block">
                <div className="option-label">
                  <span>FINISH // CHASSIS:</span>
                  <strong>{selectedColor}</strong>
                </div>
                <div className="color-options-row">
                  {accessory.colors.map((c) => (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`color-select-btn ${selectedColor === c.name ? 'active' : ''}`}
                    >
                      <span className="color-select-dot" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key Feature Bullets */}
            <div className="key-specs-grid">
              {accessory.features.slice(0, 3).map((feat, index) => (
                <div key={index} className="key-spec-cell">
                  <CheckCircle2 size={16} className="text-[#a855f7] flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Quantity and Add to Bag */}
            <div className="purchase-controls">
              <div className="qty-picker">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                className="button-primary add-to-bag-btn"
                onClick={handleAdd}
              >
                <ShoppingBag size={18} />
                <span>ACQUIRE TO BAG · ${(accessory.price * quantity).toFixed(2)}</span>
              </button>
            </div>

            {addedNotice && (
              <div className="added-toast">
                <Check size={16} />
                <span>HARDWARE MODULE TRANSFERRED TO BAG!</span>
              </div>
            )}

            {/* Guarantees */}
            <div className="product-assurances">
              <div className="assurance-item">
                <Truck size={17} className="text-[#c084fc]" />
                <div>
                  <strong>Expedited Orbital Delivery</strong>
                  <span>Dispatched in shielded protective packaging</span>
                </div>
              </div>
              <div className="assurance-item">
                <ShieldCheck size={17} className="text-[#a855f7]" />
                <div>
                  <strong>2-Year Void Replacement Warranty</strong>
                  <span>Full hardware replacement with zero friction</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Tabs: Overview, Specs, What's in Box, Warranty */}
        <section className="product-tabbed-section">
          <div className="product-tabs-header">
            <button
              type="button"
              className={`product-tab-nav ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Full Overview
            </button>
            <button
              type="button"
              className={`product-tab-nav ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Technical Specifications
            </button>
            <button
              type="button"
              className={`product-tab-nav ${activeTab === 'box' ? 'active' : ''}`}
              onClick={() => setActiveTab('box')}
            >
              Package Manifest
            </button>
            <button
              type="button"
              className={`product-tab-nav ${activeTab === 'warranty' ? 'active' : ''}`}
              onClick={() => setActiveTab('warranty')}
            >
              Warranty &amp; Support
            </button>
          </div>

          <div className="product-tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab-pane">
                <h3>ENGINEERED FOR SUPREMACY</h3>
                <p className="tab-lead-para">{accessory.fullDesc}</p>
                <div className="features-checklist-grid">
                  {accessory.features.map((feat, idx) => (
                    <div key={idx} className="feature-check-card">
                      <div className="feature-check-num">0{idx + 1}</div>
                      <p>{feat}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="specs-tab-pane">
                <table className="specs-table">
                  <tbody>
                    {accessory.specs.map((s, idx) => (
                      <tr key={idx}>
                        <th>{s.label}</th>
                        <td>{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'box' && (
              <div className="box-tab-pane">
                <h3>WHAT ARRIVES IN YOUR PACKAGE</h3>
                <div className="box-items-grid">
                  <div className="box-item-card">
                    <Package size={24} className="text-[#a855f7]" />
                    <div>
                      <strong>{accessory.name}</strong>
                      <span>Official Retail Unit</span>
                    </div>
                  </div>
                  <div className="box-item-card">
                    <Zap size={24} className="text-[#c084fc]" />
                    <div>
                      <strong>Shielded USB-C Cable</strong>
                      <span>High-throughput charging and data sync</span>
                    </div>
                  </div>
                  <div className="box-item-card">
                    <ShieldCheck size={24} className="text-[#e879f9]" />
                    <div>
                      <strong>Authenticity Certificate</strong>
                      <span>Registered hardware warranty card</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'warranty' && (
              <div className="warranty-tab-pane">
                <h3>REIKAI VOID PROTOCOL WARRANTY</h3>
                <p>
                  Every hardware accessory purchased from ReiKai Arcade includes our comprehensive 2-Year Void Replacement Warranty. In the event of stick drift, mechanical switch degradation, or acoustic imbalance, our rapid orbital exchange protocol dispatches a replacement before you even return the affected unit.
                </p>
                <ul className="warranty-points">
                  <li>✦ Zero deductible hardware replacement</li>
                  <li>✦ Dedicated 24/7 priority technician chat support</li>
                  <li>✦ 30-day money-back satisfaction guarantee</li>
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Cross-Sell Related Gear */}
        <section className="related-gear-section">
          <div className="section-head-simple">
            <div>
              <div className="section-kicker">RELATED TELEMETRY</div>
              <h2 className="section-title">COMPLETE THE <span>SETUP.</span></h2>
            </div>
            <Link href="/accessories" className="view-all-link">
              View All Accessories <ArrowRight size={14} />
            </Link>
          </div>

          <div className="related-grid">
            {relatedGear.map((item) => (
              <Link key={item.id} href={`/accessories/${item.id}`} className="related-card">
                <div className="related-card-art" style={{ '--product-wash': item.wash } as React.CSSProperties}>
                  <div className="product-glyph">
                    <span>{item.glyph}</span>
                  </div>
                </div>
                <div className="related-card-info">
                  <span className="product-type">{item.subCategory}</span>
                  <h4>{item.name}</h4>
                  <span className="related-price">${item.price.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
