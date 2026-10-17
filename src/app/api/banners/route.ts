import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export type BannerSlide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  label?: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  imageUrl: string;
  /** optional: tinted overlay color for the slide, e.g. 'rgba(40,20,80,0.5)' */
  overlayColor?: string;
  active: boolean;
  order: number;
  updatedAt?: string;
};

export type BannersConfig = {
  slides: BannerSlide[];
  autoPlayInterval: number; // ms
  updatedAt?: string;
};

const DEFAULT_CONFIG: BannersConfig = {
  autoPlayInterval: 6000,
  slides: [
    {
      id: 'banner-default-1',
      title: 'PlayStation 5 Slim',
      subtitle: 'Next-Gen Console',
      description: 'The most powerful PlayStation yet — 1TB Ultra-Fast SSD, Ray Tracing, and 4K 120Hz. Now in a sleeker form factor.',
      label: 'Available Now',
      ctaText: 'View Console',
      ctaHref: '/games',
      imageUrl: '/covers/ps5-slim.jpg',
      active: true,
      order: 0,
    },
    {
      id: 'banner-default-2',
      title: 'DualSense Edge™',
      subtitle: 'Pro Controller',
      description: 'Swappable stick modules, remappable back buttons, adjustable trigger travel. Built for those who need the edge.',
      label: 'Pro Hardware',
      ctaText: 'Explore Controller',
      ctaHref: '/accessories',
      imageUrl: '/accessories/dualsense-edge.jpg',
      active: true,
      order: 1,
    },
    {
      id: 'banner-default-3',
      title: 'Instant Top-Ups',
      subtitle: 'Digital Vault',
      description: 'Valorant, PUBG, PSN Wallet, Steam, Xbox Game Pass — all delivered to your account in under 60 seconds.',
      label: 'Instant Delivery',
      ctaText: 'Browse Top-Ups',
      ctaHref: '/top-up',
      imageUrl: '/covers/wallet-50.jpg',
      active: true,
      order: 2,
    },
  ],
};

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'banners.json');

async function getStoredConfig(): Promise<BannersConfig> {
  try {
    const raw = await readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function GET(request: Request) {
  const config = await getStoredConfig();
  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get('all') === 'true';

  const slides = includeAll
    ? config.slides.sort((a, b) => a.order - b.order)
    : config.slides
        .filter((s) => s.active)
        .sort((a, b) => a.order - b.order);

  return NextResponse.json({ ...config, slides });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const updated: BannersConfig = {
      autoPlayInterval:
        typeof body.autoPlayInterval === 'number' ? body.autoPlayInterval : DEFAULT_CONFIG.autoPlayInterval,
      slides: Array.isArray(body.slides)
        ? body.slides.map((s: Partial<BannerSlide>, idx: number) => ({
            id: s.id || `banner-${Date.now()}-${idx}`,
            title: s.title || '',
            subtitle: s.subtitle || '',
            description: s.description || '',
            label: s.label || '',
            ctaText: s.ctaText || 'Explore',
            ctaHref: s.ctaHref || '/',
            secondaryCtaText: s.secondaryCtaText || '',
            secondaryCtaHref: s.secondaryCtaHref || '',
            imageUrl: s.imageUrl || '',
            overlayColor: s.overlayColor || '',
            active: typeof s.active === 'boolean' ? s.active : true,
            order: typeof s.order === 'number' ? s.order : idx,
          }))
        : DEFAULT_CONFIG.slides,
      updatedAt: new Date().toISOString(),
    };

    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(updated, null, 2), 'utf8');

    return NextResponse.json({ success: true, config: updated });
  } catch (err) {
    console.error('Failed to update banners config:', err);
    return NextResponse.json({ error: 'Failed to update banners' }, { status: 500 });
  }
}
