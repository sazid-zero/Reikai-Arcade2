import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
])

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, GIF, AVIF, and SVG are allowed.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Determine extension
    const originalExt = path.extname(file.name).toLowerCase()
    const safeExt = originalExt || (file.type === 'image/png' ? '.png' : file.type === 'image/webp' ? '.webp' : '.jpg')

    // Clean base name
    const rawName = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
    const fileName = `${rawName || 'upload'}-${randomUUID().slice(0, 8)}${safeExt}`

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    const publicUrl = `/uploads/${fileName}`

    return NextResponse.json({
      url: publicUrl,
      fileName,
      size: file.size,
      mimeType: file.type,
    }, { status: 201 })
  } catch (error) {
    console.error('Upload failed:', error)
    return NextResponse.json({ error: 'Internal server error while saving file' }, { status: 500 })
  }
}
