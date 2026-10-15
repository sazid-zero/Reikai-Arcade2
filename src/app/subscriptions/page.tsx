import { Metadata } from 'next'
import { getActiveCatalog, normalizeProductImageUrl } from '@/lib/catalog'
import SubscriptionsClient, { SubscriptionProduct } from './subscriptions-client'

export const metadata: Metadata = {
  title: 'Gaming Subscriptions | PS Plus, Game Pass, EA Play – ReiKai Arcade',
  description:
    'Buy PlayStation Plus Essential / Extra / Premium, Xbox Game Pass Ultimate, EA Play, Nintendo Online & Apple Arcade codes at Bangladesh’s best BDT rates. Instant delivery.',
}

export default async function SubscriptionsPage() {
  const rawRows = await getActiveCatalog('subscription')

  const productMap = new Map<string, SubscriptionProduct>()

  for (const row of rawRows) {
    const existing = productMap.get(row.id)
    const price = row.price ?? null

    if (!existing) {
      productMap.set(row.id, {
        id: row.id,
        slug: row.slug,
        name: row.name,
        imageUrl: normalizeProductImageUrl(row.imageUrl, 'subscription'),
        brand: row.brand,
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

  return <SubscriptionsClient products={products} />
}
