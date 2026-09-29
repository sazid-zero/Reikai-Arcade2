import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@lib/db'
import { orderItems, orders, productVariants } from '@lib/db/src/schema'
import { eq, inArray } from 'drizzle-orm'

const orderSchema = z.object({
  customerEmail: z.string().email().optional(),
  customerName: z.string().trim().min(1).max(120).optional(),
  items: z.array(z.object({ variantId: z.string().uuid().optional(), productName: z.string().trim().min(1).max(200), sku: z.string().max(120).optional(), quantity: z.number().int().positive().max(20), unitPrice: z.number().int().nonnegative() })).min(1).max(50),
})

export async function POST(request: Request) {
  const parsed = orderSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 })

  const variantIds = parsed.data.items.flatMap((item) => item.variantId ? [item.variantId] : [])
  const variants = variantIds.length ? await db.select().from(productVariants).where(inArray(productVariants.id, variantIds)) : []
  const variantMap = new Map(variants.map((variant) => [variant.id, variant]))
  const items = parsed.data.items.map((item) => {
    const variant = item.variantId ? variantMap.get(item.variantId) : null
    if (item.variantId && !variant) throw new Error('Variant not found')
    if (variant && (variant.stockQuantity < item.quantity || variant.price !== item.unitPrice)) throw new Error('Cart price or stock changed')
    return { ...item, unitPrice: variant?.price ?? item.unitPrice, sku: variant?.sku ?? item.sku }
  })
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const [order] = await db.insert(orders).values({ customerEmail: parsed.data.customerEmail, customerName: parsed.data.customerName, total }).returning()
  await db.insert(orderItems).values(items.map((item) => ({ orderId: order.id, variantId: item.variantId, productName: item.productName, sku: item.sku, quantity: item.quantity, unitPrice: item.unitPrice })))
  return NextResponse.json({ id: order.id, total }, { status: 201 })
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
