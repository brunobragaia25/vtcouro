'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Flame, MessageCircle } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'

// Banner da Venda Especial na home. Some sozinho quando nao ha nenhum
// produto marcado com estoque, entao nao precisa ser desligado a mao.
export function StockSaleBanner() {
  const { data: products = [] } = useProducts()
  const stockProducts = products.filter((p: any) => p.isActive && p.isStockSale && p.stockQuantity > 0)

  if (stockProducts.length === 0) return null

  const totalUnits = stockProducts.reduce((sum: number, p: any) => sum + p.stockQuantity, 0)
  const showcase = stockProducts.filter((p: any) => p.imageUrl).slice(0, 3)
  const tilts = ['-rotate-6 -translate-x-2', 'rotate-2 z-10 scale-105', 'rotate-6 translate-x-2']

  return (
    <section className="w-full bg-white flex justify-center py-8 md:py-12">
      <div className="max-w-container w-full px-5 md:px-8">
        <div className="relative overflow-hidden rounded-[28px] md:rounded-[40px] bg-gradient-to-br from-[#5c0f0a] via-[#8f1b14] to-[#b3261e] p-8 md:p-12 xl:p-16">
          {/* Decoracao de fundo */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#d2741f]/30 blur-3xl" />

          <div className="relative grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center gap-10">
            {/* Texto */}
            <div className="flex flex-col gap-5 md:gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-white backdrop-blur">
                <Flame size={14} className="text-[#ffb36b]" />
                Estoque limitado
              </span>

              <h2 className="font-serif text-5xl font-semibold leading-[1.02] text-white md:text-6xl xl:text-8xl">
                Venda
                <br />
                <span className="text-[#ffb36b]">Especial</span>
              </h2>

              <p className="max-w-lg text-base text-white/90 md:text-lg">
                Peças em couro selecionadas, prontas para entrega, enquanto durar o estoque.
                Escolha o que quer e feche direto com a nossa equipe.
              </p>

              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <div>
                  <p className="text-3xl font-semibold text-white">{stockProducts.length}</p>
                  <p className="text-xs uppercase tracking-widest text-white/70">
                    {stockProducts.length === 1 ? 'modelo' : 'modelos'}
                  </p>
                </div>
                <div className="w-px bg-white/25" />
                <div>
                  <p className="text-3xl font-semibold text-white">{totalUnits}</p>
                  <p className="text-xs uppercase tracking-widest text-white/70">peças restantes</p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 pt-2 sm:flex-row sm:items-center sm:gap-5">
                <Link
                  href="/venda-especial"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-white px-8 py-4 font-semibold text-[#8f1b14] shadow-lg transition hover:bg-[#fff5ec] sm:w-auto"
                >
                  Ver as ofertas
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <span className="inline-flex items-center gap-2 text-sm text-white/80">
                  <MessageCircle size={16} />
                  Fechamento pelo WhatsApp
                </span>
              </div>
            </div>

            {/* Lado direito: tres chamas, com a vitrine de produtos na frente quando ha fotos */}
            <Link
              href="/venda-especial"
              aria-label="Ver produtos da venda especial"
              className="relative hidden h-[380px] items-center justify-center md:flex xl:h-[460px]"
            >
              <div className="absolute h-80 w-80 rounded-full bg-[#ff9a3c]/30 blur-3xl xl:h-[26rem] xl:w-[26rem]" />
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  showcase.length > 0 ? 'opacity-40' : ''
                }`}
              >
                <Flame
                  strokeWidth={1.25}
                  className="absolute h-[190px] w-[190px] -translate-x-[115px] translate-y-10 -rotate-12 fill-[#ff9a3c]/20 text-[#ffb36b] drop-shadow-[0_0_30px_rgba(255,154,60,0.5)] xl:h-[250px] xl:w-[250px] xl:-translate-x-[150px]"
                />
                <Flame
                  strokeWidth={1.25}
                  className="absolute h-[190px] w-[190px] translate-x-[115px] translate-y-10 rotate-12 fill-[#ff9a3c]/20 text-[#ffb36b] drop-shadow-[0_0_30px_rgba(255,154,60,0.5)] xl:h-[250px] xl:w-[250px] xl:translate-x-[150px]"
                />
                <Flame
                  strokeWidth={1.25}
                  className="absolute h-[340px] w-[340px] fill-[#ff9a3c]/30 text-[#ffb36b] drop-shadow-[0_0_50px_rgba(255,154,60,0.6)] xl:h-[440px] xl:w-[440px]"
                />
              </div>

              {showcase.map((product: any, index: number) => (
                <div
                  key={product.id}
                  className={`relative -mx-6 w-40 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl transition-transform duration-300 hover:-translate-y-2 xl:w-48 ${
                    tilts[index] || ''
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full bg-gray-100">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-white px-3 py-2">
                    <p className="truncate text-xs font-semibold text-gray-900">{product.name}</p>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#b3261e]">
                      {product.stockQuantity} un.
                    </p>
                  </div>
                </div>
              ))}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
