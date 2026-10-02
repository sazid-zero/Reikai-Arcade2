import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@lib/auth'
import { getAdminProduct, getProductVariants } from '../../actions'
import { ProductEditForm } from './product-edit-form'

type Props = { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const { id } = await params
  const [product, variants] = await Promise.all([
    getAdminProduct(id),
    getProductVariants(id),
  ])

  if (!product) notFound()

  return (
    <main className="site-shell min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-6">
          <Link href="/admin/products" className="text-sm text-primary hover:underline">← Products</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground truncate">{product.name}</span>
        </div>
        <div className="flex items-center justify-between mt-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="mt-1 text-sm text-muted-foreground font-mono">ID: {product.id}</p>
          </div>
          <div className="flex gap-2">
            {product.status === 'active' && (
              <>
                <Link href={product.type === 'game' ? `/games/${product.slug}` : `/accessories/${product.slug}`} target="_blank" className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5 transition">
                  View →
                </Link>
              </>
            )}
          </div>
        </div>
        <ProductEditForm product={product} variants={variants} />
      </div>
    </main>
  )
}
