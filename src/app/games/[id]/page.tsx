import { notFound } from 'next/navigation'
import { getActiveProductBySlug, groupProductRows } from '@/lib/catalog'
import { GameDetailClient } from './game-detail-client'
import { getActiveCatalog } from '@/lib/catalog'

type Props = { params: Promise<{ id: string }> }

export default async function GameDetailPage({ params }: Props) {
  const { id: slug } = await params

  const [rows, relatedRows] = await Promise.all([
    getActiveProductBySlug(slug),
    getActiveCatalog('game'),
  ])

  const game = groupProductRows(rows)
  if (!game || game.type !== 'game') notFound()

  // Build related games (unique products, excluding current)
  const relatedMap = new Map<string, { id: string; slug: string; name: string; imageUrl: string | null; category: string | null; platform: string | null; price: number | null }>()
  for (const row of relatedRows) {
    if (row.id !== game.id && !relatedMap.has(row.id)) {
      relatedMap.set(row.id, {
        id: row.id,
        slug: row.slug,
        name: row.name,
        imageUrl: row.imageUrl,
        category: row.category,
        platform: row.platform,
        price: row.price,
      })
    }
  }
  const relatedGames = Array.from(relatedMap.values()).slice(0, 4)

  return (
    <GameDetailClient
      game={{
        ...game,
        galleryImages: (game.galleryImages as string[] | null) ?? [],
        tags: (game.tags as string[] | null) ?? [],
        features: (game.features as string[] | null) ?? [],
        specs: game.specs as Record<string, string> | null ?? {},
      }}
      relatedGames={relatedGames}
    />
  )
}
