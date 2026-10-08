import { twMerge } from 'tailwind-merge';

import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeProductImageUrl(url?: string | null, type?: string | null): string {
  if (!url) {
    return type === 'accessory' ? '/accessories/dualsense-edge.jpg' : '/covers/astro-bot.jpg'
  }
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/covers/') || url.startsWith('/accessories/') || url.startsWith('/uploads/')) {
    return url
  }
  if (url.startsWith('/banner-') || url.startsWith('/cat-') || url.startsWith('/hero-')) {
    return url
  }
  const clean = url.startsWith('/') ? url : `/${url}`
  const filename = clean.replace(/^\//, '')
  if (type === 'accessory') {
    return `/accessories/${filename}`
  }
  return `/covers/${filename}`
}
