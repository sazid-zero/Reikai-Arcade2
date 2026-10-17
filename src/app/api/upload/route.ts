import { NextResponse } from 'next/server'
import path from 'path'
import { randomUUID } from 'crypto'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/ogg',
])

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, GIF, AVIF, SVG, and MP4/WebM/MOV videos are allowed.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 100MB.' },
        { status: 400 }
      )
    }

    // Clean filename
    const originalExt = path.extname(file.name).toLowerCase()
    const safeExt = originalExt || (file.type === 'image/png' ? '.png' : file.type === 'image/webp' ? '.webp' : '.jpg')
    const rawName = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
    const fileName = `${rawName || 'upload'}-${randomUUID().slice(0, 8)}${safeExt}`

    // ── Vercel Blob (production) ───────────────────────────────────────────────
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob')
      const blob = await put(`uploads/${fileName}`, file, {
        access: 'public',
        contentType: file.type,
      })
      return NextResponse.json({
        url: blob.url,
        fileName,
        size: file.size,
        mimeType: file.type,
      }, { status: 201 })
    }

    // ── Local filesystem fallback (dev only) ──────────────────────────────────
    const { writeFile, mkdir } = await import('fs/promises')
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(path.join(uploadDir, fileName), buffer)

    return NextResponse.json({
      url: `/uploads/${fileName}`,
      fileName,
      size: file.size,
      mimeType: file.type,
    }, { status: 201 })

  } catch (error) {
    console.error('Upload failed:', error)
    return NextResponse.json({ error: 'Internal server error while saving file' }, { status: 500 })
  }
}
