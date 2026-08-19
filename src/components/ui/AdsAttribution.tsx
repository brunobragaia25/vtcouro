'use client'

import { useEffect } from 'react'
import { captureAdsAttribution } from '@/lib/seo'

/**
 * Roda uma vez na montagem do layout raiz: verifica a URL de chegada em
 * busca de sinais de campanha do Google Ads (gclid / utm_source=google) e,
 * se encontrar, marca a sessao para os botoes de WhatsApp do site usarem a
 * mensagem da campanha (ver whatsappUrl em src/lib/seo.ts).
 */
export function AdsAttribution() {
  useEffect(() => {
    captureAdsAttribution()
  }, [])

  return null
}
