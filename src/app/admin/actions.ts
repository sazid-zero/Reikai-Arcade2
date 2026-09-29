'use server'

import { and, asc, count, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@lib/auth'
import { db } from '@lib/db'
import { adminUsers, orders, productVariants, products } from '@lib/db/src/schema'

const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/).max(120),
  type: z.enum(['game', 'accessory']),
  status: z.enum(['draft', 'active', 'archived']),
  brand: z.string().trim().max(80).optional(),
  platform: z.string().trim().max(80).optional(),
  category: z.string().trim().max(80).optional(),
  imageUrl: z.string().url().or(z.literal('')).optional(),
  shortDescription: z.string().trim().max(240).optional(),
})

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  const admins = await db.select({ userId: adminUsers.userId }).from(adminUsers).limit(1)
  if (admins.length === 0) {
    await db.insert(adminUsers).values({ userId: session.user.id }).onConflictDoNothing()
    return session.user
  }
  const allowed = await db.select({ userId: adminUsers.userId }).from(adminUsers).where(eq(adminUsers.userId, session.user.id)).limit(1)
  if (!allowed.length) throw new Error('Forbidden')
  return session.user
}

export async function getAdminCatalog() {
  await requireAdmin()
  return db.select().from(products).orderBy(asc(products.sortOrder), asc(products.name))
}

export async function getAdminMetrics() {
  await requireAdmin()
  const rows = await db.select({ type: products.type, status: products.status, total: count() }).from(products).groupBy(products.type, products.status)
  return rows
}

export async function getAdminProduct(id: string) {
  await requireAdmin()
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1)
  return rows[0] ?? null
}

export async function getInventory() {
  await requireAdmin()
  return db.select({ id: productVariants.id, sku: productVariants.sku, stockQuantity: productVariants.stockQuantity, productName: products.name }).from(productVariants).innerJoin(products, eq(products.id, productVariants.productId)).orderBy(asc(productVariants.stockQuantity))
}

export async function getAdminOrders() {
  await requireAdmin()
  return db.select().from(orders).orderBy(asc(orders.createdAt))
}

export async function createProduct(input: z.input<typeof productSchema>) {
  await requireAdmin()
  const parsed = productSchema.parse(input)
  await db.insert(products).values({ ...parsed, imageUrl: parsed.imageUrl || null, brand: parsed.brand || null, platform: parsed.platform || null, category: parsed.category || null, shortDescription: parsed.shortDescription || null })
  revalidatePath('/admin')
  revalidatePath('/games')
  revalidatePath('/accessories')
}

export async function updateProduct(id: string, input: z.input<typeof productSchema>) {
  await requireAdmin()
  const parsed = productSchema.parse(input)
  await db.update(products).set({ ...parsed, imageUrl: parsed.imageUrl || null, updatedAt: new Date() }).where(eq(products.id, id))
  revalidatePath('/admin')
  revalidatePath('/games')
  revalidatePath('/accessories')
}

export async function archiveProduct(id: string) {
  await requireAdmin()
  await db.update(products).set({ status: 'archived', updatedAt: new Date() }).where(and(eq(products.id, id)))
  revalidatePath('/admin')
}
