'use server'

import { and, asc, count, desc, eq, sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@lib/auth'
import { getAdminSession, loginAdmin, logoutAdmin } from '@lib/admin-auth'
import { db } from '@lib/db'
import { adminUsers, digitalCodes, inventoryAdjustments, orderItems, orders, productVariants, products } from '@lib/db/src/schema'

// ─── Schemas ──────────────────────────────────────────────────────────────────

const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9-]+$/).max(120),
  type: z.enum(['game', 'accessory', 'topup', 'giftcard', 'subscription']),
  status: z.enum(['draft', 'active', 'archived']),
  brand: z.string().trim().max(80).optional(),
  platform: z.string().trim().max(80).optional(),
  category: z.string().trim().max(80).optional(),
  imageUrl: z.string().url().or(z.literal('')).optional(),
  shortDescription: z.string().trim().max(500).optional(),
  description: z.string().trim().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  galleryImages: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  specs: z.record(z.string(), z.string()).optional(),
})

const variantSchema = z.object({
  title: z.string().trim().min(1).max(120),
  sku: z.string().trim().min(1).max(80),
  price: z.number().int().nonnegative(),
  compareAtPrice: z.number().int().nonnegative().optional(),
  stockQuantity: z.number().int().nonnegative(),
  active: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

const orderUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  paymentStatus: z.enum(['unpaid', 'paid', 'refunded']).optional(),
  fulfillmentStatus: z.enum(['unfulfilled', 'partial', 'fulfilled', 'shipped']).optional(),
  adminNotes: z.string().max(1000).optional(),
  trackingNumber: z.string().max(200).optional(),
})

// ─── Auth Guard & Actions ──────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await getAdminSession()
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

export async function loginAdminAction(formData: { email: string; pass: string }) {
  return loginAdmin(formData.email, formData.pass)
}

export async function logoutAdminAction() {
  await logoutAdmin()
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getAdminCatalog() {
  await requireAdmin()
  return db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      type: products.type,
      status: products.status,
      featured: products.featured,
      sortOrder: products.sortOrder,
      imageUrl: products.imageUrl,
      brand: products.brand,
      platform: products.platform,
      category: products.category,
      createdAt: products.createdAt,
      variantCount: sql<number>`(select count(*) from product_variants pv where pv.product_id = ${products.id})`.as('variant_count'),
    })
    .from(products)
    .orderBy(asc(products.sortOrder), asc(products.name))
}

export async function getAdminMetrics() {
  await requireAdmin()
  const [productMetrics, orderMetrics, revenueMetrics] = await Promise.all([
    db.select({ type: products.type, status: products.status, total: count() }).from(products).groupBy(products.type, products.status),
    db.select({ status: orders.status, total: count() }).from(orders).groupBy(orders.status),
    db.select({ total: sql<number>`coalesce(sum(total), 0)` }).from(orders).where(eq(orders.paymentStatus, 'paid')),
  ])
  return { products: productMetrics, orders: orderMetrics, revenue: revenueMetrics[0]?.total ?? 0 }
}

export async function getAdminProduct(id: string) {
  await requireAdmin()
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1)
  return rows[0] ?? null
}

export async function createProduct(input: z.input<typeof productSchema>) {
  await requireAdmin()
  const parsed = productSchema.parse(input)
  const [product] = await db
    .insert(products)
    .values({
      ...parsed,
      imageUrl: parsed.imageUrl || null,
      brand: parsed.brand || null,
      platform: parsed.platform || null,
      category: parsed.category || null,
      shortDescription: parsed.shortDescription || null,
      description: parsed.description || null,
      featured: parsed.featured ?? false,
      sortOrder: parsed.sortOrder ?? 0,
      galleryImages: parsed.galleryImages ?? [],
      tags: parsed.tags ?? [],
      features: parsed.features ?? [],
      specs: parsed.specs ?? {},
    })
    .returning()
  revalidatePath('/admin')
  revalidatePath('/games')
  revalidatePath('/accessories')
  revalidatePath('/top-up')
  revalidatePath('/gift-cards')
  revalidatePath('/subscriptions')
  return product
}

export async function updateProduct(id: string, input: z.input<typeof productSchema>) {
  await requireAdmin()
  const parsed = productSchema.parse(input)
  await db.update(products).set({
    ...parsed,
    imageUrl: parsed.imageUrl || null,
    brand: parsed.brand || null,
    platform: parsed.platform || null,
    category: parsed.category || null,
    shortDescription: parsed.shortDescription || null,
    description: parsed.description || null,
    featured: parsed.featured ?? false,
    sortOrder: parsed.sortOrder ?? 0,
    galleryImages: parsed.galleryImages ?? [],
    tags: parsed.tags ?? [],
    features: parsed.features ?? [],
    specs: parsed.specs ?? {},
    updatedAt: new Date(),
  }).where(eq(products.id, id))
  revalidatePath('/admin')
  revalidatePath(`/admin/products/${id}`)
  revalidatePath('/games')
  revalidatePath('/accessories')
  revalidatePath('/top-up')
  revalidatePath('/gift-cards')
  revalidatePath('/subscriptions')
}

