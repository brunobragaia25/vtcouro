'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  imageUrl?: string | null
}

const VISIBLE = 3

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  const total = categories.length
  const isSlider = total > VISIBLE

  const prev = () => setOffset((o) => Math.max(0, o - 1))
  const next = () => setOffset((o) => Math.min(total - VISIBLE, o + 1))

  const visible = isSlider ? categories.slice(offset, offset + VISIBLE) : categories

  return (
    <section className="w-full relative overflow-hidden">
      <div className="flex h-[300px] md:h-[480px] xl:h-[560px]">
        {visible.map((cat, i) => (
          <div
            key={cat.id}
            className="relative flex-1 bg-[#d9d9d9] flex flex-col justify-between p-6 md:p-10 overflow-hidden"
          >
            {/* Separador vertical */}
            {i > 0 && <div className="absolute left-0 top-0 h-full w-px bg-white/40 z-10" />}

            {/* Imagem ou placeholder */}
            {cat.imageUrl ? (
              <img src={cat.imageUrl} alt={cat.name} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#999] text-xs md:text-sm font-medium tracking-wide">Imagem da categoria aqui</span>
              </div>
            )}

            {/* Overlay escuro quando tem imagem */}
            {cat.imageUrl && <div className="absolute inset-0 bg-black/30" />}

            {/* Veja mais */}
            <div className="relative z-10">
              <Link
                href={`/catalogo?category=${cat.slug}`}
                className={`border rounded-full px-4 py-2 text-xs md:text-sm font-normal transition w-fit block ${
                  cat.imageUrl
                    ? 'border-white text-white hover:bg-white hover:text-[#4b1c09]'
                    : 'border-[#8B5240] text-[#8B5240] hover:bg-[#8B5240] hover:text-white'
                }`}
              >
                Veja mais
              </Link>
            </div>

            {/* Título */}
            <h2 className={`relative z-10 font-serif font-normal italic leading-tight text-[24px] md:text-[36px] xl:text-[48px] ${cat.imageUrl ? 'text-white' : 'text-[#4b1c09]'}`}>
              {cat.name}
            </h2>
          </div>
        ))}
      </div>

      {/* Setas — só aparecem se tiver mais de 3 categorias */}
      {isSlider && (
        <>
          <button
            onClick={prev}
            disabled={offset === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center disabled:opacity-30 transition"
          >
            <ChevronLeft size={18} className="text-[#4b1c09]" />
          </button>
          <button
            onClick={next}
            disabled={offset >= total - VISIBLE}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center disabled:opacity-30 transition"
          >
            <ChevronRight size={18} className="text-[#4b1c09]" />
          </button>
        </>
      )}
    </section>
  )
}
