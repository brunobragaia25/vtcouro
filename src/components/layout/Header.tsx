'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { X, Search, Menu } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useFavorites } from '@/hooks/useFavorites'
import { useCategories } from '@/hooks/useCategories'

const logoGroup = '/images/logotipo-nav-bar-vt-couro.svg'
const iconBag = '/images/Bag 5.svg'
const iconHealth = '/images/Health.svg'
const iconMagnifier = '/images/Magnifer.svg'

export function Header() {
  const pathname = usePathname()
  const isOrcamentoPage = pathname === '/orcamento'
  const [cartCount, setCartCount] = useState(0)
  const [showSearch, setShowSearch] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: products = [] } = useProducts()
  const { data: categories = [] } = useCategories()
  const { count: favCount } = useFavorites(products.map((p: any) => p.id))

  const handleToggleSearch = (shouldOpen: boolean) => {
    if (shouldOpen) {
      setIsClosing(false)
      setShowSearch(true)
    } else {
      setIsClosing(true)
      setTimeout(() => {
        setShowSearch(false)
        setIsClosing(false)
      }, 300)
      setSearchTerm('')
    }
  }

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return []
    return products.filter((p: any) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, products])

  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('orcamento_cart')
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart)
          setCartCount(cart.length)
        } catch (e) {
          setCartCount(0)
        }
      } else {
        setCartCount(0)
      }
    }

    updateCartCount()

    window.addEventListener('cartUpdated', updateCartCount)
    window.addEventListener('storage', updateCartCount)

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount)
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  return (
    <header className="z-50">
      {/* Top Bar */}
      <div className="hidden md:flex w-screen h-[42px] bg-[#8B5240] items-center">
        <div className="max-w-container mx-auto w-full px-5 md:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-7">
            <a href="tel:(11)2636-1112" className="font-medium text-white text-[12px]">
              (11) 2636-1112
            </a>
            <div className="w-px h-3 bg-white hidden md:block"></div>
            <a href="tel:(11)94138-2445" className="font-medium text-white text-[12px]">
              (11) 94138-2445
            </a>
            <div className="w-px h-3 bg-white hidden md:block"></div>
            <a href="mailto:vtcouro@vtcouro.com.br" className="font-medium text-white text-[12px] hidden md:block">
              vtcouro@vtcouro.com.br
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="w-screen bg-white flex items-center">
        <div className="max-w-container mx-auto w-full px-5 md:px-8 py-4 md:py-5">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1">
              <img
                src={logoGroup}
                alt="VTCouro"
                className="h-10 md:h-12 object-contain"
              />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8 text-sm text-gray-800 font-medium">
              <Link href="/" className="hover:text-orange-700 transition">Início</Link>
              <Link href="/catalogo" className="hover:text-orange-700 transition">Catálogo</Link>
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/catalogo?category=${category.slug}`}
                  className="hover:text-orange-700 transition"
                >
                  {category.name}
                </Link>
              ))}
              <Link href="/sobre" className="hover:text-orange-700 transition">Sobre nós</Link>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Link href="/orcamento" className="relative">
                <button className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isOrcamentoPage
                    ? 'bg-[#ecc29c] hover:bg-[#d2741f]'
                    : 'border border-gray-300 bg-white hover:border-[#d2741f] hover:bg-orange-50'
                }`}>
                  <img src={iconBag} alt="Orçamento" className="w-5 h-5" />
                </button>
                {cartCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </div>
                )}
              </Link>

              {/* Search — desktop only */}
              <div className="relative hidden lg:block">
                <style>{`
                  @keyframes expandSearch {
                    from { width: 36px; }
                    to { width: 200px; }
                  }
                  @keyframes collapseSearch {
                    from { width: 200px; }
                    to { width: 36px; }
                  }
                  .search-input-active {
                    animation: expandSearch 0.3s ease-out forwards !important;
                  }
                  .search-input-closing {
                    animation: collapseSearch 0.3s ease-in forwards !important;
                  }
                `}</style>

                <div className={`flex items-center justify-center border border-gray-300 rounded-full h-9 ${
                  isClosing
                    ? 'search-input-closing'
                    : showSearch
                      ? 'search-input-active bg-gray-50 px-3'
                      : 'bg-white w-9 hover:bg-gray-50'
                }`}>
                  <button
                    onClick={() => handleToggleSearch(!showSearch)}
                    className="flex items-center justify-center flex-shrink-0"
                  >
                    <img src={iconMagnifier} alt="Buscar" className="w-5 h-5" />
                  </button>

                  {showSearch && (
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onBlur={() => {
                        if (!searchTerm.trim()) handleToggleSearch(false)
                      }}
                      autoFocus
                      className="bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500 ml-2 flex-1"
                    />
                  )}
                </div>

                {showSearch && searchTerm.trim() && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 w-80 max-h-96 overflow-y-auto z-50">
                    {searchResults.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {searchResults.map((product: any) => (
                          <Link
                            key={product.id}
                            href={`/catalogo/${product.category?.slug || 'produtos'}/${product.slug}`}
                            onClick={() => handleToggleSearch(false)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
                          >
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[#d2741f] tracking-wider uppercase">
                                {product.category?.name}
                              </p>
                              <h4 className="font-semibold text-gray-900 text-sm truncate">
                                {product.name}
                              </h4>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Nenhum produto encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Favorites */}
              {favCount > 0 ? (
                <Link href="/catalogo?favorites=true" className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all bg-[#ff82aa]">
                  <img src={iconHealth} alt="Favoritos" className="w-5 h-5" style={{ filter: 'brightness(0) invert(1)' }} />
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {favCount}
                  </div>
                </Link>
              ) : (
                <button className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all border border-gray-300 hover:bg-gray-50">
                  <img src={iconHealth} alt="Favoritos" className="w-5 h-5" />
                </button>
              )}

              {/* Hamburger — mobile/tablet */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu — fullscreen overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col">
          {/* Header row inside overlay */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <img src={logoGroup} alt="VTCouro" className="h-10 object-contain" />
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 px-5 pt-6 pb-8 justify-between">
            {/* Search */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center border border-gray-300 rounded-full h-11 px-4 gap-2">
                <img src={iconMagnifier} alt="Buscar" className="w-4 h-4 opacity-50 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500 flex-1"
                />
              </div>

              {searchTerm.trim() && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 max-h-48 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {searchResults.map((product: any) => (
                        <Link
                          key={product.id}
                          href={`/catalogo/${product.category?.slug || 'produtos'}/${product.slug}`}
                          onClick={() => { setMenuOpen(false); setSearchTerm('') }}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
                        >
                          {product.imageUrl && (
                            <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#d2741f] tracking-wider uppercase">{product.category?.name}</p>
                            <h4 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h4>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">Nenhum produto encontrado</div>
                  )}
                </div>
              )}

              {/* Nav links */}
              <nav className="flex flex-col mt-2">
                {[
                  { href: '/', label: 'Início' },
                  { href: '/catalogo', label: 'Catálogo' },
                  ...categories.map((category: any) => ({
                    href: `/catalogo?category=${category.slug}`,
                    label: category.name,
                  })),
                  { href: '/sobre', label: 'Sobre nós' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-800 font-medium text-lg py-4 border-b border-gray-100 hover:text-[#d2741f] transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Bottom contact info */}
            <div className="flex flex-col gap-1 pt-6">
              <a href="tel:(11)2636-1112" className="text-sm text-gray-500">(11) 2636-1112</a>
              <a href="tel:(11)94138-2445" className="text-sm text-gray-500">(11) 94138-2445</a>
              <a href="mailto:vtcouro@vtcouro.com.br" className="text-sm text-gray-500">vtcouro@vtcouro.com.br</a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
