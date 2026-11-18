'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, ArrowRight, ShoppingCart } from 'lucide-react';
import { formatTaka } from '@/lib/products';
import { useCart } from '@/components/cart-context';
import type { Product } from '@/lib/products';

/* ─────────────────────────────────────────
   Static flash-sale items (can be replaced
   with a DB-driven API call later)
───────────────────────────────────────── */
const FLASH_DEALS: (Product & { originalPrice: number; discount: number })[] = [
  {
    id: 'astro-bot',
    name: 'Astro Bot / PS5',
    type: 'games',
    category: 'games',
    subCategory: 'Platformer',
    label: 'PS5 Exclusive',
    price: 4499,
    originalPrice: 5999,
    discount: 25,
    glyph: 'ASTRO',
    wash: 'hsl(272 90% 68% / .32)',
    coverImage: '/covers/astro-bot.jpg',
    rating: 4.98,
    reviewsCount: 4150,
    inStock: true,
    shortDesc: 'Join ASTRO in a monumental PS5 space adventure across 50+ diverse planets.',
    fullDesc: '',
    features: [],
    specs: [],
  },
  {
    id: 'elden-ring',
    name: 'Elden Ring Shadow of the Erdtree',
    type: 'games',
    category: 'games',
    subCategory: 'Action RPG',
    label: 'Action RPG',
    price: 3749,
    originalPrice: 4999,
    discount: 25,
    glyph: 'ER',
    wash: 'hsl(45 80% 60% / .30)',
    coverImage: '/covers/elden-ring.jpg',
    rating: 4.96,
    reviewsCount: 8920,
    inStock: true,
    shortDesc: 'Journey deeper into the Lands Between with Miquella in the acclaimed expansion.',
    fullDesc: '',
    features: [],
    specs: [],
  },
  {
    id: 'dualsense-edge',
    name: 'DualSense Edge™ Controller',
    type: 'gear',
    category: 'accessories',
    subCategory: 'Controllers',
    label: 'Pro Controller',
    price: 19999,
    originalPrice: 24999,
    discount: 20,
    glyph: 'EDGE',
    wash: 'hsl(285 85% 72% / .32)',
    coverImage: '/accessories/dualsense-edge.jpg',
    rating: 4.95,
    reviewsCount: 2450,
    inStock: true,
    shortDesc: 'Ultra-customizable pro controller with remappable back buttons.',
    fullDesc: '',
    features: [],
    specs: [],
  },
  {
    id: 'wukong',
    name: 'Black Myth: Wukong',
    type: 'games',
    category: 'games',
    subCategory: 'Action RPG',
    label: 'Action RPG',
    price: 3999,
    originalPrice: 5499,
    discount: 27,
    glyph: 'WUKONG',
    wash: 'hsl(27 80% 55% / .32)',
    coverImage: '/covers/wukong.jpg',
    rating: 4.94,
    reviewsCount: 3100,
    inStock: true,
    shortDesc: 'Journey through Chinese mythology as the legendary Monkey King.',
    fullDesc: '',
    features: [],
    specs: [],
  },
];

/* ── Countdown target: next midnight ── */
function getTargetTime() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

function useCountdown(target: number) {
  const [remaining, setRemaining] = useState(Math.max(0, target - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(id);
  }, [target]);
  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);
  return { h, m, s };
}

function CountBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="fs-count-block">
      <span className="fs-count-num">{String(value).padStart(2, '0')}</span>
      <span className="fs-count-label">{label}</span>
    </div>
  );
}

export function FlashSale() {
  const { addToCart } = useCart();
  const target = useRef(getTargetTime());
  const { h, m, s } = useCountdown(target.current);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* drag-to-scroll */
  const dragState = useRef({ dragging: false, startX: 0, scrollX: 0 });
  const onMouseDown = (e: React.MouseEvent) => {
    dragState.current = { dragging: true, startX: e.pageX, scrollX: scrollRef.current?.scrollLeft ?? 0 };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current.dragging) return;
    const dx = e.pageX - dragState.current.startX;
    if (scrollRef.current) scrollRef.current.scrollLeft = dragState.current.scrollX - dx;
  };
  const onMouseUp = () => { dragState.current.dragging = false; };

  return (
    <section className="fs-section" id="flash-sale" aria-labelledby="fs-title">
      {/* glow blobs */}
      <div className="fs-bg-glow fs-bg-glow--left" aria-hidden="true" />
      <div className="fs-bg-glow fs-bg-glow--right" aria-hidden="true" />

      <div className="fs-inner">
        {/* Header row */}
        <div className="fs-header" data-reveal>
          <div className="fs-header-left">
            <div className="fs-label-row">
              <span className="fs-zap-icon" aria-hidden="true"><Zap size={14} fill="currentColor" /></span>
              <span className="fs-eyebrow">Flash Sale</span>
              <span className="fs-live-dot" aria-label="Live" />
            </div>
            <h2 className="fs-title" id="fs-title">Big drops,<br />short window.</h2>
            <p className="fs-subtitle">Limited-time prices on top PlayStation titles & gear.</p>
          </div>

          <div className="fs-countdown-wrap">
            <p className="fs-ends-in">Ends in</p>
            <div className="fs-countdown">
              <CountBlock value={h} label="HRS" />
              <span className="fs-colon" aria-hidden="true">:</span>
              <CountBlock value={m} label="MIN" />
              <span className="fs-colon" aria-hidden="true">:</span>
              <CountBlock value={s} label="SEC" />
            </div>
          </div>
        </div>

        {/* Product rail */}
        <div
          className="fs-rail-wrap"
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          data-reveal
        >
          <div className="fs-rail">
            {FLASH_DEALS.map((item) => (
              <article key={item.id} className="fs-card">
                {/* Glass image pane */}
                <div
                  className="fs-card-img-wrap"
                  style={{ '--card-wash': item.wash } as React.CSSProperties}
                >
                  <div className="fs-card-img-bg" />
                  <Image
                    src={item.coverImage ?? '/covers/astro-bot.jpg'}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 160px, 200px"
                    className="fs-card-img"
                    draggable={false}
                  />
                  {/* Discount pill */}
                  <span className="fs-discount-pill">−{item.discount}%</span>
                </div>

                {/* Info pane */}
                <div className="fs-card-body">
                  <p className="fs-card-category">{item.label}</p>
                  <h3 className="fs-card-name">{item.name}</h3>
                  <div className="fs-card-pricing">
                    <span className="fs-card-price">{formatTaka(item.price)}</span>
                    <span className="fs-card-original">{formatTaka(item.originalPrice)}</span>
                  </div>
                  <button
                    type="button"
                    className="fs-card-btn"
                    onClick={() => addToCart(item)}
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <ShoppingCart size={12} />
                    <span>Add to cart</span>
                  </button>
                </div>
              </article>
            ))}

            {/* "View all" card */}
            <Link href="/#browse" className="fs-card fs-card--more">
              <div className="fs-card-more-inner">
                <span className="fs-card-more-label">All deals</span>
                <ArrowRight size={20} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

