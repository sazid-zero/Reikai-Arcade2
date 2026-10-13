import { Client } from 'pg'

const client = new Client({
  connectionString: process.env.DATABASE_URL,
})

async function run() {
  await client.connect()
  console.log('Connected to Neon Postgres...')

  // 1. Create digital_codes table
  await client.query(`
    CREATE TABLE IF NOT EXISTS digital_codes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
      code text NOT NULL,
      pin text,
      status text NOT NULL DEFAULT 'available',
      order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
      delivered_at timestamp,
      created_at timestamp NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS digital_codes_variant_status_idx ON digital_codes(variant_id, status);
    CREATE INDEX IF NOT EXISTS digital_codes_order_idx ON digital_codes(order_id);
  `)
  console.log('✓ Created digital_codes table')

  // 2. Seed initial Digital Top-Up products (PlayStation Store Wallet)
  const psnTopUp = {
    slug: 'psn-wallet-topup',
    name: 'PlayStation Store Wallet Top-Up (US)',
    type: 'topup',
    shortDescription: 'Instant digital wallet code delivery for US PlayStation Network accounts. Redeem for games, DLC, and PlayStation Plus.',
    description: 'Add funds directly to your PlayStation Network wallet without a credit card. Redeem the 12-digit code on PlayStation 5, PlayStation 4, or via the PlayStation Store website. Digital codes are delivered instantly with 100% authenticity guarantee.',
    brand: 'PlayStation',
    platform: 'PlayStation Store (US Region)',
    category: 'Wallet Top-Up',
    imageUrl: '/covers/wallet-50.jpg',
    galleryImages: JSON.stringify(['/covers/wallet-50.jpg']),
    tags: JSON.stringify(['Digital Code', 'PlayStation Store', 'Instant Delivery', 'US Region']),
    features: JSON.stringify([
      'Instant digital code revelation on your verified order page',
      'Valid for all purchases on the US PlayStation Store (games, DLC, add-ons)',
      'No expiration date on wallet credit balance once redeemed',
      'Official PlayStation Network digital voucher with verified legitimacy',
    ]),
    specs: JSON.stringify({
      Region: 'United States (US Accounts Only)',
      Delivery: 'Instant Digital Code (Revealed on checkout & order tracking)',
      Format: '12-Digit PSN Redemption Code',
      Platform: 'PS5, PS4, Web Browser, PlayStation App',
    }),
    rating: 4.96,
    reviewCount: 380,
    status: 'active',
    featured: true,
    sortOrder: 1,
  }

  // Insert or update PSN Top Up product
  const psnRes = await client.query(`
    INSERT INTO products (
      slug, name, type, short_description, description, brand, platform, category,
      image_url, gallery_images, tags, features, specs, rating, review_count, status, featured, sort_order
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
    ) ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      type = EXCLUDED.type,
      short_description = EXCLUDED.short_description,
      description = EXCLUDED.description,
      brand = EXCLUDED.brand,
      platform = EXCLUDED.platform,
      category = EXCLUDED.category,
      image_url = EXCLUDED.image_url,
      features = EXCLUDED.features,
      specs = EXCLUDED.specs,
      status = EXCLUDED.status,
      featured = EXCLUDED.featured
    RETURNING id;
  `, [
    psnTopUp.slug, psnTopUp.name, psnTopUp.type, psnTopUp.shortDescription, psnTopUp.description,
    psnTopUp.brand, psnTopUp.platform, psnTopUp.category, psnTopUp.imageUrl, psnTopUp.galleryImages,
    psnTopUp.tags, psnTopUp.features, psnTopUp.specs, psnTopUp.rating, psnTopUp.reviewCount,
    psnTopUp.status, psnTopUp.featured, psnTopUp.sortOrder
  ])

  const psnProductId = psnRes.rows[0].id

  // Denominations for PSN
  const psnVariants = [
    { title: '$10 PSN Card', sku: 'TOPUP-PSN-10', price: 135000, compareAtPrice: 145000, codes: ['PSN-US10-A98B-7721', 'PSN-US10-C22K-9104', 'PSN-US10-E45T-8321'] },
    { title: '$25 PSN Card', sku: 'TOPUP-PSN-25', price: 335000, compareAtPrice: 350000, codes: ['PSN-US25-M87N-6542', 'PSN-US25-P43X-1298', 'PSN-US25-R99Z-5412'] },
    { title: '$50 PSN Card', sku: 'TOPUP-PSN-50', price: 665000, compareAtPrice: 690000, codes: ['PSN-US50-X21P-8834', 'PSN-US50-Y76L-4412'] },
    { title: '$75 PSN Card', sku: 'TOPUP-PSN-75', price: 995000, compareAtPrice: 1030000, codes: ['PSN-US75-K99Q-3245'] },
    { title: '$100 PSN Card', sku: 'TOPUP-PSN-100', price: 1320000, compareAtPrice: 1380000, codes: ['PSN-US100-W14K-9908', 'PSN-US100-B88M-2319'] },
  ]

  for (const v of psnVariants) {
    const vRes = await client.query(`
      INSERT INTO product_variants (product_id, title, sku, price, compare_at_price, stock_quantity, active)
      VALUES ($1, $2, $3, $4, $5, $6, true)
      ON CONFLICT (sku) DO UPDATE SET
        title = EXCLUDED.title,
        price = EXCLUDED.price,
        compare_at_price = EXCLUDED.compare_at_price,
        stock_quantity = EXCLUDED.stock_quantity
      RETURNING id;
    `, [psnProductId, v.title, v.sku, v.price, v.compareAtPrice, v.codes.length])

    const variantId = vRes.rows[0].id

    // Insert sample digital codes for this variant if not already existing
    for (const code of v.codes) {
      await client.query(`
        INSERT INTO digital_codes (variant_id, code, status)
        VALUES ($1, $2, 'available')
        ON CONFLICT DO NOTHING;
      `, [variantId, code])
    }
  }
  console.log('✓ Seeded PlayStation Top-Up denominations & voucher codes')

  // 3. Seed ReiKai Arcade Gift Card product
  const giftCard = {
    slug: 'reikai-arcade-gift-card',
    name: 'ReiKai Arcade Store Digital Gift Card',
    type: 'giftcard',
    shortDescription: 'Flexible digital store gift card redeemable across games, controllers, headsets, and top-ups at ReiKai Arcade.',
    description: 'The ultimate gift for PlayStation gamers in Bangladesh. A ReiKai Arcade digital gift card lets your friend or teammate choose exactly the gear, GOTY title, or subscription upgrade they want. Delivered instantly with a personalized redemption code.',
    brand: 'ReiKai Arcade',
    platform: 'ReiKai Storewide Credit',
    category: 'Store Gift Card',
    imageUrl: '/covers/wallet-50.jpg',
    galleryImages: JSON.stringify(['/covers/wallet-50.jpg']),
    tags: JSON.stringify(['Gift Card', 'Store Credit', 'Instant Voucher', 'ReiKai Arcade']),
    features: JSON.stringify([
      'Instant digital voucher code generation',
      'Usable storewide on physical games, gear, accessories, and digital codes',
      'Never expires — redeem at your own pace',
      'Stackable with promotions and seasonal drops',
    ]),
    specs: JSON.stringify({
      Validity: 'Lifetime (No Expiration Date)',
      Usage: 'Storewide across all physical and digital inventory',
      Delivery: 'Instant Online Reveal & Email Voucher',
      Transferable: 'Yes (Can be gifted to any recipient)',
    }),
    rating: 4.98,
    reviewCount: 210,
    status: 'active',
    featured: true,
    sortOrder: 2,
  }

  const giftRes = await client.query(`
    INSERT INTO products (
      slug, name, type, short_description, description, brand, platform, category,
      image_url, gallery_images, tags, features, specs, rating, review_count, status, featured, sort_order
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
    ) ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      type = EXCLUDED.type,
      short_description = EXCLUDED.short_description,
      description = EXCLUDED.description,
      brand = EXCLUDED.brand,
      platform = EXCLUDED.platform,
      category = EXCLUDED.category,
      image_url = EXCLUDED.image_url,
      features = EXCLUDED.features,
      specs = EXCLUDED.specs,
      status = EXCLUDED.status,
      featured = EXCLUDED.featured
    RETURNING id;
  `, [
    giftCard.slug, giftCard.name, giftCard.type, giftCard.shortDescription, giftCard.description,
    giftCard.brand, giftCard.platform, giftCard.category, giftCard.imageUrl, giftCard.galleryImages,
    giftCard.tags, giftCard.features, giftCard.specs, giftCard.rating, giftCard.reviewCount,
    giftCard.status, giftCard.featured, giftCard.sortOrder
  ])

  const giftProductId = giftRes.rows[0].id

  const giftVariants = [
    { title: '৳1,000 Gift Card', sku: 'GIFT-REIKAI-1000', price: 100000, compareAtPrice: null, codes: ['RKA-1000-8841-9921', 'RKA-1000-3321-7712'] },
    { title: '৳2,500 Gift Card', sku: 'GIFT-REIKAI-2500', price: 250000, compareAtPrice: null, codes: ['RKA-2500-4491-1102', 'RKA-2500-6671-5543'] },
    { title: '৳5,000 Gift Card', sku: 'GIFT-REIKAI-5000', price: 500000, compareAtPrice: null, codes: ['RKA-5000-9901-2244'] },
    { title: '৳10,000 Gift Card', sku: 'GIFT-REIKAI-10000', price: 1000000, compareAtPrice: null, codes: ['RKA-10000-7712-4433'] },
  ]

  for (const v of giftVariants) {
    const vRes = await client.query(`
      INSERT INTO product_variants (product_id, title, sku, price, compare_at_price, stock_quantity, active)
      VALUES ($1, $2, $3, $4, $5, $6, true)
      ON CONFLICT (sku) DO UPDATE SET
        title = EXCLUDED.title,
        price = EXCLUDED.price,
        compare_at_price = EXCLUDED.compare_at_price,
        stock_quantity = EXCLUDED.stock_quantity
      RETURNING id;
    `, [giftProductId, v.title, v.sku, v.price, v.compareAtPrice, v.codes.length])

    const variantId = vRes.rows[0].id

    for (const code of v.codes) {
      await client.query(`
        INSERT INTO digital_codes (variant_id, code, status)
        VALUES ($1, $2, 'available')
        ON CONFLICT DO NOTHING;
      `, [variantId, code])
    }
  }
  console.log('✓ Seeded ReiKai Arcade Gift Card denominations & voucher codes')

  await client.end()
  console.log('🎉 Migration and digital product seeding complete!')
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
