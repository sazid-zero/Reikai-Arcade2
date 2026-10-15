import { Metadata } from 'next'
import { getActiveCatalog, normalizeProductImageUrl } from '@/lib/catalog'
import GiftCardsClient, { GiftCardProduct } from './gift-cards-client'

export const metadata: Metadata = {
  title: 'Digital Gift Cards | PSN, Steam, Google Play, Apple – ReiKai Arcade',
  description:
    'Buy PlayStation Network (PSN), Steam Wallet, Google Play, Apple iTunes, and Xbox gift card codes instantly with bKash, Nagad, and cards in Bangladesh.',
}

export default async function GiftCardsPage() {
  const rawRows = await getActiveCatalog('giftcard')

  const productMap = new Map<string, GiftCardProduct>()

  for (const row of rawRows) {
    const existing = productMap.get(row.id)
    const price = row.price ?? null

    if (!existing) {
      productMap.set(row.id, {
        id: row.id,
        slug: row.slug,
        name: row.name,
        imageUrl: normalizeProductImageUrl(row.imageUrl, 'giftcard'),
        brand: row.brand,
        platform: row.platform,
        category: row.category,
        shortDescription: row.shortDescription,
        featured: row.featured,
        sortOrder: row.sortOrder,
        minPrice: price,
        maxPrice: price,
      })
    } else if (price !== null) {
      if (existing.minPrice === null || price < existing.minPrice) existing.minPrice = price
      if (existing.maxPrice === null || price > existing.maxPrice) existing.maxPrice = price
    }
  }

  const products = Array.from(productMap.values()).sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
  )

  return <GiftCardsClient products={products} />
}
