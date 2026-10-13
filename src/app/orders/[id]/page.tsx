import { notFound } from 'next/navigation'
import { db } from '@lib/db'
import { orders, orderItems, digitalCodes, productVariants } from '@lib/db/src/schema'
import { eq } from 'drizzle-orm'
import { OrderTrackingClient } from './order-tracking-client'

type Props = {
  params: Promise<{ id: string }>
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params

  if (!process.env.DATABASE_URL) {
    notFound()
  }

  try {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1)

    if (!order) {
      notFound()
    }

    const [items, codes] = await Promise.all([
      db.select().from(orderItems).where(eq(orderItems.orderId, order.id)),
      db
        .select({
          id: digitalCodes.id,
          code: digitalCodes.code,
          pin: digitalCodes.pin,
          status: digitalCodes.status,
          deliveredAt: digitalCodes.deliveredAt,
          variantTitle: productVariants.title,
        })
        .from(digitalCodes)
        .leftJoin(productVariants, eq(digitalCodes.variantId, productVariants.id))
        .where(eq(digitalCodes.orderId, order.id)),
    ])

    return (
      <OrderTrackingClient
        order={{
          id: order.id,
          status: order.status,
          paymentStatus: order.paymentStatus,
          fulfillmentStatus: order.fulfillmentStatus,
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          shippingAddress: order.shippingAddress,
          total: order.total,
          notes: order.notes,
          adminNotes: order.adminNotes,
          trackingNumber: order.trackingNumber,
          createdAt: order.createdAt.toISOString(),
          items: items.map((i) => ({
            id: i.id,
            productName: i.productName,
            variantTitle: i.variantTitle,
            sku: i.sku,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
          digitalCodes: codes.map((c) => ({
            id: c.id,
            code: c.code,
            pin: c.pin,
            status: c.status,
            variantTitle: c.variantTitle,
          })),
        }}
      />
    )
  } catch (err) {
    console.error('Error fetching order:', err)
    notFound()
  }
}
