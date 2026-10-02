import { sql } from 'drizzle-orm'
import { boolean, integer, jsonb, pgTable, text, timestamp, uuid, index, real } from 'drizzle-orm/pg-core'

export const adminUsers = pgTable('admin_users', {
  userId: text('user_id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'game' | 'accessory'
  shortDescription: text('short_description'),
  description: text('description'),
  brand: text('brand'),
  platform: text('platform'),
  category: text('category'),
  imageUrl: text('image_url'),
  galleryImages: jsonb('gallery_images').notNull().default(sql`'[]'::jsonb`),
  tags: jsonb('tags').notNull().default(sql`'[]'::jsonb`),
  features: jsonb('features').notNull().default(sql`'[]'::jsonb`),
  specs: jsonb('specs').notNull().default(sql`'{}'::jsonb`),
  rating: real('rating').notNull().default(0),
  reviewCount: integer('review_count').notNull().default(0),
  status: text('status').notNull().default('draft'), // 'draft' | 'active' | 'archived'
  featured: boolean('featured').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  typeStatusIdx: index('products_type_status_idx').on(table.type, table.status),
  featuredIdx: index('products_featured_idx').on(table.featured, table.sortOrder),
}))

export const productVariants = pgTable('product_variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  sku: text('sku').notNull().unique(),
  price: integer('price').notNull(), // in smallest currency unit (paisa/cent)
  compareAtPrice: integer('compare_at_price'),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  active: boolean('active').notNull().default(true),
  metadata: jsonb('metadata').notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  productIdx: index('product_variants_product_idx').on(table.productId),
}))

export type Product = typeof products.$inferSelect
type ProductInsert = typeof products.$inferInsert
export type ProductVariant = typeof productVariants.$inferSelect

export const inventoryAdjustments = pgTable('inventory_adjustments', {
  id: uuid('id').defaultRandom().primaryKey(),
  variantId: uuid('variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  delta: integer('delta').notNull(),
  reason: text('reason').notNull(),
  createdBy: text('created_by'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({ variantIdx: index('inventory_adjustments_variant_idx').on(table.variantId) }))

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  status: text('status').notNull().default('pending'), // 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: text('payment_status').notNull().default('unpaid'), // 'unpaid' | 'paid' | 'refunded'
  fulfillmentStatus: text('fulfillment_status').notNull().default('unfulfilled'), // 'unfulfilled' | 'partial' | 'fulfilled' | 'shipped'
  customerEmail: text('customer_email'),
  customerName: text('customer_name'),
  customerPhone: text('customer_phone'),
  shippingAddress: jsonb('shipping_address').default(sql`'{}'::jsonb`),
  total: integer('total').notNull().default(0),
  notes: text('notes'),
  adminNotes: text('admin_notes'),
  trackingNumber: text('tracking_number'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({ statusIdx: index('orders_status_idx').on(table.status, table.createdAt) }))

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  variantId: uuid('variant_id').references(() => productVariants.id),
  productName: text('product_name').notNull(),
  variantTitle: text('variant_title'),
  sku: text('sku'),
  quantity: integer('quantity').notNull(),
  unitPrice: integer('unit_price').notNull(),
}, (table) => ({ orderIdx: index('order_items_order_idx').on(table.orderId) }))

export type ProductInput = Omit<ProductInsert, 'id' | 'createdAt' | 'updatedAt'>
export type InventoryAdjustment = typeof inventoryAdjustments.$inferSelect
export type Order = typeof orders.$inferSelect
export type OrderItem = typeof orderItems.$inferSelect
