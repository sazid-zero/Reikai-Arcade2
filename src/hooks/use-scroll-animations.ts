'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Runs once on mount. Wires up:
 *  - Staggered reveal-up animations for [data-reveal] elements
 *  - Parallax on [data-parallax] elements (depth controlled by data-speed)
 *  - Section background colour shifts
 *  - Horizontal marquee speed boost on scroll velocity
 *  - Counter number animations for .hero-stat strong elements
 */
export default function useScrollAnimations(reducedMotion: boolean) {
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {

      /* ─── 1. REVEAL: every [data-reveal] staggered fade+slide ──────── */
      const revealGroups = gsap.utils.toArray<HTMLElement>('[data-reveal-group]');
      revealGroups.forEach((group) => {
        const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', group);
        gsap.fromTo(
          items,
          { y: 48, opacity: 0, filter: 'blur(4px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.12,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      /* ─── Standalone [data-reveal] (outside groups) ─────────────────── */
      const soloReveals = gsap.utils.toArray<HTMLElement>('[data-reveal]:not([data-reveal-group] [data-reveal])');
      soloReveals.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      /* ─── 2. PARALLAX: [data-parallax] layers ────────────────────────── */
      const parallaxEls = gsap.utils.toArray<HTMLElement>('[data-parallax]');
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax ?? '0.25');
        const dir = el.dataset.parallaxDir === 'down' ? 1 : -1;
        gsap.to(el, {
          yPercent: dir * speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      /* ─── 3. HERO NUMBER COUNTERS ────────────────────────────────────── */
      const stats = gsap.utils.toArray<HTMLElement>('.hero-stat strong');
      stats.forEach((el) => {
        const target = parseInt(el.textContent ?? '0', 10);
        gsap.fromTo(
          el,
          { textContent: 0 },
          {
            textContent: target,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            scrollTrigger: { trigger: el, start: 'top 90%' },
            onUpdate() {
              const val = Math.round(parseFloat(el.textContent ?? '0'));
              el.textContent = String(val).padStart(2, '0');
            },
          }
        );
      });

      /* ─── 4. SECTION KICKERS: letter-by-letter reveal ───────────────── */
      const kickers = gsap.utils.toArray<HTMLElement>('.section-kicker');
      kickers.forEach((el) => {
        const text = el.textContent ?? '';
        el.innerHTML = text
          .split('')
          .map((ch) => `<span style="display:inline-block">${ch === ' ' ? '&nbsp;' : ch}</span>`)
          .join('');
        gsap.fromTo(
          el.querySelectorAll('span'),
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.025,
            duration: 0.45,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      /* ─── 5. CATEGORY ROW hover-line stagger ────────────────────────── */
      const categoryRows = gsap.utils.toArray<HTMLElement>('.category-row');
      gsap.fromTo(
        categoryRows,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.category-list',
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* ─── 6. FEATURE CARDS: stacked slide-in ────────────────────────── */
      const featureCards = gsap.utils.toArray<HTMLElement>('.feature-card');
      featureCards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0, rotate: i === 0 ? 14 : -12 },
          {
            y: 0,
            opacity: 1,
            rotate: i === 0 ? 5 : -7,
            duration: 1.1,
            ease: 'expo.out',
            delay: i * 0.15,
            scrollTrigger: {
              trigger: '.feature-stack',
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      /* ─── 7. PRODUCT CARDS: grid cascade ────────────────────────────── */
      const productCards = gsap.utils.toArray<HTMLElement>('.product-card');
      gsap.fromTo(
        productCards,
        { y: 60, opacity: 0, scale: 0.94 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: { amount: 0.5, grid: 'auto', from: 'start' },
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.product-grid',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* ─── 8. CATEGORY ART: parallax inner content ───────────────────── */
      gsap.to('.category-art::before', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.category-art',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      /* ─── 9. SIGNAL SECTION: horizontal slide ───────────────────────── */
      gsap.fromTo(
        '.signal-inner > *',
        { x: (i) => (i % 2 === 0 ? -60 : 60), opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.signal-section',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      /* ─── 10. MARQUEE: speed up on scroll velocity ──────────────────── */
      const track = document.querySelector<HTMLElement>('.marquee-track');
      if (track) {
        ScrollTrigger.create({
          trigger: '.marquee',
          start: 'top bottom',
          end: 'bottom top',
          onUpdate(self) {
            const speed = 1 + Math.abs(self.getVelocity()) / 2000;
            track.style.animationDuration = `${Math.max(6, 23 / speed)}s`;
          },
        });
      }

    });

    return () => ctx.revert();
  }, [reducedMotion]);
}
