'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductFilters } from '@/components/catalog/ProductFilters'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { ChevronRight } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useFavorites } from '@/hooks/useFavorites'
import { useToast } from '@/contexts/ToastContext'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import Link from 'next/link'

const iconHealth = '/images/Health.svg'

function CatalogPageContent() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')
  const favoritesFromUrl = searchParams.get('favorites') === 'true'
  const { addToast } = useToast()

  const { data: apiProducts = [], isLoading } = useProducts()
  const { favorites, toggleFavorite, isFavorited } = useFavorites(apiProducts.map((p: any) => p.id))

  const handleToggleFavorite = (productId: string) => {
    const isFav = isFavorited(productId)
    toggleFavorite(productId)
    addToast(
      isFav ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
      isFav ? 'info' : 'success'
    )
  }

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryFromUrl ? [categoryFromUrl] : []
  )
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFavorites, setShowFavorites] = useState(false)

  const productsPerPage = 12

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Map<string, { id: string; name: string; slug: string; count: number }>()

    apiProducts.forEach((product: any) => {
      if (product.category?.slug) {
        const key = product.category.slug
        if (!cats.has(key)) {
          cats.set(key, {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
            count: 0,
          })
        }
        const cat = cats.get(key)
        if (cat) cat.count++
      }
    })

    return Array.from(cats.values())
  }, [apiProducts])

  const categoryLabels = useMemo(() => {
    const labels: { [key: string]: string } = {}
    categories.forEach(cat => {
      labels[cat.slug] = cat.name
    })
    return labels
  }, [categories])

  const products = useMemo(() => {
    const seen = new Set<string>()
    const uniqueProducts: Array<{ id: string; name: string; imageUrl?: string }> = []
    apiProducts.forEach((product: any) => {
      if (!seen.has(product.id)) {
        seen.add(product.id)
        uniqueProducts.push({
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
        })
      }
    })
    return uniqueProducts.sort((a, b) => a.name.localeCompare(b.name))
  }, [apiProducts])

  const filteredProducts = useMemo(() => {
    return apiProducts.filter((product: any) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategories.length === 0 ||
                             selectedCategories.includes(product.category?.slug || '')
      const matchesProduct = selectedProducts.length === 0 ||
                            selectedProducts.includes(product.id)
      const matchesCollection = selectedCollections.length === 0 || (
        (selectedCollections.includes('featured') && product.isFeatured) ||
        (selectedCollections.includes('new') && product.isNew)
      )
      const matchesFavorites = !favoritesFromUrl || isFavorited(product.id)
      return matchesSearch && matchesCategory && matchesProduct && matchesCollection && matchesFavorites
    })
  }, [apiProducts, searchTerm, selectedCategories, selectedProducts, selectedCollections, favoritesFromUrl, isFavorited])

  const productsWithLikes = filteredProducts.map((product: any) => ({
    ...product,
    liked: isFavorited(product.id),
  }))

  const favoriteProducts = apiProducts.filter((p: any) => isFavorited(p.id))

  const CATEGORY_FILTERS = categories.map(cat => ({
    id: cat.slug,
    name: cat.name,
    count: cat.count,
  }))

  const collectionCounts = useMemo(() => ({
    featured: apiProducts.filter((p: any) => p.isFeatured).length,
    new: apiProducts.filter((p: any) => p.isNew).length,
  }), [apiProducts])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const paginatedProducts = productsWithLikes.slice(startIndex, endIndex)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxPages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2))
    let endPage = Math.min(totalPages, startPage + maxPages - 1)

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <>
      <Header />
      <main className="overflow-x-hidden pb-5">
        {/* Breadcrumb and Hero Section */}
        <div className="px-5 mt-0">
          <section className="bg-gradient-to-b from-[#fff5ec] to-[#ffd8b5] rounded-[28px] md:rounded-[40px] w-full py-10 md:py-16 xl:py-20">
            <div className="max-w-container mx-auto px-6 md:px-12">
              {/* Breadcrumb */}
              <p className="text-[#1f1f1f] text-sm font-medium mb-5 md:mb-7">
                Início / Catálogo
              </p>

              {/* Title and Description */}
              <div className="space-y-5 md:space-y-7">
                <div className="space-y-3">
                  <h1 className="text-[#4b1c09] font-semibold font-serif text-4xl md:text-5xl xl:text-6xl">
                    Nossos produtos
                  </h1>
                  <p className="text-[#1f1f1f] text-sm font-medium">
                    {apiProducts.length} produtos disponíveis para personalização.
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full md:w-[485px] h-px bg-[#ecc29c]" />

                <p className="text-[#1f1f1f] text-sm font-medium">
                  Pedidos a partir de 15un.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Catalog Content */}
        <section className="bg-[#fff5ec] rounded-[28px] md:rounded-[40px] max-w-container mx-auto px-4 md:px-8 py-8 md:py-16 mb-0 flex flex-col md:flex-row gap-5 mt-5 md:mt-8 overflow-visible">
          {/* Filters Sidebar */}
          <div className="w-full md:w-[326px] md:flex-shrink-0 flex flex-col gap-5">
            {/* Favorites Section */}
            <div className="bg-white rounded-[16px] p-7">
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className="w-full flex items-center justify-between"
              >
                <p className="text-[#1f1f1f] text-xs font-extrabold tracking-wider uppercase">
                  Favoritos
                </p>
                <span className="text-[#8b8b8b] text-sm font-normal">{favorites.length}</span>
              </button>

              {/* Favorites List */}
              {showFavorites && favorites.length > 0 && (
                <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
                  {favoriteProducts.map((product: any) => (
                    <Link
                      key={product.id}
                      href={`/catalogo/${product.category?.slug || 'produtos'}/${product.slug}`}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <span className="text-gray-900 truncate flex-1">{product.name}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleToggleFavorite(product.id)
                        }}
                        className="hover:opacity-80 transition"
                      >
                        <img
                          src={iconHealth}
                          alt="Remover"
                          className="w-4 h-4"
                          style={{
                            filter: 'brightness(0) saturate(100%) invert(31%) sepia(71%) saturate(1486%) hue-rotate(330deg) brightness(100%) contrast(101%)'
                          }}
                        />
                      </button>
                    </Link>
                  ))}
                </div>
              )}

              {showFavorites && favorites.length === 0 && (
                <p className="mt-4 text-sm text-gray-600">Nenhum favorito ainda</p>
              )}
            </div>

            {/* Filters */}
            <ProductFilters
              categories={CATEGORY_FILTERS}
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              products={products}
              selectedProducts={selectedProducts}
              onProductChange={setSelectedProducts}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCollections={selectedCollections}
              onCollectionChange={setSelectedCollections}
              collectionCounts={collectionCounts}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1 flex flex-col gap-5">

            {/* Products Grid */}
            {isLoading ? (
              <ProductGridSkeleton />
            ) : paginatedProducts.length > 0 ? (
              <ProductGrid
                products={paginatedProducts}
                onToggleLike={(productId) => handleToggleFavorite(productId.toString())}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Nenhum produto encontrado com os filtros selecionados</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex gap-3 items-center justify-center mt-8">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="bg-white rounded-[6px] w-[50px] h-[50px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-[6px] w-[50px] h-[50px] flex items-center justify-center font-normal text-base transition-colors ${
                      currentPage === page
                        ? 'bg-[#4b1c09] text-white'
                        : 'bg-white text-[#8b8b8b] hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="bg-white rounded-[6px] w-[50px] h-[50px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogPageContent />
    </Suspense>
  )
}
