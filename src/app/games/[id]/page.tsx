'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { getGameById, GAMES, ACCESSORIES, Product } from '@/lib/products';
import { useCart } from '@/components/cart-context';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Disc,
  Gamepad2,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';

export default function GameDetailPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const game = getGameById(id);

  if (!game) {
    notFound();
  }

  const { addToCart } = useCart();
  const [selectedEdition, setSelectedEdition] = useState(
    game.editions && game.editions.length > 0 ? game.editions[0].id : 'standard'
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'specs' | 'reviews'>('overview');
  const [wishlisted, setWishlisted] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const currentEditionObj = game.editions?.find((e) => e.id === selectedEdition) || {
    id: 'standard',
    name: 'Standard Edition',
    price: game.price,
    perks: ['Full Game'],
  };

  const handleAdd = () => {
    addToCart(game, {
      edition: currentEditionObj.name,
      price: currentEditionObj.price,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const companionGear = ACCESSORIES.slice(0, 2);
  const relatedGames = GAMES.filter((g) => g.id !== game.id).slice(0, 3);

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

        {/* Game Detail Hero */}
        <section className="product-detail-hero game-detail-hero">
          {/* Left: Atmospheric Artwork Box */}
          <div className="product-stage-col">
            <div
              className="product-showcase-box game-showcase-box"
              style={{
                '--product-wash': game.wash,
                background: game.backdropWash || undefined,
              } as React.CSSProperties}
            >
              {game.badge && (
                <div className="product-badge-large">
                  <span className="product-badge-dot" />
                  {game.badge}
                </div>
              )}

              {game.metacritic && (
                <div className="metacritic-badge-large">
                  <span className="meta-text">METACRITIC SCORE</span>
                  <span className="meta-num">{game.metacritic}</span>
                  <span className="meta-verdict">Universal Acclaim</span>
                </div>
              )}

              <div className="showcase-glyph-wrap game-glyph-wrap">
                <div className="showcase-glyph-card game-glyph-large">
                  <span>{game.glyph}</span>
                </div>
              </div>

              <div className="showcase-hud-telemetry">
                <div className="hud-pill">
                  <span className="telemetry-dot" />
                  <span>PLAYSTATION 5 EXCLUSIVE</span>
                </div>
                {game.esrb && (
                  <div className="hud-pill">
                    <span>ESRB: {game.esrb}</span>
                  </div>
                )}
              </div>

              <div className="product-hud-corner" aria-hidden="true" />
            </div>

            {/* Hardware Enhancements Banner */}
            <div className="game-specs-quick-card">
              <div className="quick-specs-title">
                <Sparkles size={16} className="text-[#c084fc]" />
                <h3>PS5 HARDWARE OPTIMIZATIONS</h3>
              </div>
              <div className="enhancements-list">
                {game.enhancements?.map((enh, i) => (
                  <div key={i} className="enhancement-item">
                    <CheckCircle2 size={15} className="text-[#a855f7]" />
                    <span>{enh}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Edition Selection and Purchasing */}
          <div className="product-info-col">
            <div className="product-kicker-row">
              <span className="section-kicker">01 // SOFTWARE DEPLOYMENT</span>
              <span className="stock-pill">
                <span className="stock-dot" />
                DIGITAL &amp; PHYSICAL IN STOCK
              </span>
            </div>

            <h1 className="product-headline">{game.name}</h1>

            <div className="game-meta-tags-row">
              {game.genre?.map((g, i) => (
                <span key={i} className="genre-tag">
                  {g}
                </span>
              ))}
              {game.releaseDate && (
                <span className="release-tag">Release: {game.releaseDate}</span>
              )}
            </div>

            <div className="product-rating-bar">
              <div className="stars-cluster">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#f59e0b] text-[#f59e0b]" />
                ))}
              </div>
              <span className="rating-score">{game.rating}</span>
              <span className="rating-sep">·</span>
              <span className="reviews-link">{game.reviewsCount.toLocaleString()} verified player ratings</span>
            </div>

            <div className="product-price-row">
              <div className="price-main">${currentEditionObj.price.toFixed(2)}</div>
              {game.originalPrice && (
                <span className="price-strikethrough">${game.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <p className="product-short-summary">{game.shortDesc}</p>

            {/* Edition Selector */}
            {game.editions && game.editions.length > 0 && (
              <div className="editions-picker-block">
                <div className="option-label">
                  <span>SELECT EDITION:</span>
                  <strong>{currentEditionObj.name}</strong>
                </div>
                <div className="editions-list">
                  {game.editions.map((ed) => (
                    <button
                      type="button"
                      key={ed.id}
                      onClick={() => setSelectedEdition(ed.id)}
                      className={`edition-card-btn ${selectedEdition === ed.id ? 'active' : ''}`}
                    >
                      <div className="edition-btn-top">
                        <strong>{ed.name}</strong>
                        <span className="edition-price">${ed.price.toFixed(2)}</span>
                      </div>
                      <ul className="edition-perks-list">
                        {ed.perks.map((p, idx) => (
                          <li key={idx}>✦ {p}</li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="purchase-controls">
              <button
                type="button"
                className="button-primary add-to-bag-btn"
                onClick={handleAdd}
              >
                <ShoppingBag size={18} />
                <span>ACQUIRE {currentEditionObj.name.toUpperCase()} · ${currentEditionObj.price.toFixed(2)}</span>
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

            {addedNotice && (
              <div className="added-toast">
                <Check size={16} />
                <span>AUTHORIZED KEY ADDED TO ACQUISITION BAG!</span>
              </div>
            )}

            {/* Metadata credits */}
            <div className="game-credits-grid">
              {game.developer && (
                <div className="credit-cell">
                  <span className="credit-label">DEVELOPER</span>
                  <span className="credit-val">{game.developer}</span>
                </div>
              )}
              {game.publisher && (
                <div className="credit-cell">
                  <span className="credit-label">PUBLISHER</span>
                  <span className="credit-val">{game.publisher}</span>
                </div>
              )}
              {game.esrb && (
                <div className="credit-cell">
                  <span className="credit-label">AGE RATING</span>
                  <span className="credit-val">{game.esrb}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Tabbed Section */}
        <section className="product-tabbed-section">
          <div className="product-tabs-header">
            <button
              type="button"
              className={`product-tab-nav ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Story &amp; World
            </button>
            <button
              type="button"
              className={`product-tab-nav ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              Key Gameplay Mechanics
            </button>
            <button
              type="button"
              className={`product-tab-nav ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Technical Specs
            </button>
            <button
              type="button"
              className={`product-tab-nav ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Critic &amp; Player Reviews
            </button>
          </div>

          <div className="product-tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab-pane">
                <h3>THE ODYSSEY UNFOLDS</h3>
                <p className="tab-lead-para">{game.fullDesc}</p>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="overview-tab-pane">
                <h3>CORE GAMEPLAY HIGHLIGHTS</h3>
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

            {activeTab === 'specs' && (
              <div className="specs-tab-pane">
                <table className="specs-table">
                  <tbody>
                    {game.specs.map((s, idx) => (
                      <tr key={idx}>
                        <th>{s.label}</th>
                        <td>{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="warranty-tab-pane">
                <h3>COMMENDATIONS FROM THE FLEET</h3>
                <div className="review-quote-card">
                  <div className="review-quote-stars">★★★★★</div>
                  <p className="review-quote-text">
                    &ldquo;An extraordinary generational achievement that fully demonstrates what the PlayStation 5 hardware and DualSense controller are capable of.&rdquo;
                  </p>
                  <span className="review-quote-author">IGN · 10/10 Masterpiece</span>
                </div>
                <div className="review-quote-card" style={{ marginTop: '16px' }}>
                  <div className="review-quote-stars">★★★★★</div>
                  <p className="review-quote-text">
                    &ldquo;Visual fidelity and spatial audio immersion so sublime you lose all track of time. A must-play.&rdquo;
                  </p>
                  <span className="review-quote-author">Eurogamer · Essential Recommendation</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Companion Setup Gear */}
        <section className="related-gear-section">
          <div className="section-head-simple">
            <div>
              <div className="section-kicker">COMPANION HARDWARE</div>
              <h2 className="section-title">CALIBRATED FOR <span>IMMERSION.</span></h2>
            </div>
            <Link href="/accessories" className="view-all-link">
              Explore All Gear <ArrowRight size={14} />
            </Link>
          </div>

          <div className="companion-gear-banner">
            {companionGear.map((gear) => (
              <div key={gear.id} className="companion-gear-card">
                <div className="companion-card-left">
                  <div className="product-glyph" style={{ width: '60px', height: '60px' }}>
                    <span>{gear.glyph}</span>
                  </div>
                  <div>
                    <span className="product-type">Recommended Gear</span>
                    <h4>{gear.name}</h4>
                    <p>{gear.shortDesc}</p>
                  </div>
                </div>
                <div className="companion-card-right">
                  <span className="price-tag">${gear.price.toFixed(2)}</span>
                  <Link href={`/accessories/${gear.id}`} className="button-primary" style={{ padding: '8px 18px', fontSize: '.75rem' }}>
                    Inspect Gear
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* More Games */}
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
              <Link key={item.id} href={`/games/${item.id}`} className="related-card">
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
