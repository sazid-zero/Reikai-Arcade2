import { NextResponse } from 'next/server'
import { getActiveCatalog } from '@/lib/catalog'

export async function GET(request: Request) {
  const type = new URL(request.url).searchParams.get('type')
  const catalogType = type === 'game' || type === 'accessory' ? type : undefined
  const products = await getActiveCatalog(catalogType)
  return NextResponse.json(products, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
