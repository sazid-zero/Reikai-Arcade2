import { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Heart, Sparkles, ArrowRight, Gamepad2, ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Wishlist | ReiKai Arcade',
  description: 'Your saved favorite games, accessories, passes, and digital top-ups.',
};

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#f4f2ff]">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl p-8 shadow-2xl">
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c673e2]/20 to-[#4b22d2]/20 border border-[#c673e2]/30 text-[#c673e2] shadow-[0_0_30px_rgba(198,115,226,0.3)]">
            <Heart size={36} className="fill-[#c673e2]/40 text-[#c673e2]" />
            <Sparkles size={16} className="absolute -top-1 -right-1 text-[#a0e4f1]" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Your Wishlist is <span className="bg-gradient-to-r from-[#c673e2] via-[#a0e4f1] to-[#5ba2c0] bg-clip-text text-transparent">Currently Empty</span>
          </h1>
          <p className="mt-3 max-w-md text-sm text-zinc-400 leading-relaxed">
            Save your favorite PS5 games, gaming gear, direct top-ups, and subscription passes for later. Tap the heart icon on any product to save it here.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#4b22d2] via-[#c673e2] to-[#a0e4f1] hover:opacity-90 transition shadow-[0_0_20px_rgba(160,228,241,0.35)]"
            >
              <Gamepad2 size={15} />
              <span>Explore Games</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/accessories"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider text-zinc-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition"
            >
              <ShoppingBag size={15} />
              <span>Browse Accessories</span>
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
