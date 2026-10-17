'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * High-performance, hardware-accelerated scroll entrance animations.
 * - Always re-animates on scroll in both directions (toggleActions: 'play reverse play reverse')
 * - Pure GPU transforms (translate3d, opacity) without expensive filter:blur re-rasterization
 * - Targeted to current storefront sections, titles, and banner items
 */
export default function useScrollAnimations(reducedMotion: boolean) {
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      /* ─── 1. SECTION HEADERS & TITLES: Hero-style upward cascade ──────── */
      const sectionHeads = gsap.utils.toArray<HTMLElement>(
        '.sf-section-head, .sf-browse-head, .sf-signal-copy, .section-head'
      );

      sectionHeads.forEach((head) => {
        const label = head.querySelector('.sf-label');
        const title = head.querySelector('.sf-title, .sf-signal-title, h2');
        const desc = head.querySelector('.sf-signal-sub, p:not(.sf-label)');

        const targets = [label, title, desc].filter(Boolean) as HTMLElement[];
        if (targets.length === 0) return;

        gsap.fromTo(
          targets,
          {
            y: (i) => (i === 1 ? 32 : 20),
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.85,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: head,
              start: 'top 90%',
              end: 'bottom 5%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      });

      /* ─── 2. BANNER CAROUSEL ITEMS: Hero-like staggered entrance ──────── */
      const bannerWrappers = gsap.utils.toArray<HTMLElement>('.hbc-wrapper, .hbc-section');
      bannerWrappers.forEach((wrapper) => {
        const items = wrapper.querySelectorAll<HTMLElement>(
          '.hbc-label, .hbc-title, .hbc-subtitle, .hbc-desc, .hbc-actions'
        );
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.75,
              ease: 'power3.out',
              force3D: true,
              scrollTrigger: {
                trigger: wrapper,
                start: 'top 88%',
                end: 'bottom 8%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        }
      });

      /* ─── 3. CATEGORY CARDS: Staggered entry from center ───────────────── */
      const catCards = gsap.utils.toArray<HTMLElement>('.sf-cat-card');
      if (catCards.length > 0) {
        gsap.fromTo(
          catCards,
          { y: 36, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.06,
            duration: 0.7,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: '.sf-cat-grid',
              start: 'top 90%',
              end: 'bottom 10%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }

      /* ─── 4. SHELF & PRODUCT CARDS: Butter-smooth cascade ─────────────── */
      const productGrids = gsap.utils.toArray<HTMLElement>('.product-grid, .product-shelf-track');
      productGrids.forEach((grid) => {
        const cards = grid.querySelectorAll<HTMLElement>('.standard-product-card, .product-shelf-card');
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: {
                amount: Math.min(0.35, cards.length * 0.04),
                grid: 'auto',
                from: 'start',
              },
              duration: 0.65,
              ease: 'power3.out',
              force3D: true,
              scrollTrigger: {
                trigger: grid,
                start: 'top 92%',
                end: 'bottom 8%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        }
      });

      /* ─── 5. TRUST PILLARS & TUTORIAL CARDS: Staggered rise ───────────── */
      const trustPillars = gsap.utils.toArray<HTMLElement>('.trust-pillar-card, .tutorial-card');
      if (trustPillars.length > 0) {
        gsap.fromTo(
          trustPillars,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.7,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: trustPillars[0].parentElement ?? trustPillars[0],
              start: 'top 90%',
              end: 'bottom 8%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [reducedMotion]);
}
