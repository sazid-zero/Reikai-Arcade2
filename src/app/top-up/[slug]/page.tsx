import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getActiveProductBySlug, groupProductRows } from '@/lib/catalog'
import { TopUpDetailClient } from './top-up-detail-client'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const rows = await getActiveProductBySlug(slug)
  const product = groupProductRows(rows)
  if (!product) return { title: 'Top-Up | ReiKai Arcade' }
  return {
    title: `${product.name} Top-Up | ReiKai Arcade`,
    description:
      product.shortDescription ||
      `Buy ${product.name} packages in Bangladesh at the best BDT rates. Instant delivery.`,
  }
}

export default async function TopUpDetailPage({ params }: Props) {
  const { slug } = await params
  const rows = await getActiveProductBySlug(slug)
  const product = groupProductRows(rows)

  if (!product || product.type !== 'topup') notFound()

  const typedProduct = {
    ...product,
    features: (product.features as unknown as string[]) ?? [],
    galleryImages: (product.galleryImages as string[]) ?? [],
  }

  return <TopUpDetailClient product={typedProduct} />
}
