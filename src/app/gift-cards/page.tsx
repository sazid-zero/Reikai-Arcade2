'use client';

import { useState } from 'react';
import { ArrowRight, Gift, Sparkles } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { useCart } from '@/components/cart-context';

const values = [25, 50, 100, 150];

export default function GiftCardsPage() {
  const [value, setValue] = useState(50);
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground"><SiteHeader /><main className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 lg:px-12"><section className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]"><div className="flex flex-col justify-center"><p className="mb-5 font-mono text-xs uppercase tracking-[.28em] text-[#c084fc]">The perfect drop</p><h1 className="font-sans text-5xl font-bold uppercase leading-[.94] tracking-[-.05em] sm:text-7xl">Give them a new world.</h1><p className="mt-6 max-w-lg text-base leading-7 text-white/60">A Reikai Arcade gift card lets them choose the gear, games and upgrades already on their wishlist.</p><div className="mt-8 flex items-center gap-3 text-sm text-white/50"><Gift size={20} className="text-[#f0abfc]" />A better kind of surprise.</div></div><div className="relative overflow-hidden rounded-[2rem] border border-[#c084fc]/30 bg-gradient-to-br from-[#a855f7] via-[#5b21b6] to-[#12091f] p-7 shadow-[0_0_90px_rgba(168,85,247,.2)] sm:p-12"><Sparkles className="absolute right-10 top-9 text-white/60" size={22} /><div className="flex min-h-[390px] flex-col justify-between"><div><p className="font-mono text-xs uppercase tracking-[.28em] text-white/60">Reikai Arcade</p><h2 className="mt-4 max-w-md text-4xl font-bold uppercase leading-none sm:text-6xl">For the next level.</h2></div><div><p className="font-mono text-6xl font-medium text-white">${value}<span className="text-2xl text-white/45">.00</span></p><div className="mt-7 flex flex-wrap gap-2">{values.map((item) => <button key={item} type="button" onClick={() => setValue(item)} className={`rounded-xl border px-4 py-2 text-sm transition ${value === item ? 'border-white bg-white text-[#5b21b6]' : 'border-white/25 bg-black/10 text-white/75 hover:bg-white/10'}`}>${item}</button>)}</div><button type="button" onClick={() => addToCart({ id: `gift-card-${value}`, name: `Reikai Arcade Gift Card / $${value}`, type: 'top-ups', label: 'Gift card', price: value, glyph: 'GIFT', wash: 'hsl(285 85% 72% / .3)', rating: 5, reviewsCount: 0, inStock: true, shortDesc: 'A flexible digital gift card.', fullDesc: 'A flexible digital gift card.', features: [], specs: [], category: 'top-ups', subCategory: 'Gift Cards' })} className="mt-5 flex w-full items-center justify-between rounded-xl bg-white px-5 py-4 font-semibold text-black transition hover:bg-[#f3e8ff]">Add gift card <ArrowRight size={18} /></button></div></div></div></section></main><SiteFooter /></div>
  );
}
