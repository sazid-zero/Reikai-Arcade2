import { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@lib/db'
import { orders, orderItems } from '@lib/db/src/schema'
import { eq, or, desc, inArray } from 'drizzle-orm'
import { getCurrentUserSession } from '@lib/admin-auth'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { OrdersClient } from './orders-client'

export const metadata: Metadata = {
  title: 'My Orders & Order Tracking | ReiKai Arcade',
  description: 'Track your PlayStation orders, digital codes, game vouchers, and console accessories.',
}

export default async function OrdersPage() {
  const sessionUser = await getCurrentUserSession()

  let userOrders: Array<any> = []

  if (sessionUser && process.env.DATABASE_URL) {
    try {
      const conditions = []
      if (sessionUser.email) {
        conditions.push(eq(orders.customerEmail, sessionUser.email))
      }
      if (sessionUser.phone) {
        conditions.push(eq(orders.customerPhone, sessionUser.phone))
      }

      if (conditions.length > 0) {
        const foundOrders = await db
          .select()
          .from(orders)
          .where(conditions.length > 1 ? or(...conditions) : conditions[0])
          .orderBy(desc(orders.createdAt))
          .limit(50)

        if (foundOrders.length > 0) {
          const orderIds = foundOrders.map((o) => o.id)
          const allItems = await db
            .select()
            .from(orderItems)
            .where(inArray(orderItems.orderId, orderIds))

          const itemsByOrderId = new Map<string, typeof allItems>()
          for (const item of allItems) {
            if (!itemsByOrderId.has(item.orderId)) {
              itemsByOrderId.set(item.orderId, [])
            }
            itemsByOrderId.get(item.orderId)!.push(item)
          }

          userOrders = foundOrders.map((o) => ({
            id: o.id,
            status: o.status,
            paymentStatus: o.paymentStatus,
            fulfillmentStatus: o.fulfillmentStatus,
            customerEmail: o.customerEmail,
            customerName: o.customerName,
            customerPhone: o.customerPhone,
            total: o.total,
            createdAt: o.createdAt.toISOString(),
            items: (itemsByOrderId.get(o.id) || []).map((i) => ({
              id: i.id,
              productName: i.productName,
              variantTitle: i.variantTitle,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            })),
          }))
        }
      }
    } catch (err) {
      console.error('Error fetching user orders:', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#06020e] text-[#f4f2ff]">
      <SiteHeader />
      <OrdersClient initialOrders={userOrders} user={sessionUser} />
      <SiteFooter />
    </div>
  )
}
