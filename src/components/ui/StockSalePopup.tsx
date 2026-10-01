'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowRight, Flame, X } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { getStockSaleProducts, STOCK_SALE_TEXT } from '@/lib/stockSale'

// Mostra uma vez por sessao do navegador (sessionStorage), so quando ha
// produto na Venda Especial. Nao aparece no admin nem na propria pagina.
const SEEN_KEY = 'venda_especial_popup_seen'

export function StockSalePopup() {
  const pathname = usePathname()
  const { data: products = [] } = useProducts()
  const [open, setOpen] = useState(false)

  const hasStockSale = getStockSaleProducts(products).length > 0
  const blockedPage = !pathname || pathname.startsWith('/admin') || pathname.startsWith('/venda-especial')

  useEffect(() => {
    if (!hasStockSale || blockedPage) return
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return
    } catch {}

    const timer = setTimeout(() => {
      setOpen(true)
      try {
        sessionStorage.setItem(SEEN_KEY, '1')
      } catch {}
    }, 1200)
    return () => clearTimeout(timer)
  }, [hasStockSale, blockedPage])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-4 py-6"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="venda-especial-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-[28px] bg-gradient-to-br from-[#ddd5ca] via-[#d0c7ba] to-[#c2b8aa] p-8 text-center shadow-2xl md:p-10"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/40 blur-2xl" />

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fechar"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#4b1c09]/10 text-[#4b1c09] transition hover:bg-[#4b1c09]/20"
        >
          <X size={18} />
        </button>

        <div className="relative flex flex-col items-center gap-4">
          <div className="relative flex h-24 w-40 items-end justify-center">
            <div className="absolute h-28 w-28 rounded-full bg-[#d2741f]/25 blur-2xl" />
            <Flame strokeWidth={1.25} className="absolute h-14 w-14 -translate-x-12 -rotate-12 fill-[#d2741f]/25 text-[#8B5240]" />
            <Flame strokeWidth={1.25} className="absolute h-14 w-14 translate-x-12 rotate-12 fill-[#d2741f]/25 text-[#8B5240]" />
            <Flame strokeWidth={1.25} className="relative h-24 w-24 fill-[#d2741f]/30 text-[#8B5240] drop-shadow-[0_0_20px_rgba(210,116,31,0.4)]" />
          </div>

          <p className="text-xs font-extrabold uppercase tracking-widest text-[#8B5240]">
            Estoque limitado
          </p>
          <h2 id="venda-especial-title" className="font-serif text-4xl font-semibold leading-tight text-[#3a1a0c] md:text-5xl">
            Venda Especial
          </h2>
          <p className="max-w-sm text-base text-[#3a1a0c]/90">{STOCK_SALE_TEXT}</p>

          <Link
            href="/venda-especial"
            onClick={() => setOpen(false)}
            className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#4b1c09] px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-[#3d1707] sm:w-auto"
          >
            Ver as ofertas
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm text-[#4b1c09]/70 underline-offset-2 hover:underline"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  )
}
