import { Metadata } from 'next'
import { getActiveCatalog, normalizeProductImageUrl } from '@/lib/catalog'
import TopUpClient, { TopUpProduct } from './top-up-client'

export const metadata: Metadata = {
  title: 'Game Top-Up | ReiKai Arcade – Best Rates in Bangladesh',
  description:
    'Top up Valorant, PUBG Mobile, Genshin Impact, Free Fire, Steam, PSN, Xbox and more. Instant digital delivery in Bangladesh.',
}

export default async function TopUpPage() {
  const rawRows = await getActiveCatalog('topup')

  // Group rows by product id (left join duplicates rows per variant)
  const productMap = new Map<string, TopUpProduct>()

  for (const row of rawRows) {
    const existing = productMap.get(row.id)
    const price = row.price ?? null

    if (!existing) {
      productMap.set(row.id, {
        id: row.id,
        slug: row.slug,
        name: row.name,
        imageUrl: normalizeProductImageUrl(row.imageUrl, 'topup'),
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

  return <TopUpClient products={products} />
}
