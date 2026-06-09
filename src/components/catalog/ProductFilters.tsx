'use client'

import { useState } from 'react'
import { Search, MessageCircle, ChevronDown } from 'lucide-react'

interface Category {
  id: string
  name: string
  count: number
}

interface Product {
  id: string
  name: string
  imageUrl?: string
}

interface ProductFiltersProps {
  categories: Category[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  products: Product[]
  selectedProducts: string[]
  onProductChange: (products: string[]) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCollections: string[]
  onCollectionChange: (collections: string[]) => void
  collectionCounts: { featured: number; new: number }
}

export function ProductFilters({
  categories,
  selectedCategories,
  onCategoryChange,
  products,
  selectedProducts,
  onProductChange,
  searchTerm,
  onSearchChange,
  selectedCollections,
  onCollectionChange,
  collectionCounts,
}: ProductFiltersProps) {
  const [showCategories, setShowCategories] = useState(true)
  const [isClosingCategories, setIsClosingCategories] = useState(false)
  const [showProducts, setShowProducts] = useState(true)
  const [isClosingProducts, setIsClosingProducts] = useState(false)

  const toggleCategoriesSection = () => {
    if (showCategories) {
      setIsClosingCategories(true)
      setTimeout(() => {
        setShowCategories(false)
        setIsClosingCategories(false)
      }, 500)
    } else {
      setShowCategories(true)
    }
  }

  const toggleProductsSection = () => {
    if (showProducts) {
      setIsClosingProducts(true)
      setTimeout(() => {
        setShowProducts(false)
        setIsClosingProducts(false)
      }, 500)
    } else {
      setShowProducts(true)
    }
  }

  const toggleCategory = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]
    onCategoryChange(updated)
  }

  const toggleProduct = (productId: string) => {
    const updated = selectedProducts.includes(productId)
      ? selectedProducts.filter(id => id !== productId)
      : [...selectedProducts, productId]
    onProductChange(updated)
  }

  const toggleCollection = (key: string) => {
    const updated = selectedCollections.includes(key)
      ? selectedCollections.filter(k => k !== key)
      : [...selectedCollections, key]
    onCollectionChange(updated)
  }

  const collections = [
    { id: 'featured', label: 'Em Destaque', count: collectionCounts.featured },
    { id: 'new', label: 'Lançamentos', count: collectionCounts.new },
  ]

  return (
    <div className="flex flex-col gap-5 w-full">
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            margin-bottom: 0;
            overflow: hidden;
          }
          to {
            opacity: 1;
            max-height: 600px;
            margin-bottom: 0.5rem;
            overflow: hidden;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 1;
            max-height: 600px;
            margin-bottom: 0.5rem;
            overflow: hidden;
          }
          to {
            opacity: 0;
            max-height: 0;
            margin-bottom: 0;
            overflow: hidden;
          }
        }

        .filter-content-open {
          animation: slideDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .filter-content-close {
          animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.6, 0.2) forwards;
        }
      `}</style>
      <div className="flex flex-col gap-5 w-full">
      {/* Search Box */}
      <div className="bg-white rounded-[16px] p-7 flex flex-col gap-5">
        <p className="text-[#1f1f1f] text-xs font-extrabold tracking-wider uppercase">
          Buscar
        </p>
        <div className="border border-[#c8c8c8] rounded-[6px] px-5 py-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#8b8b8b]" />
          <input
            type="text"
            placeholder="Nome do produto"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 outline-none text-[#8b8b8b] text-sm font-normal placeholder-[#8b8b8b]"
          />
        </div>
      </div>

      {/* Collections */}
      <div className="bg-white rounded-[16px] p-7 flex flex-col gap-5">
        <p className="text-[#1f1f1f] text-xs font-extrabold tracking-wider uppercase">
          Coleções
        </p>
        <div className="space-y-2">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => toggleCollection(col.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-[12px] transition-all ${
                selectedCollections.includes(col.id)
                  ? 'bg-[#fff5ec] border border-[#d2741f]'
                  : 'bg-[#f9f9f9] border border-transparent hover:bg-[#f0f0f0]'
              }`}
            >
              <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                selectedCollections.includes(col.id)
                  ? 'bg-[#d2741f] border-[#d2741f]'
                  : 'border-[#c8c8c8]'
              }`}>
                {selectedCollections.includes(col.id) && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </div>
              <span className={`text-sm font-normal flex-1 text-left ${
                selectedCollections.includes(col.id) ? 'text-[#4b1c09]' : 'text-[#8b8b8b]'
              }`}>
                {col.label}
              </span>
              <span className={`text-sm font-normal ${
                selectedCollections.includes(col.id) ? 'text-[#d2741f]' : 'text-[#8b8b8b]'
              }`}>
                {col.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-[16px] p-7 flex flex-col gap-5">
        <button
          onClick={toggleCategoriesSection}
          className="w-full flex items-center justify-between"
        >
          <p className="text-[#1f1f1f] text-xs font-extrabold tracking-wider uppercase">
            Categorias
          </p>
          <ChevronDown
            className={`w-4 h-4 text-[#8b8b8b] transition-transform duration-500 ${showCategories ? 'rotate-0' : '-rotate-90'}`}
          />
        </button>

        <div className={isClosingCategories ? 'filter-content-close' : showCategories ? 'filter-content-open' : ''}>
          {(showCategories || isClosingCategories) && (
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-[12px] transition-all ${
                    selectedCategories.includes(category.id)
                      ? 'bg-[#fff5ec] border border-[#d2741f]'
                      : 'bg-[#f9f9f9] border border-transparent hover:bg-[#f0f0f0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      selectedCategories.includes(category.id)
                        ? 'bg-[#d2741f] border-[#d2741f]'
                        : 'border-[#c8c8c8]'
                    }`}>
                      {selectedCategories.includes(category.id) && (
                        <span className="text-white text-xs font-bold">✓</span>
                      )}
                    </div>
                    <span className={`text-sm font-normal ${
                      selectedCategories.includes(category.id)
                        ? 'text-[#4b1c09]'
                        : 'text-[#8b8b8b]'
                    }`}>
                      {category.name}
                    </span>
                  </div>
                  <span className={`text-sm font-normal ${
                    selectedCategories.includes(category.id)
                      ? 'text-[#d2741f]'
                      : 'text-[#8b8b8b]'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="bg-white rounded-[16px] p-7 flex flex-col gap-5">
        <button
          onClick={toggleProductsSection}
          className="w-full flex items-center justify-between"
        >
          <p className="text-[#1f1f1f] text-xs font-extrabold tracking-wider uppercase">
            Produtos
          </p>
          <ChevronDown
            className={`w-4 h-4 text-[#8b8b8b] transition-transform duration-500 ${showProducts ? 'rotate-0' : '-rotate-90'}`}
          />
        </button>

        <div className={isClosingProducts ? 'filter-content-close' : showProducts ? 'filter-content-open' : ''}>
          {(showProducts || isClosingProducts) && (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {products.length > 0 ? (
                products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-[12px] transition-all ${
                      selectedProducts.includes(product.id)
                        ? 'bg-[#fff5ec] border border-[#d2741f]'
                        : 'bg-[#f9f9f9] border border-transparent hover:bg-[#f0f0f0]'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      selectedProducts.includes(product.id)
                        ? 'bg-[#d2741f] border-[#d2741f]'
                        : 'border-[#c8c8c8]'
                    }`}>
                      {selectedProducts.includes(product.id) && (
                        <span className="text-white text-xs font-bold">✓</span>
                      )}
                    </div>
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-8 h-8 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <span className={`text-sm font-normal truncate flex-1 text-left ${
                      selectedProducts.includes(product.id)
                        ? 'text-[#4b1c09]'
                        : 'text-[#8b8b8b]'
                    }`}>
                      {product.name}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-[#8b8b8b] text-sm font-normal">Nenhum produto</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Help Card */}
      <div className="bg-[#8B5240] rounded-[16px] p-7 flex flex-col gap-7">
        <div className="flex items-center gap-3">
          <div className="bg-[#d4a574] rounded-[8px] w-[52px] h-[52px] flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="text-white space-y-2">
          <h3 className="text-xl font-semibold">
            Precisa de ajuda?
          </h3>
          <p className="text-sm font-normal leading-relaxed">
            Fale com nossa equipe e tire suas dúvidas sobre couros, prazos e personalização.
          </p>
        </div>
        <button className="bg-[#d4a574] hover:bg-[#c29660] transition text-white font-medium px-7 py-4 rounded-[12px] w-full">
          Falar agora
        </button>
      </div>
      </div>
    </div>
  )
}

