import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getActiveCatalog, normalizeProductImageUrl } from '@/lib/catalog'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Crown, Zap, Shield, RefreshCw, ChevronRight, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Game Subscriptions | ReiKai Arcade – PS Plus, Xbox Game Pass & More',
  description:
    'Buy PlayStation Plus, Xbox Game Pass, EA Play, Apple Arcade, Nintendo Switch Online and more. Instant digital delivery at the best BDT rates in Bangladesh.',
}

function formatBDT(paisa: number) {
  return `৳${Math.round(paisa / 100).toLocaleString('en-BD')}`
}

const SUBSCRIPTION_BRANDS = [
  { name: 'PlayStation Plus', emoji: '🎮', color: 'from-blue-500/20 to-blue-900/10' },
  { name: 'Xbox Game Pass', emoji: '🟢', color: 'from-green-500/20 to-green-900/10' },
  { name: 'EA Play', emoji: '⚡', color: 'from-orange-500/20 to-orange-900/10' },
  { name: 'Apple Arcade', emoji: '🍎', color: 'from-pink-500/20 to-pink-900/10' },
  { name: 'Nintendo Online', emoji: '🔴', color: 'from-red-500/20 to-red-900/10' },
  { name: 'Ubisoft+', emoji: '🔷', color: 'from-violet-500/20 to-violet-900/10' },
]

