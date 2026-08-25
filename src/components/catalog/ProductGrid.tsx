'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  minQuantity: number
  isFeatured?: boolean
  isNew?: boolean
  category?: { name: string; slug: string }
  additionalCategories?: { name: string; slug: string }[]
  liked?: boolean
}

interface ProductGridProps {
  products: Product[]
  onToggleLike: (productId: string) => void
  // Categorias atualmente filtradas no catalogo: usado so para decidir qual
  // categoria mostrar no card quando o produto tem mais de uma (a que bate
  // com o filtro ativo, em vez de sempre a principal - senao um produto
  // filtrado por "Propagandista" aparecia rotulado como "Corporativa").
  activeCategorySlugs?: string[]
}

export function ProductGrid({ products, onToggleLike, activeCategorySlugs = [] }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Nenhum produto encontrado</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => {
        const allCategories = [product.category, ...(product.additionalCategories || [])].filter(
          (c): c is { name: string; slug: string } => Boolean(c)
        )
        const displayCategory =
          allCategories.find((c) => activeCategorySlugs.includes(c.slug)) || product.category
        return (
        <Link
          key={product.id}
          href={`/catalogo/${product.category?.slug || 'produtos'}/${product.slug}`}
          className="group bg-white rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
        >
          {/* Image */}
          <div className="relative h-56 md:h-72 xl:h-80 bg-gray-100 overflow-hidden flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-400 uppercase text-sm tracking-wider">
                  {displayCategory?.name}
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute inset-x-5 top-5 flex items-start justify-between pointer-events-none">
              <div className="flex flex-row gap-1.5">
                {product.isFeatured && (
                  <div className="bg-[#d2741f] text-white text-xs font-extrabold px-3 py-1.5 rounded-full tracking-widest uppercase">
                    Destaque
                  </div>
                )}
                {product.isNew && (
                  <div className="bg-[#1a7a4a] text-white text-xs font-extrabold px-3 py-1.5 rounded-full tracking-widest uppercase">
                    Lançamento
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onToggleLike(product.id)
                }}
                className={`w-[29px] h-[29px] rounded-full flex items-center justify-center transition-colors pointer-events-auto ${
                  product.liked ? 'bg-[#ff82aa]' : 'bg-[#ffe6ee]'
                }`}
              >
                <img
                  src="/images/Health.svg"
                  alt="heart"
                  className="w-[12.889px] h-[12.889px]"
                  style={{ filter: product.liked ? 'brightness(0) invert(1)' : 'brightness(0.4)' }}
                />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col gap-4">
            {/* Category & Title */}
            <div className="space-y-3">
              <p className="text-xs font-medium text-[#d2741f] tracking-widest uppercase">
                {displayCategory?.name}
              </p>
              <h3 className="text-xl font-semibold text-gray-900">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                  {product.description}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-300" />

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto">
              <p className="text-sm text-gray-500">Mín {product.minQuantity}un.</p>
              <span className="flex items-center gap-1 text-sm font-medium text-gray-900 group-hover:text-[#d2741f] transition-colors">
                Ver detalhes
                <ChevronRight size={18} />
              </span>
            </div>
          </div>
        </Link>
        )
      })}
    </div>
  )
}
