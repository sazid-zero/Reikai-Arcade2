import { and, asc, eq, or } from 'drizzle-orm'
import { db } from '@lib/db'
import { productVariants, products } from '@lib/db/src/schema'

const productFields = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  type: products.type,
  shortDescription: products.shortDescription,
  description: products.description,
  brand: products.brand,
  platform: products.platform,
  category: products.category,
  imageUrl: products.imageUrl,
  galleryImages: products.galleryImages,
  tags: products.tags,
  features: products.features,
  specs: products.specs,
  rating: products.rating,
  reviewCount: products.reviewCount,
  featured: products.featured,
  sortOrder: products.sortOrder,
}

const variantFields = {
  variantId: productVariants.id,
  variantTitle: productVariants.title,
  sku: productVariants.sku,
  price: productVariants.price,
  compareAtPrice: productVariants.compareAtPrice,
  stockQuantity: productVariants.stockQuantity,
}

export async function getActiveCatalog(type?: 'game' | 'accessory') {
  if (!process.env.DATABASE_URL) return []
  try {
    const conditions = [eq(products.status, 'active')]
    if (type) conditions.push(eq(products.type, type))

    return await db
      .select({ ...productFields, ...variantFields })
      .from(products)
      .leftJoin(productVariants, and(eq(productVariants.productId, products.id), eq(productVariants.active, true)))
      .where(and(...conditions))
      .orderBy(asc(products.sortOrder), asc(products.name))
  } catch (error) {
    console.error('Error fetching active catalog:', error)
    return []
  }
}

export async function getActiveProductBySlug(slug: string) {
  if (!process.env.DATABASE_URL) return []
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
    const matchCondition = isUUID
      ? or(eq(products.slug, slug), eq(products.id, slug))
      : eq(products.slug, slug)

    const rows = await db
      .select({ ...productFields, ...variantFields })
      .from(products)
      .leftJoin(productVariants, and(eq(productVariants.productId, products.id), eq(productVariants.active, true)))
      .where(and(matchCondition, eq(products.status, 'active')))
      .orderBy(asc(productVariants.price))

    return rows
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return []
  }
}

// Helper to group flat join rows into a single product with variants array
export function groupProductRows<T extends { id: string; variantId: string | null; variantTitle: string | null; sku: string | null; price: number | null; compareAtPrice: number | null; stockQuantity: number | null }>(rows: T[]) {
  if (rows.length === 0) return null
  const { variantId, variantTitle, sku, price, compareAtPrice, stockQuantity, ...base } = rows[0]
  const product = {
    ...base,
    variants: [] as Array<{ id: string; title: string | null; sku: string | null; price: number; compareAtPrice: number | null; stockQuantity: number }>,
  }
  for (const row of rows) {
    if (row.variantId) {
      product.variants.push({
        id: row.variantId,
        title: row.variantTitle,
        sku: row.sku,
        price: row.price!,
        compareAtPrice: row.compareAtPrice,
        stockQuantity: row.stockQuantity!,
      })
    }
  }
  return product
}
