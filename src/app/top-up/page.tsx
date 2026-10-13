import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getActiveCatalog, normalizeProductImageUrl } from '@/lib/catalog'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Zap, Shield, Clock, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Game Top-Up | ReiKai Arcade – Best Rates in Bangladesh',
  description:
    'Top up Valorant, PUBG Mobile, Genshin Impact, Free Fire, Steam, PSN, Xbox and more. Instant digital delivery in Bangladesh.',
}

function formatBDT(paisa: number) {
  return `৳${Math.round(paisa / 100).toLocaleString('en-BD')}`
}

export default async function TopUpPage() {
  const rawRows = await getActiveCatalog('topup')

  // Group rows by product id (left join duplicates rows per variant)
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
        imageUrl: normalizeProductImageUrl(row.imageUrl, 'topup'),
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

  return (
    <div className="min-h-screen bg-[#06020e] text-[#f4f2ff]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 bg-[#06020e] px-4 pb-14 pt-16 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_75%_25%,rgba(168,85,247,0.24),transparent_70%),radial-gradient(ellipse_60%_45%_at_20%_70%,rgba(0,240,255,0.18),transparent_65%),radial-gradient(circle_at_50%_40%,rgba(236,72,153,0.1),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/40">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">Game Top-Up</span>
          </nav>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#00f0ff] shadow-[0_0_16px_rgba(0,240,255,0.25)]">
            <Zap className="h-3.5 w-3.5 text-[#00f0ff]" /> Instant Digital Delivery
          </span>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Game Top-Up
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#00f0ff] drop-shadow-[0_0_25px_rgba(0,240,255,0.3)]">
              Bangladesh's Best Rates
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/60 leading-relaxed">
            Instantly top up your favourite games. Select a game below to choose your package with verified direct player ID reload.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { icon: Zap, text: 'Instant Delivery' },
              { icon: Shield, text: '100% Genuine' },
              { icon: Clock, text: '24/7 Service' },
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
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-xl font-bold text-white/40">No top-up products yet.</p>
            <p className="mt-2 text-sm text-white/30">
              Admin can add top-up products from{' '}
              <Link href="/admin/products/new" className="text-primary hover:underline">
                Admin → Products → New
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/top-up/${product.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-[#00f0ff]/50 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(0,240,255,0.2)] hover:-translate-y-1.5"
              >
                {/* Banner Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/5">
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
                      <span className="text-5xl opacity-30">🎮</span>
                    </div>
                  )}
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#06020e] via-[#06020e]/60 to-transparent" />
                  {product.featured && (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#00f0ff] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-[0_0_12px_rgba(0,240,255,0.5)]">
                      Featured
                    </span>
                  )}
                </div>

                {/* Price strip */}
                <div className="px-3.5 py-3">
                  <p className="text-[12px] font-bold text-white leading-tight line-clamp-2 group-hover:text-[#00f0ff] transition-colors">
                    {product.name}
                  </p>
                  {(product.minPrice !== null || product.maxPrice !== null) && (
                    <p className="mt-1.5 font-mono text-xs font-semibold text-[#00f0ff]">
                      {product.minPrice !== null ? formatBDT(product.minPrice) : ''}
                      {product.minPrice !== product.maxPrice && product.maxPrice !== null
                        ? ` - ${formatBDT(product.maxPrice)}`
                        : ''}{' '}
                      <span className="text-white/40 text-[10px]">BDT</span>
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Gift Cards cross-link */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-[#a855f7]/30 bg-gradient-to-br from-[#1c0f32] via-[#0b0518] to-[#06020e] p-8 sm:p-10 shadow-[0_10px_40px_rgba(168,85,247,0.15)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00f0ff]">Also Available</span>
              <h2 className="mt-2 text-2xl font-black text-white">ReiKai Arcade Gift Cards</h2>
              <p className="mt-2 max-w-md text-sm text-white/60">
                PSN, Steam, Google Play, Apple iTunes, Xbox and ReiKai Store Credit — all with instant code delivery.
              </p>
            </div>
            <Link
              href="/gift-cards"
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#00f0ff] px-7 py-4 font-extrabold text-white shadow-[0_0_25px_rgba(0,240,255,0.35)] transition-all duration-300 hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] hover:scale-102"
            >
              View Gift Cards <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
