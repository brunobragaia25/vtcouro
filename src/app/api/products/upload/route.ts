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

    // Criar pasta public/images/products se não existir
    const productsDir = join(process.cwd(), 'public/images/products')
    mkdirSync(productsDir, { recursive: true })

    let uploadedCount = 0
    const uploadedUrls: string[] = []
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const maxFileSize = 5 * 1024 * 1024 // 5MB

    for (const file of files) {
      // Validar extensão
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      if (!allowedExtensions.includes(ext)) {
        console.error(`Arquivo ${file.name} tem extensão não permitida: ${ext}`)
        continue
      }

      // Validar tamanho
      if (file.size > maxFileSize) {
        console.error(`Arquivo ${file.name} excede o tamanho máximo de 5MB`)
        continue
      }

      // Gerar nome único para o arquivo
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 8)
      const originalName = file.name.substring(0, file.name.lastIndexOf('.'))
      const newFileName = `${originalName}-${timestamp}-${randomString}${ext}`

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Salvar arquivo
      const filePath = join(productsDir, newFileName)
      writeFileSync(filePath, buffer)

      uploadedCount++
      uploadedUrls.push(`/images/products/${newFileName}`)
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
