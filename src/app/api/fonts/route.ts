export const dynamic = 'force-dynamic'

import { readdirSync } from 'fs'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const fontsDir = join(process.cwd(), 'public/fonts')

    let fonts: string[] = []
    try {
      fonts = readdirSync(fontsDir).filter(file =>
        /\.(ttf|woff|woff2|otf)$/i.test(file)
      )
    } catch (error) {
      // Pasta não existe ainda, retorna array vazio
      fonts = []
    }

    return NextResponse.json({ fonts })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao listar fontes' },
      { status: 500 }
    )
  }
}
