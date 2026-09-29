import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createProduct } from '../../actions'

async function saveProduct(formData: FormData) {
  'use server'
  await createProduct({
    name: String(formData.get('name') || ''),
    slug: String(formData.get('slug') || ''),
    type: formData.get('type') === 'accessory' ? 'accessory' : 'game',
    status: formData.get('status') === 'active' ? 'active' : 'draft',
    brand: String(formData.get('brand') || ''),
    platform: String(formData.get('platform') || ''),
    category: String(formData.get('category') || ''),
    imageUrl: String(formData.get('imageUrl') || ''),
    shortDescription: String(formData.get('shortDescription') || ''),
  })
  redirect('/admin/products')
}

export default function NewProductPage() {
  return <main className="site-shell min-h-screen px-5 py-8 md:px-10"><div className="mx-auto max-w-3xl"><Link href="/admin/products" className="text-sm text-primary">← Products</Link><h1 className="mt-5 text-4xl font-bold">Add product</h1><p className="mt-2 text-muted-foreground">Create a game or accessory for the store catalog.</p><form action={saveProduct} className="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-black/20 p-6 md:grid-cols-2 md:p-8"><label className="text-sm font-semibold">Name<input name="name" required className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" placeholder="Wuthering Waves" /></label><label className="text-sm font-semibold">Slug<input name="slug" required pattern="[a-z0-9-]+" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" placeholder="wuthering-waves" /></label><label className="text-sm font-semibold">Type<select name="type" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"><option value="game">Game</option><option value="accessory">Accessory</option></select></label><label className="text-sm font-semibold">Status<select name="status" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"><option value="draft">Draft</option><option value="active">Active</option></select></label><label className="text-sm font-semibold">Brand<input name="brand" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" /></label><label className="text-sm font-semibold">Platform<input name="platform" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" placeholder="PC, PlayStation" /></label><label className="text-sm font-semibold">Category<input name="category" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" /></label><label className="text-sm font-semibold">Image URL<input name="imageUrl" type="url" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" /></label><label className="text-sm font-semibold md:col-span-2">Short description<textarea name="shortDescription" rows={3} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3" /></label><div className="flex gap-3 md:col-span-2"><Link href="/admin" className="rounded-xl border border-white/10 px-5 py-3 font-semibold">Cancel</Link><button className="rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground">Create product</button></div></form></div></main>
}
