import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getActiveProductBySlug, groupProductRows } from '@/lib/catalog'
import { GiftCardDetailClient } from './gift-card-detail-client'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const rows = await getActiveProductBySlug(slug)
  const product = groupProductRows(rows)
  if (!product) return { title: 'Gift Card | ReiKai Arcade' }
  return {
    title: `${product.name} | ReiKai Arcade Gift Cards`,
    description:
      product.shortDescription ||
      `Buy ${product.name} in Bangladesh at the best BDT rates. Instant code delivery.`,
  }
}

export default async function GiftCardDetailPage({ params }: Props) {
  const { slug } = await params
  const rows = await getActiveProductBySlug(slug)
  const product = groupProductRows(rows)

  if (!product || product.type !== 'giftcard') notFound()

  const typedProduct = {
    ...product,
    features: (product.features as unknown as string[]) ?? [],
    galleryImages: (product.galleryImages as string[]) ?? [],
  }

  return <GiftCardDetailClient product={typedProduct} />
}