export default async function SubscriptionsPage() {
  const rawRows = await getActiveCatalog('subscription')

  const productMap = new Map<
    string,
    {
      id: string
      slug: string
      name: string
      imageUrl: string | null
      brand: string | null
      platform: string | null
      category: string | null
      shortDescription: string | null
      featured: boolean
      sortOrder: number
      minPrice: number | null
      maxPrice: number | null
    }
  >()

  for (const row of rawRows) {
    const existing = productMap.get(row.id)
    const price = row.price ?? null

    if (!existing) {
      productMap.set(row.id, {
        id: row.id,
        slug: row.slug,
        name: row.name,
        imageUrl: normalizeProductImageUrl(row.imageUrl, 'subscription'),
        brand: row.brand,
        platform: row.platform,
        category: row.category,
        shortDescription: row.shortDescription,
        featured: row.featured,
        sortOrder: row.sortOrder,
        minPrice: price,
        maxPrice: price,
      })
    } else if (price !== null) {
      if (existing.minPrice === null || price < existing.minPrice) existing.minPrice = price
      if (existing.maxPrice === null || price > existing.maxPrice) existing.maxPrice = price
    }
  }

  const products = Array.from(productMap.values()).sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
  )

  // Group by brand
  const byBrand = new Map<string, typeof products>()
  for (const p of products) {
    const brand = p.brand || 'Other'
    if (!byBrand.has(brand)) byBrand.set(brand, [])
    byBrand.get(brand)!.push(p)
  }

  return (
    <div className="min-h-screen bg-[#07050e] text-[#f4f2ff]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 bg-[#06020e] px-4 pb-14 pt-16 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_75%_25%,rgba(168,85,247,0.24),transparent_70%),radial-gradient(ellipse_60%_45%_at_20%_70%,rgba(0,240,255,0.18),transparent_65%),radial-gradient(circle_at_50%_40%,rgba(236,72,153,0.1),transparent_55%)]" />

        <div className="relative mx-auto max-w-7xl">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/40">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">Subscriptions</span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#00f0ff] shadow-[0_0_16px_rgba(0,240,255,0.25)]">
            <Crown className="h-3.5 w-3.5 text-[#00f0ff]" /> Premium Subscriptions
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Level Up Your{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#00f0ff] drop-shadow-[0_0_25px_rgba(0,240,255,0.3)]">
              Gaming Pass.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-white/60 leading-relaxed sm:text-base">
            PS Plus Essential / Extra / Premium, Xbox Game Pass Ultimate, EA Play, Apple Arcade, Nintendo Online &amp; more —
            all delivered instantly as digital codes at Bangladesh's best BDT rates.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: Zap, text: 'Instant Code Delivery' },
              { icon: Shield, text: '100% Genuine' },
              { icon: RefreshCw, text: 'Auto-Renew Friendly' },
              { icon: Star, text: 'Best BDT Rates' },
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md"
              >
                <Icon className="h-3.5 w-3.5 text-[#00f0ff]" />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Brand pills */}
        <div className="relative mx-auto mt-10 max-w-7xl">
          <div className="flex flex-wrap gap-2">
            {SUBSCRIPTION_BRANDS.map(({ name, emoji }) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60"
              >
                {emoji} {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/5">
              <Crown className="h-9 w-9 text-violet-400/50" />
            </div>
            <p className="text-xl font-bold text-white/40">No subscriptions yet.</p>
            <p className="mt-2 text-sm text-white/30">
              Admin can add subscription products from{' '}
              <Link href="/admin/subscriptions" className="text-violet-400 hover:underline">
                Admin → Subscriptions
              </Link>
              .
            </p>
          </div>
        ) : byBrand.size > 0 ? (
          /* Grouped by brand */
          <div className="space-y-14">
            {Array.from(byBrand.entries()).map(([brand, brandProducts]) => (
              <div key={brand}>
                <div className="mb-6 flex items-center gap-3">
                  <h2 className="text-lg font-bold text-white">{brand}</h2>
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs text-white/30 font-mono">{brandProducts.length} plan{brandProducts.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {brandProducts.map((product) => (
                    <SubscriptionCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {products.map((product) => (
              <SubscriptionCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Cross links */}
        <div className="mt-20 grid gap-4 sm:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-[#a855f7]/30 bg-gradient-to-br from-[#1c0f32] via-[#0b0518] to-[#06020e] p-8 shadow-[0_10px_40px_rgba(168,85,247,0.15)]">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00f0ff]">Also Available</span>
            <h2 className="mt-2 text-xl font-black text-white">Game Top-Up</h2>
            <p className="mt-2 text-sm text-white/60">
              Valorant, PUBG Mobile, Genshin Impact, Free Fire, Mobile Legends and more.
            </p>
            <Link
              href="/top-up"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#00f0ff] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_0_20px_rgba(0,240,255,0.35)] transition hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]"
            >
              Browse Top-Ups <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl border border-[#a855f7]/30 bg-gradient-to-br from-[#1c0f32] via-[#0b0518] to-[#06020e] p-8 shadow-[0_10px_40px_rgba(168,85,247,0.15)]">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00f0ff]">Also Available</span>
            <h2 className="mt-2 text-xl font-black text-white">Gift Cards</h2>
            <p className="mt-2 text-sm text-white/60">
              PSN, Steam, Google Play, Apple iTunes, Xbox and ReiKai Store Credit.
            </p>
            <Link
              href="/gift-cards"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#00f0ff] px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_0_20px_rgba(0,240,255,0.35)] transition hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]"
            >
              Browse Gift Cards <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function SubscriptionCard({
  product,
}: {
  product: {
    id: string
    slug: string
    name: string
    imageUrl: string | null
    brand: string | null
    category: string | null
    featured: boolean
    minPrice: number | null
    maxPrice: number | null
  }
}) {
  return (
    <Link
      href={`/subscriptions/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-[#00f0ff]/50 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(0,240,255,0.2)] hover:-translate-y-1.5"
    >
      {/* Image / icon */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-[#1c0f32] to-[#06020e]">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-108"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Crown className="h-10 w-10 text-[#00f0ff]/40 transition-colors group-hover:text-[#00f0ff]" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#06020e] via-[#06020e]/60 to-transparent" />
        {product.featured && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#00f0ff] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-[0_0_12px_rgba(0,240,255,0.5)]">
            Featured
          </span>
        )}
        {product.category && (
          <span className="absolute right-2.5 top-2.5 rounded-full border border-white/20 bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white/80">
            {product.category}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-3.5 py-3">
        <p className="text-[12px] font-bold text-white leading-tight line-clamp-2 group-hover:text-[#00f0ff] transition-colors">{product.name}</p>
        {product.brand && (
          <p className="mt-0.5 text-[10px] font-semibold text-white/50">{product.brand}</p>
        )}
        {(product.minPrice !== null || product.maxPrice !== null) && (
          <p className="mt-1.5 font-mono text-xs font-semibold text-[#00f0ff]">
            {product.minPrice !== null ? formatBDT(product.minPrice) : ''}
            {product.minPrice !== product.maxPrice && product.maxPrice !== null
              ? ` – ${formatBDT(product.maxPrice)}`
              : ''}{' '}
            <span className="text-white/40 text-[10px]">BDT</span>
          </p>
        )}
      </div>
    </Link>
  )
}
