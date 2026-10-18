'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMobileMenu } from '@/components/mobile-menu-context';
import { useSearch } from '@/components/search-modal';
import {
  X,
  Search,
  Headphones,
  Gamepad2,
  Zap,
  Crown,
  Gift,
  Heart,
  Package,
  Sparkles,
  ChevronRight,
  User,
  Shield,
  LogOut,
} from 'lucide-react';
import type { AuthUser } from '@/components/user-auth-button';

export function MobileRightSidebar() {
  const { isOpen, closeMenu } = useMobileMenu();
  const { openSearch } = useSearch();
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/auth/me')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/sign-out', { method: 'POST' });
      setUser(null);
      closeMenu();
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const pages = [
    {
      title: 'Accessories',
      subtitle: 'DualSense, headsets & gear',
      href: '/accessories',
      icon: Headphones,
      color: 'text-white/80',
      bgColor: 'bg-white/5 border-white/10',
    },
    {
      title: 'PS5 Games',
      subtitle: 'Exclusives, hits & discs',
      href: '/games',
      icon: Gamepad2,
      color: 'text-white/80',
      bgColor: 'bg-white/5 border-white/10',
    },
    {
      title: 'Game Top-Up',
      subtitle: 'Valorant, PUBG, Genshin',
      href: '/top-up',
      icon: Zap,
      color: 'text-white/80',
      bgColor: 'bg-white/5 border-white/10',
    },
    {
      title: 'Subscriptions',
      subtitle: 'PS Plus, Game Pass & EA',
      href: '/subscriptions',
      icon: Crown,
      color: 'text-white/80',
      bgColor: 'bg-white/5 border-white/10',
    },
    {
      title: 'Gift Cards',
      subtitle: 'PSN, Steam, Google & Apple',
      href: '/gift-cards',
      icon: Gift,
      color: 'text-white/80',
      bgColor: 'bg-white/5 border-white/10',
    },
  ];

  const quickLinks = [
    {
      title: 'Hot Offers & Drops',
      href: '/#browse',
      icon: Sparkles,
      color: 'text-white/60',
    },
    {
      title: 'Track Orders',
      href: '/orders',
      icon: Package,
      color: 'text-white/60',
    },
    {
      title: 'My Wishlist',
      href: '/wishlist',
      icon: Heart,
      color: 'text-white/60',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[290] bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
        aria-hidden={!isOpen}
      />

      {/* Right Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-[84vw] max-w-[340px] z-[300] bg-[#000000] border-l border-white/10 shadow-[-16px_0_48px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Sidebar Navigation"
        aria-modal="true"
      >
        {/* Top Header inside sidebar */}
        <div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-2.5 shrink-0"
            >
              <img
                src="/videos/reikai_logo.jpeg"
                alt="Reikai Arcade"
                className="w-8 h-8 rounded-lg object-cover border border-white/20 shadow-lg"
              />
              <span className="font-['Outfit'] font-black tracking-[0.14em] text-white text-sm">
                REIKAI <span className="text-white/60">ARCADE</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={closeMenu}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition active:scale-95 cursor-pointer"
              aria-label="Close menu"
              data-testid="sidebar-close-btn"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Search Trigger */}
          <div className="p-4 border-b border-white/5">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                openSearch();
              }}
              className="w-full h-10 px-3.5 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/20 flex items-center justify-between text-xs text-zinc-400 transition"
              data-testid="sidebar-search-trigger"
            >
              <span className="font-['DM_Mono'] truncate">Search games, accessories...</span>
              <Search size={15} className="text-white/60 shrink-0 ml-2" />
            </button>
          </div>

          {/* BROWSE CATEGORIES / PAGES */}
          <div className="px-3 py-3">
            <span className="block px-3 text-[10px] font-bold uppercase tracking-wider font-['DM_Mono'] text-zinc-400 mb-2">
              Browse Categories
            </span>
            <div className="space-y-1">
              {pages.map((p) => {
                const Icon = p.icon;
                const isActive = pathname.startsWith(p.href);
                return (
                  <Link
                    key={p.title}
                    href={p.href}
                    onClick={closeMenu}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition group ${
                      isActive ? 'bg-white/10 border border-white/20 text-white' : 'hover:bg-white/5 text-zinc-200'
                    }`}
                    data-testid={`sidebar-page-${p.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${p.bgColor} ${p.color}`}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-white transition">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-zinc-400">{p.subtitle}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-zinc-500 group-hover:text-white transition" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="px-3 py-2 border-t border-white/5">
            <span className="block px-3 text-[10px] font-bold uppercase tracking-wider font-['DM_Mono'] text-zinc-400 mb-2">
              Quick Links
            </span>
            <div className="space-y-1">
              {quickLinks.map((q) => {
                const Icon = q.icon;
                const isActive = pathname === q.href;
                return (
                  <Link
                    key={q.title}
                    href={q.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                      isActive ? 'bg-white/10 text-white font-semibold' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                    }`}
                    data-testid={`sidebar-link-${q.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon size={16} className={q.color} />
                    <span>{q.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM USER PROFILE / SIGN IN */}
        <div className="p-4 border-t border-white/10 bg-black/40">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-black text-xs shrink-0 shadow-md">
                    {(user.name || user.email || 'U').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{user.name || 'Player'}</p>
                    <p className="text-[10px] font-['DM_Mono'] text-zinc-400 truncate">
                      {user.phone || user.email}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-['DM_Mono'] font-bold px-1.5 py-0.5 rounded ${
                    user.role === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-white/10 text-white border border-white/15'
                  }`}
                >
                  {user.role === 'admin' ? 'ADMIN' : 'MEMBER'}
                </span>
              </div>

              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/25 transition"
                >
                  <Shield size={14} />
                  <span>Admin Control Room</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-red-400 hover:border-red-400/30 hover:bg-red-500/10 text-xs font-semibold transition cursor-pointer"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/sign-in"
                onClick={closeMenu}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-black font-['DM_Mono'] font-bold text-xs tracking-wider uppercase shadow-lg transition hover:bg-zinc-200 active:scale-98 cursor-pointer"
                data-testid="sidebar-sign-in"
              >
                <User size={14} />
                <span>SIGN IN / JOIN</span>
              </Link>
              <p className="text-[11px] text-zinc-400 text-center font-['DM_Mono']">
                Access saved orders, drops &amp; rewards
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