export async function archiveProduct(id: string) {
  await requireAdmin()
  await db.update(products).set({ status: 'archived', updatedAt: new Date() }).where(eq(products.id, id))
  revalidatePath('/admin')
  revalidatePath('/games')
  revalidatePath('/accessories')
  revalidatePath('/top-up')
  revalidatePath('/gift-cards')
  revalidatePath('/subscriptions')
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  await db.delete(products).where(eq(products.id, id))
  revalidatePath('/admin')
  revalidatePath('/games')
  revalidatePath('/accessories')
  revalidatePath('/top-up')
  revalidatePath('/gift-cards')
  revalidatePath('/subscriptions')
}

// ─── Variants ─────────────────────────────────────────────────────────────────

export async function getProductVariants(productId: string) {
  await requireAdmin()
  return db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId))
    .orderBy(asc(productVariants.price))
}

export async function createVariant(productId: string, input: z.input<typeof variantSchema>) {
  await requireAdmin()
  const parsed = variantSchema.parse(input)
  const [variant] = await db
    .insert(productVariants)
    .values({
      productId,
      ...parsed,
      compareAtPrice: parsed.compareAtPrice ?? null,
      active: parsed.active ?? true,
      metadata: parsed.metadata ?? {},
    })
    .returning()
  revalidatePath(`/admin/products/${productId}`)
  return variant
}

export async function updateVariant(variantId: string, input: z.input<typeof variantSchema>) {
  await requireAdmin()
  const parsed = variantSchema.parse(input)
  await db.update(productVariants).set({
    ...parsed,
    compareAtPrice: parsed.compareAtPrice ?? null,
    active: parsed.active ?? true,
    metadata: parsed.metadata ?? {},
    updatedAt: new Date(),
  }).where(eq(productVariants.id, variantId))
  revalidatePath('/admin')
}

export async function deleteVariant(variantId: string) {
  await requireAdmin()
  await db.delete(productVariants).where(eq(productVariants.id, variantId))
  revalidatePath('/admin')
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export async function getInventory() {
  await requireAdmin()
  return db
    .select({
      id: productVariants.id,
      sku: productVariants.sku,
      title: productVariants.title,
      stockQuantity: productVariants.stockQuantity,
      productId: productVariants.productId,
      productName: products.name,
      productType: products.type,
    })
    .from(productVariants)
    .innerJoin(products, eq(products.id, productVariants.productId))
    .orderBy(asc(productVariants.stockQuantity))
}

export async function adjustStock(variantId: string, delta: number, reason: string) {
  const session = await requireAdmin()
  // Update stock
  await db
    .update(productVariants)
    .set({
      stockQuantity: sql`${productVariants.stockQuantity} + ${delta}`,
      updatedAt: new Date(),
    })
    .where(eq(productVariants.id, variantId))
  // Log adjustment
  await db.insert(inventoryAdjustments).values({
    variantId,
    delta,
    reason,
    createdBy: session?.id ?? null,
  })
  revalidatePath('/admin/inventory')
}

export async function getInventoryHistory(variantId: string) {
  await requireAdmin()
  return db
    .select()
    .from(inventoryAdjustments)
    .where(eq(inventoryAdjustments.variantId, variantId))
    .orderBy(desc(inventoryAdjustments.createdAt))
    .limit(20)
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getAdminOrders() {
  await requireAdmin()
  return db.select().from(orders).orderBy(desc(orders.createdAt))
}

export async function getAdminOrder(id: string) {
  await requireAdmin()
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1)
  if (!order) return null
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id))
  const codes = await db
    .select({
      id: digitalCodes.id,
      code: digitalCodes.code,
      pin: digitalCodes.pin,
      status: digitalCodes.status,
      deliveredAt: digitalCodes.deliveredAt,
      variantId: digitalCodes.variantId,
      variantTitle: productVariants.title,
    })
    .from(digitalCodes)
    .leftJoin(productVariants, eq(digitalCodes.variantId, productVariants.id))
    .where(eq(digitalCodes.orderId, id))
  return { ...order, items, codes }
}

export async function updateOrder(id: string, input: z.input<typeof orderUpdateSchema>) {
  await requireAdmin()
  const parsed = orderUpdateSchema.parse(input)
  await db.update(orders).set({ ...parsed, updatedAt: new Date() }).where(eq(orders.id, id))
  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
}

// ─── Users / Admin Management ─────────────────────────────────────────────────

export async function getAdminUsers() {
  await requireAdmin()
  // Get users from better-auth user table joined with admin_users
  const admins = await db.select().from(adminUsers)
  return admins
}

export async function promoteToAdmin(userId: string) {
  await requireAdmin()
  await db.insert(adminUsers).values({ userId }).onConflictDoNothing()
  revalidatePath('/admin/users')
}

