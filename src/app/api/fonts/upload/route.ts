export const dynamic = 'force-dynamic'

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    // Criar pasta public/fonts se não existir
    const fontsDir = join(process.cwd(), 'public/fonts')
    mkdirSync(fontsDir, { recursive: true })

    let uploadedCount = 0
    const allowedExtensions = ['.ttf', '.woff', '.woff2', '.otf']

    for (const file of files) {
      // Validar extensão
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      if (!allowedExtensions.includes(ext)) {
        continue
      }

      // Validar tamanho (máx 5MB por arquivo)
      if (file.size > 5 * 1024 * 1024) {
        continue
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Sanitizar nome do arquivo (evitar path traversal)
      const sanitizedName = file.name.replace(/[^\w.-]/g, '_')
      const filePath = join(fontsDir, sanitizedName)
      writeFileSync(filePath, buffer)
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
