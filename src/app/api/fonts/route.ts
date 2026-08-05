export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import { requireAdmin } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  // O SDK do Supabase faz a chamada de list() via fetch por baixo dos panos,
  // e o Next.js estava fazendo cache dessa resposta apesar do
  // `dynamic = 'force-dynamic'` - o resultado ficava preso na primeira
  // chamada (lista vazia) mesmo depois de novos uploads. noStore() forca a
  // rota inteira a nao cachear nada.
  noStore()

  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { data, error } = await supabase.storage.from('Arquivo-Artes').list('fonts')

    if (error) {
      console.error('Erro ao listar fontes:', error)
      return NextResponse.json({ error: 'Erro ao listar fontes' }, { status: 500 })
    }

    const fonts = (data ?? [])
      .filter((f) => /\.(ttf|woff|woff2|otf)$/i.test(f.name))
      .map((f) => f.name)

    return NextResponse.json({ fonts })
  } catch (error) {
    console.error('Erro ao listar fontes:', error)
    return NextResponse.json(
      { error: 'Erro ao listar fontes' },
      { status: 500 }
    )
  }
}
