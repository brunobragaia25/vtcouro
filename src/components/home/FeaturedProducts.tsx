'use client'

import { useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import { useProducts } from '@/hooks/useProducts'
import { useFavorites } from '@/hooks/useFavorites'

const chevronLeft = '/images/chevron-left.svg'
const chevronRight = '/images/chevron-right.svg'

function HealthIcon({ color }: { color: 'pink' | 'gray' }) {
  return (
    <div className="w-[29px] h-[29px] rounded-full flex items-center justify-center overflow-clip relative">
      <img
        src="/images/Health.svg"
        alt="heart"
        className="w-[12.889px] h-[12.889px]"
        style={{ filter: color === 'pink' ? 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(300deg) brightness(90%)' : 'brightness(0.4)' }}
      />
    </div>
  )
}

interface ProductCardProps {
  id: string
  category: string
  name: string
  description: string
  image: string
  slug: string
  categorySlug: string
  minQuantity: number
  isFavorited: boolean
  onToggleFavorite: () => void
}

function ProductCard({
  id,
  category,
  name,
  description,
  image,
  slug,
  categorySlug,
  minQuantity,
  isFavorited,
  onToggleFavorite
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-[28px] flex-shrink-0 flex flex-col pt-3 pb-5 px-3 gap-7 w-[280px] md:w-[340px] xl:w-[420px]">
      {/* Product Image */}
      <div className="relative rounded-[20px] bg-[#f0f0f0] overflow-hidden flex items-start justify-between p-5 group h-[220px] md:h-[270px] xl:h-[320px]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-400 uppercase text-xs tracking-wider">{category}</span>
          </div>
        )}

        {/* Badge and Heart */}
        <div className="relative z-10 flex items-start justify-between w-full">
          <div className="bg-[#d2741f] rounded-full px-3 py-2 text-white text-xs font-extrabold tracking-wider">
            DESTAQUE
          </div>
          <button
            onClick={onToggleFavorite}
            className={`rounded-full flex items-center justify-center transition hover:scale-110 ${
              isFavorited ? 'bg-[#ff82aa]' : 'bg-white border border-[#c8c8c8] hover:bg-[#ff82aa]'
            }`}
          >
            <HealthIcon color={isFavorited ? 'pink' : 'gray'} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-5 px-5">
        <div className="flex flex-col gap-3">
          <p className="text-[#d2741f] text-xs font-medium tracking-wider uppercase">
            {category}
          </p>
          <p className="text-[#1f1f1f] text-2xl font-semibold">
            {name}
          </p>
          <p className="text-[#1f1f1f] text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {description}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#d7d7d7]" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-[#808080] text-sm font-medium">Min {minQuantity}un.</p>
          <Link href={`/catalogo/${categorySlug}/${slug}`} className="flex items-center gap-1 text-[#1f1f1f] text-sm font-medium hover:gap-2 transition-all hover:text-[#d2741f]">
            Ver detalhes
            <img src={chevronRight} alt="details" className="w-5 h-5" style={{ filter: 'brightness(0.1)' }} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [mounted, setMounted] = useState(false)

  const { data: apiProducts = [], isLoading } = useProducts()
  const { isFavorited, toggleFavorite } = useFavorites()

  // Only run on client side
  useMemo(() => {
    setMounted(true)
  }, [])

  const featuredProducts = useMemo(() => {
    if (!mounted || !apiProducts.length) return []

    return apiProducts
      .filter((product: any) => product.isFeatured === true)
      .sort((a: any, b: any) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
      .slice(0, 8)
      .map((product: any) => ({
        id: product.id,
        category: product.category?.name || 'PRODUTO',
        name: product.name,
        description: product.description || '',
        image: product.imageUrl || '',
        slug: product.slug,
        categorySlug: product.category?.slug || 'produtos',
        minQuantity: product.minQuantity || 50,
        isFavorited: isFavorited(product.id)
      }))
  }, [apiProducts, isFavorited, mounted])

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 440
      if (direction === 'left' && canScrollLeft) {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else if (direction === 'right' && canScrollRight) {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
      setTimeout(checkScroll, 100)
    }
  }

  if (!mounted || isLoading || !featuredProducts || featuredProducts.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-[#fff5ec] flex flex-col pt-[64px] md:pt-[96px] xl:pt-[128px] pb-[64px]">
      {/* Header */}
      <div className="flex justify-center">
        <div className="max-w-container w-full px-5">
          <div className="flex flex-col gap-5 mb-10 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-2.5">
              <p className="text-[#d2741f] text-sm font-black italic tracking-wider uppercase">
                EM DESTAQUE
              </p>
              <h2 className="text-[#4b1c09] font-semibold text-4xl md:text-5xl xl:text-6xl">
                Mais pedidos
              </h2>
            </div>
            <Link href="/catalogo" className="border border-[#1f1f1f] rounded-lg px-4 py-3 md:px-7 md:py-4 flex items-center gap-1 w-fit hover:bg-[#1f1f1f] hover:text-white transition text-sm md:text-base">
              Catálogo completo
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid - Full Width */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onScroll={checkScroll}
        className={`flex gap-4 md:gap-5 overflow-x-auto pb-4 w-full scroll-smooth scrollbar-hide pl-5 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {featuredProducts.map((product: any) => (
          <ProductCard
            key={product.id}
            {...product}
            onToggleFavorite={() => toggleFavorite(product.id)}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-center">
        <div className="max-w-container w-full px-5">
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`rounded-lg w-14 h-14 flex items-center justify-center transition ${
                canScrollLeft
                  ? 'bg-[#8B5240] hover:bg-[#2c0f04] cursor-pointer'
                  : 'bg-[#d0d0d0] cursor-not-allowed'
              }`}
            >
              <img src={chevronLeft} alt="scroll left" className="w-6 h-6 brightness-0 invert" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`rounded-lg w-14 h-14 flex items-center justify-center transition ${
                canScrollRight
                  ? 'bg-[#8B5240] hover:bg-[#2c0f04] cursor-pointer'
                  : 'bg-[#d0d0d0] cursor-not-allowed'
              }`}
            >
              <img src={chevronRight} alt="scroll right" className="w-6 h-6 brightness-0 invert" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

