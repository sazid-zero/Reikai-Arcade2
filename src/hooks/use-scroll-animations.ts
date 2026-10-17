'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * High-performance, hardware-accelerated scroll entrance animations.
 *
 * Rules:
 * - Elements animate in smoothly when scrolling down into view (start: 'top 82%').
 * - Once in view, elements STAY VISIBLE while user is in the section (onLeave: 'none').
 * - Elements STAY VISIBLE when scrolling up through the section (onEnterBack: 'none').
 * - Only when scrolled all the way back up ABOVE the section does it reset (onLeaveBack: 'reverse').
 *   -> This allows re-triggering entrance animations on subsequent scroll-downs without vanishing mid-section!
 */
export default function useScrollAnimations(reducedMotion: boolean) {
  useEffect(() => {
    if (reducedMotion) return;

    // Small timeout to allow DOM layout / Next.js hydration to stabilize
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

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
            y: (i) => (i === 1 ? 28 : 16),
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.09,
            duration: 0.8,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: head,
              start: 'top 82%',
              // onEnter: play, onLeave: none (never disappear!), onEnterBack: none, onLeaveBack: reverse (reset when scrolled away above)
              toggleActions: 'play none none reverse',
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
            { y: 26, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.8,
              ease: 'power3.out',
              force3D: true,
              scrollTrigger: {
                trigger: wrapper,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
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
          { y: 30, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.05,
            duration: 0.65,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: '.sf-cat-grid',
              start: 'top 82%',
              toggleActions: 'play none none reverse',
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
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: {
                amount: Math.min(0.28, cards.length * 0.03),
                grid: 'auto',
                from: 'start',
              },
              duration: 0.6,
              ease: 'power3.out',
              force3D: true,
              scrollTrigger: {
                trigger: grid,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
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
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.07,
            duration: 0.65,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: trustPillars[0].parentElement ?? trustPillars[0],
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [reducedMotion]);
}
