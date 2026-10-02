'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ImageUpload } from '@/components/image-upload'
import { createProduct } from '../../actions'

export function NewProductForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [type, setType] = useState<'game' | 'accessory'>('game')
  const [status, setStatus] = useState<'draft' | 'active'>('draft')
  const [brand, setBrand] = useState('')
  const [platform, setPlatform] = useState('')
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [featured, setFeatured] = useState(false)
  const [sortOrder, setSortOrder] = useState(0)

  // Auto-generate slug when name changes if user hasn't manually edited slug
  const handleNameChange = (val: string) => {
    setName(val)
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      try {
        const product = await createProduct({
          name: name.trim(),
          slug: slug.trim(),
          type,
          status,
          brand: brand.trim() || undefined,
          platform: platform.trim() || undefined,
          category: category.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          shortDescription: shortDescription.trim() || undefined,
          description: description.trim() || undefined,
          featured,
          sortOrder,
        })

        router.push(`/admin/products/${product.id}`)
      } catch (err: any) {
        console.error('Failed to create product:', err)
        setError(err?.message || 'Failed to create product. Check that the slug is unique.')
      }
    })
  }

  const inputCls = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition'
  const labelCls = 'block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-black/20 p-6 grid gap-5 md:grid-cols-2">
        <label>
          <span className={labelCls}>Name *</span>
          <input
            name="name"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputCls}
            placeholder="e.g. Elden Ring: Shadow of the Erdtree"
          />
        </label>

        <label>
          <span className={labelCls}>Slug *</span>
          <input
            name="slug"
            required
            pattern="[a-z0-9-]+"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputCls}
            placeholder="elden-ring"
          />
        </label>

        <label>
          <span className={labelCls}>Type</span>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'game' | 'accessory')}
            className={inputCls}
          >
            <option value="game">Game</option>
            <option value="accessory">Accessory</option>
          </select>
        </label>

        <label>
          <span className={labelCls}>Status</span>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'active')}
            className={inputCls}
          >
            <option value="draft">Draft (Hidden)</option>
            <option value="active">Active (Visible)</option>
          </select>
        </label>

        <label>
          <span className={labelCls}>Brand / Publisher</span>
          <input
            name="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className={inputCls}
            placeholder="e.g. Sony, Bandai Namco, Razer"
          />
        </label>

        <label>
          <span className={labelCls}>Platform</span>
          <input
            name="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className={inputCls}
            placeholder="e.g. PS5, PC, Xbox"
          />
        </label>

        <label className="md:col-span-2">
          <span className={labelCls}>Category</span>
          <input
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
            placeholder="e.g. Action RPG, Controllers, Headsets"
          />
        </label>

        {/* Local Drag-and-Drop Image Upload */}
        <div className="md:col-span-2">
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            label="Product Cover Image"
            placeholder="/covers/my-game.jpg or upload from your computer"
          />
        </div>

        <label className="md:col-span-2">
          <span className={labelCls}>Short Description</span>
          <textarea
            name="shortDescription"
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className={inputCls}
            placeholder="Brief punchy summary shown in cards..."
          />
        </label>

        <label className="md:col-span-2">
          <span className={labelCls}>Full Description</span>
          <textarea
            name="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputCls}
            placeholder="Detailed product story and background..."
          />
        </label>

        <div className="md:col-span-2 flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              name="featured"
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <span className="text-sm font-medium">Featured on homepage</span>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort Order</span>
            <input
              name="sortOrder"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition"
        >
          {isPending ? 'Creating Product...' : 'Create & Add Variants →'}
        </button>
        <Link
          href="/admin/products"
          className="rounded-xl border border-white/10 px-6 py-3 font-semibold hover:bg-white/5 transition"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
