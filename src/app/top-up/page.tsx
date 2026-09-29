'use client';

import { useState } from 'react';
import { ArrowRight, Check, Gamepad2, Zap } from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { useCart } from '@/components/cart-context';

const amounts = [10, 25, 50, 75, 100];

export default function TopUpPage() {
  const [amount, setAmount] = useState(50);
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 lg:px-12">
        <section className="grid gap-10 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#1d1232] via-[#110b20] to-[#08060e] p-7 sm:p-12 lg:grid-cols-[1.05fr_.95fr] lg:p-16">
          <div className="flex flex-col justify-center">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-[#c084fc]">Instant digital delivery</p>
            <h1 className="max-w-2xl font-sans text-5xl font-bold uppercase leading-[.94] tracking-[-.05em] sm:text-7xl">Power your next session.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/60">Top up your PlayStation wallet with a secure digital code. No queues, no waiting — just more room to play.</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/65">
              {['Instant code', 'No expiry', 'Secure checkout'].map((item) => <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><Check size={14} className="text-[#c084fc]" />{item}</span>)}
            </div>
          </div>
          <div className="relative flex min-h-[370px] flex-col justify-between overflow-hidden rounded-3xl border border-[#c084fc]/30 bg-[#0d0917] p-7 shadow-[0_0_80px_rgba(168,85,247,.16)] sm:p-9">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#a855f7]/25 blur-3xl" />
            <div className="relative flex items-center justify-between"><span className="font-mono text-xs uppercase tracking-[.2em] text-white/45">Wallet credit</span><Zap size={20} className="text-[#f0abfc]" /></div>
            <div className="relative"><div className="font-mono text-6xl font-medium text-white">${amount}<span className="text-2xl text-white/35">.00</span></div><p className="mt-3 text-sm text-white/45">PlayStation Store digital wallet</p></div>
            <div className="relative"><div className="mb-4 flex flex-wrap gap-2">{amounts.map((value) => <button key={value} type="button" onClick={() => setAmount(value)} className={`rounded-xl border px-4 py-2 text-sm transition ${amount === value ? 'border-[#c084fc] bg-[#a855f7] text-white' : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'}`}>${value}</button>)}</div><button type="button" onClick={() => addToCart({ id: `wallet-${amount}`, name: `PlayStation Store Wallet / $${amount}`, type: 'top-ups', label: 'Digital top-up', price: amount, glyph: `$${amount}`, wash: 'hsl(290 85% 65% / .3)', rating: 5, reviewsCount: 0, inStock: true, shortDesc: 'Instant digital wallet credit.', fullDesc: 'Instant digital wallet credit.', features: [], specs: [], category: 'top-ups', subCategory: 'Digital Top-ups' })} className="flex w-full items-center justify-between rounded-xl bg-white px-5 py-4 font-semibold text-black transition hover:bg-[#e9d5ff]">Add ${amount} credit <ArrowRight size={18} /></button></div>
          </div>
        </section>
        <section className="mt-14 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><Gamepad2 className="mb-5 text-[#c084fc]" size={22} /><h2 className="font-semibold">Built for play</h2><p className="mt-2 text-sm leading-6 text-white/50">Use credit on games, add-ons and subscriptions.</p></div><div className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><Zap className="mb-5 text-[#c084fc]" size={22} /><h2 className="font-semibold">Delivered instantly</h2><p className="mt-2 text-sm leading-6 text-white/50">Your code is ready as soon as checkout clears.</p></div><div className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><Link href="/gift-cards" className="text-[#c084fc]">Need a gift? <ArrowRight className="inline" size={15} /></Link><p className="mt-2 text-sm leading-6 text-white/50">Send a thoughtful upgrade to another player.</p></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
