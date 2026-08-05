export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ALLOWED_EXTENSIONS = ['.ttf', '.woff', '.woff2', '.otf']
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

    for (const file of files) {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      if (!ALLOWED_EXTENSIONS.includes(ext)) continue
      if (file.size > MAX_FILE_SIZE) continue

      // Sanitiza o nome (evita path traversal e caracteres problematicos no bucket)
      const sanitizedName = file.name.replace(/[^\w.-]/g, '_')
      const buffer = await file.arrayBuffer()

      const { error } = await supabase.storage
        .from('Arquivo-Artes')
        .upload(`fonts/${sanitizedName}`, buffer, {
          contentType: file.type || 'font/ttf',
          upsert: true,
        })

      if (error) {
        console.error(`Falha no upload de ${file.name}:`, error)
        continue
      }

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
    })
  } catch (error) {
    console.error('Erro ao fazer upload:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload dos arquivos' },
      { status: 500 }
    )
  }
}
