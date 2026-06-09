export const dynamic = 'force-dynamic'

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })

  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext))
    return NextResponse.json({ error: 'Tipo não permitido' }, { status: 400 })

  if (file.size > MAX_FILE_SIZE)
    return NextResponse.json({ error: 'Arquivo excede 5MB' }, { status: 400 })

  const dir = join(process.cwd(), 'public/images/categories')
  mkdirSync(dir, { recursive: true })

  const fileName = `category-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
  writeFileSync(join(dir, fileName), Buffer.from(await file.arrayBuffer()))

  return NextResponse.json({ url: `/images/categories/${fileName}` })
}
