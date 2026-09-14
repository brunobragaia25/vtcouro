'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Banner {
  id: string
  imageUrl: string
  mobileImageUrl?: string | null
  link?: string | null
}

export function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [current, setCurrent] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    fetch('/api/banners')
      .then((r) => r.json())
      .then((data) => setBanners(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  // Desktop e mobile sao imagens diferentes, entao nao da para resolver com
  // `sizes`. Antes as duas iam para o HTML e uma ficava escondida via CSS -
  // mas imagem escondida por CSS e baixada do mesmo jeito, ou seja, todo
  // visitante puxava o dobro de banners que via.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % Math.max(banners.length, 1))
  }, [banners.length])

  useEffect(() => {
    if (banners.length <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [banners.length, next])

  if (banners.length === 0) {
    return (
      <div className="w-full h-[420px] md:h-[600px] xl:h-[800px] bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Nenhum banner cadastrado</span>
      </div>
    )
  }

  const banner = banners[current]

  // So o slide atual e os vizinhos ficam montados. Com todos no DOM, cada
  // visita a home baixava os banners inteiros de uma vez - de longe o maior
  // consumo de egress do site. Os vizinhos entram para a transicao nao
  // piscar ao trocar de slide.
  const isNear = (i: number) => {
    if (banners.length <= 1) return true
    const d = Math.abs(i - current)
    return d <= 1 || d === banners.length - 1
  }

  const slides = (
    <>
      {banners.map((b, i) => {
        if (!isNear(i)) return null
        const src = isMobile && b.mobileImageUrl ? b.mobileImageUrl : b.imageUrl
        return (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={src}
              alt={`Banner ${i + 1}`}
              fill
              sizes="100vw"
              // Banner ocupa a tela inteira e o arquivo de origem ja e um
              // webp comprimido, entao o q75 padrao comprimia por cima e
              // sujava a imagem. Subir a qualidade aqui nao afeta o egress
              // do Supabase - so os bytes que a edge da Vercel entrega.
              quality={92}
              priority={i === 0}
              className="object-cover"
            />
          </div>
        )
      })}
    </>
  )

  return (
    <div className="relative w-full h-[420px] md:h-[600px] xl:h-[800px] overflow-hidden">
      {banner.link ? (
        <Link href={banner.link} className="absolute inset-0">
          {slides}
        </Link>
      ) : (
        <div className="absolute inset-0">{slides}</div>
      )}

      {banners.length > 1 && (
        <>
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === current ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
            aria-label="Banner anterior"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
            aria-label="Próximo banner"
          >
            ›
          </button>
        </>
      )}
    </div>
  )
}
