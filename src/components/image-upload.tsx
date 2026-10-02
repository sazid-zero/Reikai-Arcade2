'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { UploadCloud, X, Link as LinkIcon, Loader2, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
}

export function ImageUpload({
  value,
  onChange,
  label = 'Product Image',
  placeholder = '/covers/game.jpg or https://...',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WebP, etc.).')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file is too large (max 10MB).')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      onChange(data.url)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err?.message || 'Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center gap-1 text-[11px] text-primary hover:underline"
        >
          <LinkIcon size={12} />
          {showUrlInput ? 'Hide URL input' : 'Enter URL manually'}
        </button>
      </div>

      {/* Manual URL input toggle */}
      {showUrlInput && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      )}

      {/* Image Preview / Upload Area */}
      {value ? (
        <div className="group relative flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/20">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
            {value.startsWith('/') || value.startsWith('http') ? (
              <Image
                src={value}
                alt="Product preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <ImageIcon size={24} />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">{value}</p>
            <p className="mt-1 text-[11px] text-emerald-400">✓ Image ready</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-white/20 transition"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="flex items-center gap-1 rounded-lg bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-400 hover:bg-red-500/20 transition"
              >
                <X size={12} /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] px-6 py-7 text-center cursor-pointer transition hover:border-primary/50 hover:bg-white/[0.04]"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={28} className="animate-spin text-primary" />
              <p className="text-xs font-medium text-muted-foreground">Uploading file to server...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-primary/10 p-3 text-primary group-hover:scale-110 transition-transform">
                <UploadCloud size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Click to upload or drag & drop image
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  PNG, JPG, WebP, GIF or AVIF up to 10MB (stored locally)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFile(e.target.files[0])
          }
        }}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}
