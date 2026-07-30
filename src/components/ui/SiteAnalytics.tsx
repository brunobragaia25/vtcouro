'use client'

import { Analytics } from '@vercel/analytics/next'

/**
 * Wrapper client-side do Analytics: o filtro beforeSend precisa nascer aqui.
 * O layout raiz e Server Component, e uma funcao passada como prop de Server
 * para Client Component nao serializa (quebra o build inteiro em producao).
 */
export function SiteAnalytics() {
  return (
    <Analytics beforeSend={(event) => (event.url.startsWith('/admin') ? null : event)} />
  )
}
