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
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl p-8 shadow-2xl">
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 text-white shadow-lg">
            <Heart size={36} className="text-white/80" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Your Wishlist is <span className="text-zinc-400">Currently Empty</span>
          </h1>
          <p className="mt-3 max-w-md text-sm text-zinc-400 leading-relaxed">
            Save your favorite PS5 games, gaming gear, direct top-ups, and subscription passes for later. Tap the heart icon on any product to save it here.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 transition shadow-lg"
            >
              <Gamepad2 size={15} />
              <span>Explore Games</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/accessories"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-wider text-zinc-300 border border-white/15 bg-white/5 hover:bg-white/10 hover:text-white transition"
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
