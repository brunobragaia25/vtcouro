import { unlinkSync } from 'fs'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const filename = request.nextUrl.searchParams.get('filename')

    if (!filename) {
      return NextResponse.json(
        { error: 'Nome do arquivo não fornecido' },
        { status: 400 }
      )
    }

    // Validar nome do arquivo (evitar path traversal)
    if (filename.includes('/') || filename.includes('..')) {
      return NextResponse.json(
        { error: 'Nome de arquivo inválido' },
        { status: 400 }
      )
    }

    const filePath = join(process.cwd(), 'public/fonts', filename)

    try {
      unlinkSync(filePath)
      return NextResponse.json({
        message: `${filename} foi deletado com sucesso`,
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Erro ao deletar:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar arquivo' },
      { status: 500 }
    )
  }
}
