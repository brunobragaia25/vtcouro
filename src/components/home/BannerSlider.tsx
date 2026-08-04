'use client'

import { useEffect, useState, useCallback } from 'react'
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

  useEffect(() => {
    fetch('/api/banners')
      .then((r) => r.json())
      .then((data) => setBanners(Array.isArray(data) ? data : []))
      .catch(() => {})
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
      <div className="w-full h-[520px] md:h-[600px] xl:h-[800px] bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-sm">Nenhum banner cadastrado</span>
      </div>
    )
  }

  const banner = banners[current]

  const slides = (
    <>
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Desktop */}
          <img
            src={b.imageUrl}
            alt={`Banner ${i + 1}`}
            className={`w-full h-full object-cover ${b.mobileImageUrl ? 'hidden md:block' : 'block'}`}
          />
          {/* Mobile */}
          {b.mobileImageUrl && (
            <img
              src={b.mobileImageUrl}
              alt={`Banner ${i + 1}`}
              className="w-full h-full object-cover block md:hidden"
            />
          )}
        </div>
      ))}
    </>
  )

  return (
    <div className="relative w-full h-[520px] md:h-[600px] xl:h-[800px] overflow-hidden">
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
