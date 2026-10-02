import { notFound } from 'next/navigation'
import { db } from '@lib/db'
import { orders, orderItems } from '@lib/db/src/schema'
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

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id))

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
        }}
      />
    )
  } catch (err) {
    console.error('Error fetching order:', err)
    notFound()
  }
}
