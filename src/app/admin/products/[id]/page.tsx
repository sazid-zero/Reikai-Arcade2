import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getAdminProduct, updateProduct } from '../../actions'

type Props = { params: Promise<{ id: string }> }

async function saveProduct(id: string, formData: FormData) {
  'use server'
  await updateProduct(id, {
    name: String(formData.get('name') || ''),
    slug: String(formData.get('slug') || ''),
    type: formData.get('type') === 'accessory' ? 'accessory' : 'game',
    status: formData.get('status') === 'active' ? 'active' : formData.get('status') === 'archived' ? 'archived' : 'draft',
    brand: String(formData.get('brand') || ''),
    platform: String(formData.get('platform') || ''),
    category: String(formData.get('category') || ''),
    imageUrl: String(formData.get('imageUrl') || ''),
    shortDescription: String(formData.get('shortDescription') || ''),
  })
  redirect('/admin/products')
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const product = await getAdminProduct(id)
  if (!product) notFound()

  return <main className="site-shell min-h-screen px-5 py-8 md:px-10"><div className="mx-auto max-w-3xl"><Link href="/admin/products" className="text-sm text-primary">← Products</Link><h1 className="mt-5 text-4xl font-bold">Edit product</h1><p className="mt-2 text-muted-foreground">Update catalog details and storefront visibility.</p><form action={saveProduct.bind(null, product.id)} className="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-black/20 p-6 md:grid-cols-2 md:p-8"><label className="text-sm font-semibold">Name<input name="name" required defaultValue={product.name} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" /></label><label className="text-sm font-semibold">Slug<input name="slug" required pattern="[a-z0-9-]+" defaultValue={product.slug} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" /></label><label className="text-sm font-semibold">Type<select name="type" defaultValue={product.type} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"><option value="game">Game</option><option value="accessory">Accessory</option></select></label><label className="text-sm font-semibold">Status<select name="status" defaultValue={product.status} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"><option value="draft">Draft</option><option value="active">Active</option><option value="archived">Archived</option></select></label><label className="text-sm font-semibold">Brand<input name="brand" defaultValue={product.brand ?? ''} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" /></label><label className="text-sm font-semibold">Platform<input name="platform" defaultValue={product.platform ?? ''} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" /></label><label className="text-sm font-semibold">Category<input name="category" defaultValue={product.category ?? ''} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" /></label><label className="text-sm font-semibold">Image URL<input name="imageUrl" type="url" defaultValue={product.imageUrl ?? ''} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" /></label><label className="text-sm font-semibold md:col-span-2">Short description<textarea name="shortDescription" rows={4} defaultValue={product.shortDescription ?? ''} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" /></label><div className="flex gap-3 md:col-span-2"><button className="rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground" type="submit">Save changes</button><Link href="/admin/products" className="rounded-xl border border-white/15 px-5 py-3 font-semibold">Cancel</Link></div></form></div></main>
}
