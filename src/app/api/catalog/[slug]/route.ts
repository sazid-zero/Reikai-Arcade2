import { NextResponse } from 'next/server'
import { getActiveProductBySlug } from '@/lib/catalog'

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getActiveProductBySlug(slug)

  if (product.length === 0) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json(product, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
