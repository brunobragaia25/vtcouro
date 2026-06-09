export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
    return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 })

  if (file.size > MAX_FILE_SIZE)
    return NextResponse.json({ error: 'Arquivo excede 5MB' }, { status: 400 })

  const fileName = `banner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
  const buffer = await file.arrayBuffer()

  const { error } = await supabase.storage
    .from('Arquivo-Artes')
    .upload(`banners/${fileName}`, buffer, { contentType: file.type })

  if (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 })
  }

  const { data } = supabase.storage.from('Arquivo-Artes').getPublicUrl(`banners/${fileName}`)

  return NextResponse.json({ url: data.publicUrl })
}
