'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Product, ProductVariant } from '@lib/db/src/schema'
import { updateProduct, archiveProduct, deleteProduct, createVariant, updateVariant, deleteVariant } from '../../actions'
import { Plus, Trash2, Edit3, Check, X, PackageSearch } from 'lucide-react'
import { ImageUpload } from '@/components/image-upload'

type Props = {
  product: Product
  variants: ProductVariant[]
}

export function ProductEditForm({ product, variants: initialVariants }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [variants, setVariants] = useState(initialVariants)
  const [showVariantForm, setShowVariantForm] = useState(false)
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Product fields state
  const [form, setForm] = useState({
    name: product.name,
    slug: product.slug,
    type: product.type as 'game' | 'accessory',
    status: product.status as 'draft' | 'active' | 'archived',
    brand: product.brand ?? '',
    platform: product.platform ?? '',
    category: product.category ?? '',
    imageUrl: product.imageUrl ?? '',
    shortDescription: product.shortDescription ?? '',
    description: product.description ?? '',
    featured: product.featured,
    sortOrder: product.sortOrder,
    galleryImages: (product.galleryImages as string[] | null) ?? [],
    tags: ((product.tags as string[] | null) ?? []).join(', '),
    features: ((product.features as string[] | null) ?? []).join('\n'),
    specs: Object.entries((product.specs as Record<string, string> | null) ?? {}).map(([k, v]) => `${k}: ${v}`).join('\n'),
  })

  // Variant form state
  const [variantForm, setVariantForm] = useState({
    title: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    stockQuantity: '0',
    active: true,
  })

  const flash = (msg: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000) }
    else { setErrorMsg(msg); setTimeout(() => setErrorMsg(''), 5000) }
  }

  const handleSaveProduct = () => {
    startTransition(async () => {
      try {
        // Parse specs
        const specsObj: Record<string, string> = {}
        form.specs.split('\n').filter(Boolean).forEach((line) => {
          const [k, ...rest] = line.split(':')
          if (k && rest.length) specsObj[k.trim()] = rest.join(':').trim()
        })
        await updateProduct(product.id, {
          ...form,
          imageUrl: form.imageUrl || undefined,
          brand: form.brand || undefined,
          platform: form.platform || undefined,
          category: form.category || undefined,
          shortDescription: form.shortDescription || undefined,
          description: form.description || undefined,
          galleryImages: form.galleryImages.filter(Boolean),
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
          features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
          specs: specsObj,
        })
        flash('Product saved!')
        router.refresh()
      } catch (e: unknown) {
        flash(e instanceof Error ? e.message : 'Save failed', 'error')
      }
    })
  }

  const handleArchive = () => {
    if (!confirm('Archive this product? It will be hidden from the storefront.')) return
    startTransition(async () => {
      await archiveProduct(product.id)
      flash('Product archived')
      router.refresh()
    })
  }

  const handleDelete = () => {
    if (!confirm('PERMANENTLY delete this product and all variants? This cannot be undone.')) return
    startTransition(async () => {
      await deleteProduct(product.id)
      router.push('/admin/products')
    })
  }

  const handleAddVariant = () => {
    startTransition(async () => {
      try {
        const newVariant = await createVariant(product.id, {
          title: variantForm.title,
          sku: variantForm.sku,
          price: Math.round(parseFloat(variantForm.price) * 100),
          compareAtPrice: variantForm.compareAtPrice ? Math.round(parseFloat(variantForm.compareAtPrice) * 100) : undefined,
          stockQuantity: parseInt(variantForm.stockQuantity),
          active: variantForm.active,
        })
        setVariants((v) => [...v, newVariant])
        setShowVariantForm(false)
        setVariantForm({ title: '', sku: '', price: '', compareAtPrice: '', stockQuantity: '0', active: true })
        flash('Variant added!')
      } catch (e: unknown) {
        flash(e instanceof Error ? e.message : 'Failed to add variant', 'error')
      }
    })
  }

  const handleDeleteVariant = (variantId: string) => {
    if (!confirm('Delete this variant?')) return
    startTransition(async () => {
      await deleteVariant(variantId)
      setVariants((v) => v.filter((x) => x.id !== variantId))
      flash('Variant deleted')
    })
  }

  const inputCls = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition'
  const labelCls = 'block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5'

  return (
    <div className="space-y-8">
      {/* Feedback */}
      {successMsg && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-400">{successMsg}</div>}
      {errorMsg && <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">{errorMsg}</div>}

      {/* Core Info */}
      <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
        <h2 className="mb-5 font-bold text-lg">Product Info</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <label><span className={labelCls}>Name *</span><input className={inputCls} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></label>
          <label><span className={labelCls}>Slug *</span><input className={inputCls} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} /></label>
          <label>
            <span className={labelCls}>Type</span>
            <select className={inputCls} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'game' | 'accessory' }))}>
              <option value="game">Game</option>
              <option value="accessory">Accessory</option>
            </select>
          </label>
          <label>
            <span className={labelCls}>Status</span>
            <select className={inputCls} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'draft' | 'active' | 'archived' }))}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label><span className={labelCls}>Brand</span><input className={inputCls} value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} /></label>
          <label><span className={labelCls}>Platform</span><input className={inputCls} value={form.platform} onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))} placeholder="PC, PlayStation 5, Xbox" /></label>
          <label><span className={labelCls}>Category</span><input className={inputCls} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} /></label>
          <div className="md:col-span-2">
            <ImageUpload
              value={form.imageUrl}
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
              label="Primary Cover Image"
            />
          </div>
          <label className="md:col-span-2"><span className={labelCls}>Short Description</span><textarea className={inputCls} rows={2} value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} /></label>
          <label className="md:col-span-2"><span className={labelCls}>Full Description</span><textarea className={inputCls} rows={5} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="h-4 w-4 rounded" />
              <span className="text-sm font-medium">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort Order</span>
              <input type="number" className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
            </label>
          </div>
        </div>
      </section>

      {/* Rich Content */}
      <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
        <h2 className="mb-5 font-bold text-lg">Rich Content</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="md:col-span-2"><span className={labelCls}>Gallery Images (one URL per line)</span>
            <textarea className={inputCls} rows={3} value={form.galleryImages.join('\n')} onChange={(e) => setForm((f) => ({ ...f, galleryImages: e.target.value.split('\n').map((s) => s.trim()) }))} placeholder="https://..." />
          </label>
          <label><span className={labelCls}>Tags (comma-separated)</span><input className={inputCls} value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="action, rpg, open-world" /></label>
          <label><span className={labelCls}>Features (one per line)</span><textarea className={inputCls} rows={4} value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} placeholder="4K Ultra HD support&#10;Ray tracing enabled" /></label>
          <label className="md:col-span-2"><span className={labelCls}>Specs (Key: Value, one per line)</span>
            <textarea className={inputCls} rows={4} value={form.specs} onChange={(e) => setForm((f) => ({ ...f, specs: e.target.value }))} placeholder="Developer: From Software&#10;Publisher: Bandai Namco&#10;Release: 2024" />
          </label>
        </div>
      </section>

      {/* Variants */}
      <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-lg">Variants & Pricing</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Price in ৳ (Taka). Stock is auto-tracked.</p>
          </div>
          <button onClick={() => setShowVariantForm(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/30 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition">
            <Plus className="h-4 w-4" /> Add Variant
          </button>
        </div>

        {variants.length === 0 && !showVariantForm && (
          <div className="rounded-xl border border-dashed border-white/15 p-8 text-center text-muted-foreground">
            <PackageSearch className="mx-auto h-8 w-8 mb-3 opacity-40" />
            <p className="text-sm">No variants yet. Add at least one variant with a price to make this product purchasable.</p>
          </div>
        )}

        {variants.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.04] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Title</th>
                  <th className="px-4 py-3 text-left font-medium">SKU</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-left font-medium">Compare At</th>
                  <th className="px-4 py-3 text-left font-medium">Stock</th>
                  <th className="px-4 py-3 text-left font-medium">Active</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {variants.map((v) => (
                  <tr key={v.id}>
                    <td className="px-4 py-3 font-medium">{v.title}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{v.sku}</td>
                    <td className="px-4 py-3">৳{(v.price / 100).toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.compareAtPrice ? `৳${(v.compareAtPrice / 100).toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={v.stockQuantity <= 5 ? 'text-orange-400 font-semibold' : ''}>{v.stockQuantity}</span>
                    </td>
                    <td className="px-4 py-3">
                      {v.active ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-muted-foreground" />}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteVariant(v.id)} className="rounded-lg p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Variant Form */}
        {showVariantForm && (
          <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-5">
            <h3 className="font-semibold mb-4">New Variant</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <label><span className={labelCls}>Title *</span><input className={inputCls} value={variantForm.title} onChange={(e) => setVariantForm((f) => ({ ...f, title: e.target.value }))} placeholder="Standard Edition" /></label>
              <label><span className={labelCls}>SKU *</span><input className={inputCls} value={variantForm.sku} onChange={(e) => setVariantForm((f) => ({ ...f, sku: e.target.value }))} placeholder="GAME-001-STD" /></label>
              <label><span className={labelCls}>Price (৳) *</span><input className={inputCls} type="number" value={variantForm.price} onChange={(e) => setVariantForm((f) => ({ ...f, price: e.target.value }))} placeholder="3500" /></label>
              <label><span className={labelCls}>Compare At (৳)</span><input className={inputCls} type="number" value={variantForm.compareAtPrice} onChange={(e) => setVariantForm((f) => ({ ...f, compareAtPrice: e.target.value }))} placeholder="4000" /></label>
              <label><span className={labelCls}>Stock</span><input className={inputCls} type="number" value={variantForm.stockQuantity} onChange={(e) => setVariantForm((f) => ({ ...f, stockQuantity: e.target.value }))} /></label>
              <label className="flex items-center gap-2 pt-6 cursor-pointer">
                <input type="checkbox" checked={variantForm.active} onChange={(e) => setVariantForm((f) => ({ ...f, active: e.target.checked }))} className="h-4 w-4 rounded" />
                <span className="text-sm">Active</span>
              </label>
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={handleAddVariant} disabled={isPending} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition">
                {isPending ? 'Adding…' : 'Add Variant'}
              </button>
              <button onClick={() => setShowVariantForm(false)} className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold hover:bg-white/5 transition">
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button onClick={handleSaveProduct} disabled={isPending} className="rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition">
          {isPending ? 'Saving…' : 'Save Changes'}
        </button>
        <button onClick={handleArchive} disabled={isPending} className="rounded-xl border border-white/10 px-6 py-3 font-semibold hover:bg-white/5 transition">
          Archive
        </button>
        <button onClick={handleDelete} disabled={isPending} className="rounded-xl border border-red-500/30 px-6 py-3 font-semibold text-red-400 hover:bg-red-500/10 transition ml-auto">
          Delete Product
        </button>
      </div>
    </div>
  )
}
