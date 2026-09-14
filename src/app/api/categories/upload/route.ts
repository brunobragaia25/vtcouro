export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'
import {
  optimizeImage,
  webpFileName,
  UPLOAD_OPTIONS,
  MAX_IMAGE_UPLOAD_BYTES,
  MAX_IMAGE_UPLOAD_LABEL,
} from '@/lib/imageUpload'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })

  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext))
    return NextResponse.json({ error: 'Tipo de arquivo não permitido' }, { status: 400 })

  if (file.size > MAX_IMAGE_UPLOAD_BYTES)
    return NextResponse.json(
      { error: `Arquivo excede ${MAX_IMAGE_UPLOAD_LABEL}` },
      { status: 400 }
    )

  const fileName = webpFileName('category')
  const buffer = await optimizeImage(file)

  const { error } = await supabase.storage
    .from('Arquivo-Artes')
    .upload(`categories/${fileName}`, buffer, UPLOAD_OPTIONS)

  if (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 })
  }

  const { data } = supabase.storage.from('Arquivo-Artes').getPublicUrl(`categories/${fileName}`)

  return NextResponse.json({ url: data.publicUrl })
}
