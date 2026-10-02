import { getActiveCatalog } from '@/lib/catalog'
import AccessoriesPageClient from './accessories-client'

export default async function AccessoriesPage() {
  const rawProducts = await getActiveCatalog('accessory')

  const productMap = new Map<string, {
    id: string
    slug: string
    name: string
    type: string
    shortDescription: string | null
    description: string | null
    brand: string | null
    platform: string | null
    category: string | null
    imageUrl: string | null
    galleryImages: string[]
    tags: string[]
    features: string[]
    specs: Record<string, string>
    rating: number
    reviewCount: number
    featured: boolean
    sortOrder: number
    variants: Array<{
      id: string | null
      title: string | null
      sku: string | null
      price: number | null
      compareAtPrice: number | null
      stockQuantity: number | null
    }>
  }>()

  for (const row of rawProducts) {
    if (!productMap.has(row.id)) {
      productMap.set(row.id, {
        id: row.id,
        slug: row.slug,
        name: row.name,
        type: row.type,
        shortDescription: row.shortDescription,
        description: row.description,
        brand: row.brand,
        platform: row.platform,
        category: row.category,
        imageUrl: row.imageUrl,
        galleryImages: (row.galleryImages as string[] | null) ?? [],
        tags: (row.tags as string[] | null) ?? [],
        features: (row.features as string[] | null) ?? [],
        specs: (row.specs as Record<string, string> | null) ?? {},
        rating: row.rating,
        reviewCount: row.reviewCount,
        featured: row.featured,
        sortOrder: row.sortOrder,
        variants: [],
      })
    }
    if (row.variantId) {
      productMap.get(row.id)!.variants.push({
        id: row.variantId,
        title: row.variantTitle,
        sku: row.sku,
        price: row.price,
        compareAtPrice: row.compareAtPrice,
        stockQuantity: row.stockQuantity,
      })
    }
  }

  const accessories = Array.from(productMap.values())
  return <AccessoriesPageClient accessories={accessories} />
}
