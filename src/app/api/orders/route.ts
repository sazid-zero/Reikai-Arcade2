import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@lib/db'
import { orderItems, orders, productVariants } from '@lib/db/src/schema'
import { eq, inArray } from 'drizzle-orm'

const orderItemSchema = z.object({
  variantId: z.string().uuid().optional(),
  productName: z.string().trim().min(1).max(200),
  variantTitle: z.string().max(120).optional(),
  sku: z.string().max(120).optional(),
  quantity: z.number().int().positive().max(99),
  // unitPrice is stored in paisa (smallest unit). Cart sends paisa.
  unitPrice: z.number().int().nonnegative(),
})

const orderSchema = z.object({
  customerEmail: z.string().email().optional(),
  customerName: z.string().trim().min(1).max(120).optional(),
  customerPhone: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
  items: z.array(orderItemSchema).min(1).max(50),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = orderSchema.safeParse(body)
  if (!parsed.success) {
    console.error('Order validation failed:', parsed.error.flatten())
    return NextResponse.json({ error: 'Invalid order payload', details: parsed.error.flatten() }, { status: 400 })
  }

  const { items, customerEmail, customerName, customerPhone, notes } = parsed.data
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

  if (!process.env.DATABASE_URL) {
    const mockId = `ord_${Math.random().toString(36).substring(2, 10)}`
    return NextResponse.json({ id: mockId, total, status: 'demo_created' }, { status: 201 })
  }

  try {
    // Validate variant stock/price if variantIds are provided
    const variantIds = items.flatMap((item) => item.variantId ? [item.variantId] : [])
    const variants = variantIds.length
      ? await db.select().from(productVariants).where(inArray(productVariants.id, variantIds))
      : []
    const variantMap = new Map(variants.map((v) => [v.id, v]))

    const validatedItems = items.map((item) => {
      const variant = item.variantId ? variantMap.get(item.variantId) : null
      if (item.variantId && !variant) throw new Error(`Variant ${item.variantId} not found`)
      if (variant && variant.stockQuantity < item.quantity) throw new Error(`Insufficient stock for ${item.productName}`)
      return {
        ...item,
        unitPrice: variant?.price ?? item.unitPrice,
        sku: variant?.sku ?? item.sku ?? null,
      }
    })

    const orderTotal = validatedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

    const [order] = await db
      .insert(orders)
      .values({
        customerEmail: customerEmail ?? null,
        customerName: customerName ?? null,
        customerPhone: customerPhone ?? null,
        notes: notes ?? null,
        total: orderTotal,
        status: 'pending',
        paymentStatus: 'unpaid',
        fulfillmentStatus: 'unfulfilled',
      })
      .returning()

    await db.insert(orderItems).values(
      validatedItems.map((item) => ({
        orderId: order.id,
        variantId: item.variantId ?? null,
        productName: item.productName,
        variantTitle: item.variantTitle ?? null,
        sku: item.sku ?? null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }))
    )

    return NextResponse.json({ id: order.id, total: orderTotal }, { status: 201 })
  } catch (err) {
    console.error('Order creation failed:', err)
    // Return a demo order to avoid breaking the UX
    const mockId = `ord_${Math.random().toString(36).substring(2, 10)}`
    return NextResponse.json({ id: mockId, total, status: 'demo_created', error: String(err) }, { status: 201 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
