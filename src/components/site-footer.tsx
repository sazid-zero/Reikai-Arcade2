'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Zap, CheckCircle2 } from 'lucide-react';

const SOCIAL_LINKS = [
  {
    name: 'Telegram',
    url: 'https://t.me/+FC61q-YqmlMzYTM1',
    hoverClass: 'hover:text-[#229ED9] hover:border-[#229ED9]/50 hover:bg-[#229ED9]/15 hover:shadow-[0_0_15px_rgba(34,158,217,0.35)]',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/share/194VfaAXpd/?mibextid=wwXIfr',
    hoverClass: 'hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/15 hover:shadow-[0_0_15px_rgba(24,119,242,0.35)]',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    url: 'https://chat.whatsapp.com/EirrvoFbR1FFtkg6rEl4Z4?mode=gi_t',
    hoverClass: 'hover:text-[#25D366] hover:border-[#25D366]/50 hover:bg-[#25D366]/15 hover:shadow-[0_0_15px_rgba(37,211,102,0.35)]',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.165 8.165 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.43 0-2.83-.37-4.07-1.08l-.29-.17-3.03.79.81-2.95-.19-.3a8.196 8.196 0 0 1-1.25-4.35c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
      </svg>
    ),
  },
  {
    name: 'Messenger',
    url: 'https://www.messenger.com/channel/reikaistore',
    hoverClass: 'hover:text-[#00B2FF] hover:border-[#00B2FF]/50 hover:bg-[#00B2FF]/15 hover:shadow-[0_0_15px_rgba(0,178,255,0.35)]',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.518 3.735 7.208V22l3.39-1.86c.915.253 1.884.39 2.875.39 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.066 12.443l-2.723-2.905-5.313 2.905 5.845-6.205 2.792 2.905 5.244-2.905-5.845 6.205z" />
      </svg>
    ),
  },
  {
    name: 'Discord',
    url: 'https://discord.gg/ayCbfVs3T',
    hoverClass: 'hover:text-[#5865F2] hover:border-[#5865F2]/50 hover:bg-[#5865F2]/15 hover:shadow-[0_0_15px_rgba(88,101,242,0.35)]',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand & Community Column */}
          <div className="footer-brand-col">
            <div className="footer-brand-info">
              <Link
                href="/"
                className="wordmark border-0 bg-transparent p-0 cursor-pointer flex items-center gap-2.5"
                data-testid="button-footer-home"
              >
                <img
                  src="/logo.jpeg"
                  alt="Reikai Arcade"
                  className="w-8 h-8 rounded-lg object-cover border border-white/20 shadow-lg transition-transform duration-300 hover:scale-105"
                />
                <span className="wordmark-text font-['Outfit'] font-black tracking-[0.14em] text-white text-base">
                  REIKAI <span className="wordmark-highlight text-white/60">ARCADE</span>
                </span>
              </Link>

              <p className="footer-blurb">
                Bangladesh’s premier destination for genuine PlayStation hardware, pro controllers, high-fidelity audio, and instant digital gaming vouchers.
              </p>
            </div>

            <div className="footer-brand-extras">
              {/* Social Media Link Badges */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-['DM_Mono'] mb-2.5">
                  Official Channels &amp; Community
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-400 transition-all duration-200 ${item.hoverClass}`}
                      aria-label={`Visit our ${item.name}`}
                      title={item.name}
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Trust Markers */}
              <div className="mt-4 flex flex-col gap-1.5 text-xs text-zinc-400 font-['DM_Mono']">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 size={13} className="text-white/70 shrink-0" />
                  <span>100% Genuine Hardware &amp; Vouchers</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <Zap size={13} className="text-white/70 shrink-0" />
                  <span>Fast Digital Top-Up Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Navigation Columns (Full-width balanced grid) */}
          <div className="footer-links">
            <div className="footer-col">
              <h3>Store Catalog</h3>
              <Link href="/games">PS5 Games</Link>
              <Link href="/accessories">Accessories &amp; Gear</Link>
              <Link href="/top-up">Game Top-Up</Link>
              <Link href="/subscriptions">Subscriptions &amp; Passes</Link>
              <Link href="/gift-cards">Digital Gift Cards</Link>
              <Link href="/#browse">Featured Drops</Link>
            </div>

            <div className="footer-col">
              <h3>Customer Care</h3>
              <Link href="/orders">Track Your Order</Link>
              <Link href="/cart">Shopping Cart</Link>
              <Link href="/wishlist">Saved Wishlist</Link>
              <Link href="/#tutorial-title">How To Order (Video Guide)</Link>
              <a href="https://chat.whatsapp.com/EirrvoFbR1FFtkg6rEl4Z4?mode=gi_t" target="_blank" rel="noopener noreferrer" className="group">
                <span>WhatsApp Support</span>
                <ArrowUpRight size={12} className="opacity-60 group-hover:opacity-100 transition shrink-0" />
              </a>
              <a href="https://www.messenger.com/channel/reikaistore" target="_blank" rel="noopener noreferrer" className="group">
                <span>Messenger Helpdesk</span>
                <ArrowUpRight size={12} className="opacity-60 group-hover:opacity-100 transition shrink-0" />
              </a>
            </div>

            <div className="footer-col">
              <h3>Direct Community</h3>
              <a href="https://t.me/+FC61q-YqmlMzYTM1" target="_blank" rel="noopener noreferrer" className="group">
                <span>Telegram Community</span>
                <ArrowUpRight size={12} className="opacity-60 group-hover:opacity-100 transition shrink-0" />
              </a>
              <a href="https://discord.gg/ayCbfVs3T" target="_blank" rel="noopener noreferrer" className="group">
                <span>Discord Server</span>
                <ArrowUpRight size={12} className="opacity-60 group-hover:opacity-100 transition shrink-0" />
              </a>
              <a href="https://www.facebook.com/share/194VfaAXpd/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="group">
                <span>Facebook Page</span>
                <ArrowUpRight size={12} className="opacity-60 group-hover:opacity-100 transition shrink-0" />
              </a>
              <a href="https://chat.whatsapp.com/EirrvoFbR1FFtkg6rEl4Z4?mode=gi_t" target="_blank" rel="noopener noreferrer" className="group">
                <span>WhatsApp Channel</span>
                <ArrowUpRight size={12} className="opacity-60 group-hover:opacity-100 transition shrink-0" />
              </a>
              <a href="https://www.messenger.com/channel/reikaistore" target="_blank" rel="noopener noreferrer" className="group">
                <span>Messenger Channel</span>
                <ArrowUpRight size={12} className="opacity-60 group-hover:opacity-100 transition shrink-0" />
              </a>
            </div>

            <div className="footer-col">
              <h3>Security &amp; Terms</h3>
              <p className="my-2.5 text-zinc-400 text-[13px] leading-relaxed">
                All physical items are authentic Sony PlayStation products. Digital vouchers are delivered directly with verifiable codes.
              </p>
              <div className="pt-2 flex flex-col gap-2 text-zinc-400 text-xs font-['DM_Mono']">
                <span className="flex items-center gap-1.5"><span className="text-white/70">✓</span> Authorized Retail Standard</span>
                <span className="flex items-center gap-1.5"><span className="text-white/70">✓</span> Verified Payment Processing</span>
                <span className="flex items-center gap-1.5"><span className="text-white/70">✓</span> Nationwide Fast Courier</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <span>© 2026 REIKAI ARCADE. ALL RIGHTS RESERVED.</span>
          <span className="footer-disclaimer">
            GENUINE SONY PLAYSTATION HARDWARE · INSTANT DIGITAL DELIVERY · VERIFIED SECURE CHECKOUT
          </span>
        </div>
      </div>
    </footer>
  );
}
