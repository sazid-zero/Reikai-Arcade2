import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getActiveProductBySlug, groupProductRows } from '@/lib/catalog'
import { SubscriptionDetailClient } from './subscription-detail-client'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const rows = await getActiveProductBySlug(slug)
  const product = groupProductRows(rows)
  if (!product) return { title: 'Subscription | ReiKai Arcade' }
  return {
    title: `${product.name} | ReiKai Arcade Subscriptions`,
    description:
      product.shortDescription ||
      `Buy ${product.name} in Bangladesh. Instant code delivery at the best BDT rates.`,
  }
}

export default async function SubscriptionDetailPage({ params }: Props) {
  const { slug } = await params
  const rows = await getActiveProductBySlug(slug)
  const product = groupProductRows(rows)

  if (!product || product.type !== 'subscription') notFound()

  const typedProduct = {
    ...product,
    features: (product.features as unknown as string[]) ?? [],
    galleryImages: (product.galleryImages as string[]) ?? [],
  }

  return <SubscriptionDetailClient product={typedProduct} />
}
