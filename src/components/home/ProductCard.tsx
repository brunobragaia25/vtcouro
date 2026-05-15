'use client'

interface ProductCardProps {
  category: string
  name: string
  description: string
  image: string
  minQuantity: number
  featured?: boolean
  hasWishlist?: boolean
}

export function ProductCard({
  category,
  name,
  description,
  image,
  minQuantity,
  featured = false,
  hasWishlist = false,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-[28px] overflow-hidden flex flex-col w-full max-w-sm hover:shadow-lg transition">
      {/* Image Container */}
      <div className="relative h-80 bg-gray-100 overflow-hidden rounded-[20px] m-3">
        <img src={image} alt={name} className="w-full h-full object-cover" />

        {/* Featured Badge */}
        <div className="absolute top-5 left-5 bg-[#d2741f] text-white px-3 py-2 rounded-full text-xs font-extrabold tracking-wider uppercase">
          Destaque
        </div>

        {/* Heart Icon */}
        {hasWishlist && (
          <button className="absolute top-5 right-5 w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-pink-100 transition">
            ♡
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pb-5 flex-1 flex flex-col gap-5">
        <div className="space-y-3">
          {/* Category */}
          <p className="text-[#d2741f] text-xs font-medium tracking-widest uppercase">
            {category}
          </p>

          {/* Title */}
          <h3 className="text-gray-800 text-2xl font-semibold">{name}</h3>

          {/* Description */}
          <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm font-medium">
            Min {minQuantity}un.
          </p>
          <button className="flex items-center gap-1 text-gray-800 text-sm font-medium hover:text-[#d2741f] transition">
            Ver detalhes
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
