import { and, asc, eq } from 'drizzle-orm'
import { db } from '@lib/db'
import { productVariants, products } from '@lib/db/src/schema'

export async function getActiveCatalog(type?: 'game' | 'accessory') {
  if (!process.env.DATABASE_URL) return []
  try {
    const conditions = [eq(products.status, 'active')]
    if (type) conditions.push(eq(products.type, type))

    return await db
      .select({
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
        featured: products.featured,
        sortOrder: products.sortOrder,
        variantId: productVariants.id,
        variantTitle: productVariants.title,
        sku: productVariants.sku,
        price: productVariants.price,
        compareAtPrice: productVariants.compareAtPrice,
        stockQuantity: productVariants.stockQuantity,
      })
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
    const rows = await db
      .select({
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
        featured: products.featured,
        sortOrder: products.sortOrder,
        variantId: productVariants.id,
        variantTitle: productVariants.title,
        sku: productVariants.sku,
        price: productVariants.price,
        compareAtPrice: productVariants.compareAtPrice,
        stockQuantity: productVariants.stockQuantity,
      })
      .from(products)
      .leftJoin(productVariants, and(eq(productVariants.productId, products.id), eq(productVariants.active, true)))
      .where(and(eq(products.slug, slug), eq(products.status, 'active')))
      .orderBy(asc(productVariants.price))

    return rows
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return []
  }
}
