export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    let uploadedCount = 0
    const uploadedUrls: string[] = []

    for (const file of files) {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        console.error(`Arquivo ${file.name} tem extensão não permitida: ${ext}`)
        continue
      }

      if (file.size > MAX_FILE_SIZE) {
        console.error(`Arquivo ${file.name} excede o tamanho máximo de 5MB`)
        continue
      }

      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 8)
      const originalName = file.name.substring(0, file.name.lastIndexOf('.'))
      const newFileName = `${originalName}-${timestamp}-${randomString}${ext}`

      const buffer = await file.arrayBuffer()

      const { error } = await supabase.storage
        .from('Arquivo-Artes')
        .upload(`products/${newFileName}`, buffer, { contentType: file.type })

      if (error) {
        console.error(`Falha no upload de ${file.name}:`, error)
        continue
      }

      const { data } = supabase.storage.from('Arquivo-Artes').getPublicUrl(`products/${newFileName}`)
      uploadedUrls.push(data.publicUrl)
      uploadedCount++
    }

    if (uploadedCount === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo válido foi encontrado' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: `${uploadedCount} arquivo(s) enviado(s) com sucesso`,
      count: uploadedCount,
      urls: uploadedUrls,
    })
  } catch (error) {
    console.error('Erro ao fazer upload:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload dos arquivos' },
      { status: 500 }
    )
  }
}