export async function revokeAdmin(userId: string) {
  const user = await requireAdmin()
  if (userId === user.id) throw new Error('Cannot revoke your own admin access')
  await db.delete(adminUsers).where(eq(adminUsers.userId, userId))
  revalidatePath('/admin/users')
}

// ─── Digital Codes Management ────────────────────────────────────────────────

export async function getAdminDigitalCodes(variantId?: string) {
  await requireAdmin()
  const conditions = variantId ? [eq(digitalCodes.variantId, variantId)] : []
  return db
    .select({
      id: digitalCodes.id,
      variantId: digitalCodes.variantId,
      code: digitalCodes.code,
      pin: digitalCodes.pin,
      status: digitalCodes.status,
      orderId: digitalCodes.orderId,
      deliveredAt: digitalCodes.deliveredAt,
      createdAt: digitalCodes.createdAt,
      variantTitle: productVariants.title,
      productName: products.name,
      productSlug: products.slug,
      productType: products.type,
    })
    .from(digitalCodes)
    .innerJoin(productVariants, eq(digitalCodes.variantId, productVariants.id))
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(and(...conditions))
    .orderBy(desc(digitalCodes.createdAt))
}

export async function getDigitalProductVariants() {
  await requireAdmin()
  return db
    .select({
      variantId: productVariants.id,
      variantTitle: productVariants.title,
      sku: productVariants.sku,
      price: productVariants.price,
      stockQuantity: productVariants.stockQuantity,
      productId: products.id,
      productName: products.name,
      productType: products.type,
      productSlug: products.slug,
    })
    .from(productVariants)
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(sql`${products.type} IN ('topup', 'giftcard', 'subscription')`)
    .orderBy(asc(products.name), asc(productVariants.price))
}

export async function addBatchDigitalCodes(variantId: string, codesText: string) {
  await requireAdmin()
  const rawCodes = codesText
    .split(/[\r\n,]+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0)

  if (rawCodes.length === 0) {
    throw new Error('No valid codes provided')
  }

  for (const code of rawCodes) {
    await db.insert(digitalCodes).values({
      variantId,
      code,
      status: 'available',
    })
  }

  const [stockResult] = await db
    .select({ count: count() })
    .from(digitalCodes)
    .where(and(eq(digitalCodes.variantId, variantId), eq(digitalCodes.status, 'available')))

  await db
    .update(productVariants)
    .set({ stockQuantity: stockResult.count, updatedAt: new Date() })
    .where(eq(productVariants.id, variantId))

  revalidatePath('/admin/digital-codes')
  revalidatePath('/admin/inventory')
  revalidatePath('/admin/products')
  return { addedCount: rawCodes.length, newStock: stockResult.count }
}

export async function deleteDigitalCode(codeId: string) {
  await requireAdmin()
  const [code] = await db.select().from(digitalCodes).where(eq(digitalCodes.id, codeId)).limit(1)
  if (!code) throw new Error('Code not found')

  await db.delete(digitalCodes).where(eq(digitalCodes.id, codeId))

  if (code.status === 'available') {
    const [stockResult] = await db
      .select({ count: count() })
      .from(digitalCodes)
      .where(and(eq(digitalCodes.variantId, code.variantId), eq(digitalCodes.status, 'available')))

    await db
      .update(productVariants)
      .set({ stockQuantity: stockResult.count, updatedAt: new Date() })
      .where(eq(productVariants.id, code.variantId))
  }

  revalidatePath('/admin/digital-codes')
  revalidatePath('/admin/inventory')
}

export async function assignAndDeliverDigitalCodesForOrder(orderId: string) {
  await requireAdmin()
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1)
  if (!order) throw new Error('Order not found')

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId))

  for (const item of items) {
    if (!item.variantId) continue
    const alreadyDelivered = await db
      .select()
      .from(digitalCodes)
      .where(and(eq(digitalCodes.orderId, orderId), eq(digitalCodes.variantId, item.variantId)))

    const needed = item.quantity - alreadyDelivered.length
    if (needed <= 0) continue

    const available = await db
      .select()
      .from(digitalCodes)
      .where(and(eq(digitalCodes.variantId, item.variantId), eq(digitalCodes.status, 'available')))
      .limit(needed)

    for (const code of available) {
      await db
        .update(digitalCodes)
        .set({
          status: 'delivered',
          orderId,
          deliveredAt: new Date(),
        })
        .where(eq(digitalCodes.id, code.id))
    }

    const [stockResult] = await db
      .select({ count: count() })
      .from(digitalCodes)
      .where(and(eq(digitalCodes.variantId, item.variantId), eq(digitalCodes.status, 'available')))

    await db
      .update(productVariants)
      .set({ stockQuantity: stockResult.count, updatedAt: new Date() })
      .where(eq(productVariants.id, item.variantId))
  }

  await db
    .update(orders)
    .set({
      fulfillmentStatus: 'fulfilled',
      status: order.status === 'pending' ? 'confirmed' : order.status,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/admin/orders')
  revalidatePath(`/orders/${orderId}`)
}
