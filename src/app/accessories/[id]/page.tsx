import { notFound } from 'next/navigation'
import { getActiveProductBySlug, groupProductRows, getActiveCatalog } from '@/lib/catalog'
import { AccessoryDetailClient } from './accessory-detail-client'

type Props = { params: Promise<{ id: string }> }

export default async function AccessoryDetailPage({ params }: Props) {
  const { id: slug } = await params

  const [rows, relatedRows] = await Promise.all([
    getActiveProductBySlug(slug),
    getActiveCatalog('accessory'),
  ])

  const accessory = groupProductRows(rows)
  if (!accessory || accessory.type !== 'accessory') notFound()

  const relatedMap = new Map<string, { id: string; slug: string; name: string; imageUrl: string | null; brand: string | null; category: string | null; price: number | null }>()
  for (const row of relatedRows) {
    if (row.id !== accessory.id && !relatedMap.has(row.id)) {
      relatedMap.set(row.id, {
        id: row.id,
        slug: row.slug,
        name: row.name,
        imageUrl: row.imageUrl,
        brand: row.brand,
        category: row.category,
        price: row.price,
      })
    }
  }
  const relatedAccessories = Array.from(relatedMap.values()).slice(0, 4)

  return (
    <AccessoryDetailClient
      accessory={{
        ...accessory,
        galleryImages: (accessory.galleryImages as string[] | null) ?? [],
        tags: (accessory.tags as string[] | null) ?? [],
        features: (accessory.features as string[] | null) ?? [],
        specs: (accessory.specs as Record<string, string> | null) ?? {},
      }}
      relatedAccessories={relatedAccessories}
    />
  )
}
