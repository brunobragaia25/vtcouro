'use client'

import { usePathname } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'

/**
 * Wrapper client-side do Analytics: o filtro beforeSend precisa nascer aqui.
 * O layout raiz e Server Component, e uma funcao passada como prop de Server
 * para Client Component nao serializa (quebra o build inteiro em producao).
 */
export function SiteAnalytics() {
  const pathname = usePathname()

  // Nao rastreia o painel administrativo, so as paginas publicas.
  // Nao monta nem o componente: depender so do beforeSend visto que o
  // script externo pode disparar o primeiro pageview antes do filtro estar
  // plugado, alem de nao termos garantia do formato exato de event.url.
  if (pathname?.startsWith('/admin')) return null

  return (
    <Analytics beforeSend={(event) => (event.url.includes('/admin') ? null : event)} />
  )
}
