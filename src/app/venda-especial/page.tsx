'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, Trash2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { useProducts } from '@/hooks/useProducts'
import { useToast } from '@/contexts/ToastContext'
import { parseColorEntry } from '@/lib/colors'
import { whatsappUrl } from '@/lib/seo'
import { readStockCart, writeStockCart, StockCartItem } from '@/lib/stockCart'

function StockCard({
  product,
  inCart,
  onAdd,
}: {
  product: any
  inCart: number
  onAdd: (color: string, quantity: number) => void
}) {
  const colors: string[] = product.availableColors?.length ? product.availableColors : ['Preto']
  const [color, setColor] = useState(colors[0])
  const [quantity, setQuantity] = useState(1)
  const remaining = Math.max(0, product.stockQuantity - inCart)
  const productHref = `/catalogo/${product.category?.slug || 'produtos'}/${product.slug}`

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col border border-gray-200">
      <Link href={productHref} className="relative h-72 bg-gray-100 block">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        <span className="absolute left-4 top-4 bg-[#b3261e] text-white text-xs font-extrabold px-3 py-1.5 rounded-full tracking-widest uppercase">
          {product.stockQuantity} em estoque
        </span>
      </Link>

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#d2741f] tracking-widest uppercase">
            {product.category?.name}
          </p>
          <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">Consulte o valor</p>
        </div>

        {colors.length > 1 && (
          <div className="flex gap-2">
            {colors.map((raw) => {
              const { name, hex } = parseColorEntry(raw)
              return (
                <button
                  key={raw}
                  type="button"
                  title={name}
                  onClick={() => setColor(raw)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    color === raw ? 'border-[#d2741f] ring-2 ring-[#d2741f] ring-offset-2' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              )
            })}
          </div>
        )}

        <div className="flex items-center gap-3 mt-auto">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={remaining}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), Math.max(1, remaining)))
              }
              className="w-14 text-center font-semibold text-gray-900 outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(Math.max(1, remaining), q + 1))}
              className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100"
            >
              +
            </button>
          </div>
          <button
            type="button"
            disabled={remaining === 0}
            onClick={() => onAdd(color, Math.min(quantity, remaining))}
            className="flex-1 bg-[#8B5240] hover:bg-[#3d1707] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
          >
            {remaining === 0 ? 'Todo o estoque no carrinho' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VendaEspecialPage() {
  const { data: products = [], isLoading } = useProducts()
  const { addToast } = useToast()
  const [cart, setCart] = useState<StockCartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setCart(readStockCart())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) writeStockCart(cart)
  }, [cart, loaded])

  const stockProducts = useMemo(
    () => products.filter((p: any) => p.isActive && p.isStockSale && p.stockQuantity > 0),
    [products]
  )

  // Descarta do carrinho itens que sairam da venda especial ou passam do estoque atual.
  const validCart = useMemo(() => {
    if (isLoading) return cart
    return cart
      .map((item) => {
        const product = stockProducts.find((p: any) => p.id === item.productId)
        if (!product) return null
        const total = cart
          .filter((c) => c.productId === item.productId)
          .reduce((sum, c) => sum + c.quantity, 0)
        return total > product.stockQuantity
          ? { ...item, quantity: Math.max(1, item.quantity - (total - product.stockQuantity)) }
          : item
      })
      .filter(Boolean) as StockCartItem[]
  }, [cart, stockProducts, isLoading])

  const qtyInCart = (productId: string) =>
    validCart.filter((i) => i.productId === productId).reduce((sum, i) => sum + i.quantity, 0)

  const handleAdd = (product: any, color: string, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id && i.color === color)
      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [...prev, { productId: product.id, name: product.name, sku: product.sku, color, quantity }]
    })
    addToast('Adicionado ao carrinho', 'success')
  }

  const handleRemove = (item: StockCartItem) =>
    setCart((prev) => prev.filter((i) => !(i.productId === item.productId && i.color === item.color)))

  const totalUnits = validCart.reduce((sum, i) => sum + i.quantity, 0)

  const message = [
    'Olá! Tenho interesse na Venda Especial da VTCouro:',
    '',
    ...validCart.map((i) => `• ${i.quantity}x ${i.name}${i.sku ? ` (SKU ${i.sku})` : ''} - ${parseColorEntry(i.color).name}`),
    '',
    'Poderia me passar os valores e condições?',
  ].join('\n')

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-container px-6 py-10">
        <div className="bg-[#fff5ec] rounded-3xl p-8 mb-10">
          <p className="text-xs font-extrabold text-[#b3261e] tracking-widest uppercase mb-2">
            Estoque limitado
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#4b1c09]">Venda Especial</h1>
          <p className="text-gray-700 mt-3 max-w-2xl">
            Escolha as peças e as quantidades. O fechamento é feito direto pelo WhatsApp, com a
            nossa equipe.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Disponibilidade sujeita a confirmação.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
          <div>
            {isLoading ? (
              <ProductGridSkeleton />
            ) : stockProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600">Nenhum produto na venda especial no momento.</p>
                <Link href="/catalogo" className="text-[#d2741f] font-medium mt-3 inline-block">
                  Ver catálogo
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-2">
                {stockProducts.map((product: any) => (
                  <StockCard
                    key={product.id}
                    product={product}
                    inCart={qtyInCart(product.id)}
                    onAdd={(color, quantity) => handleAdd(product, color, quantity)}
                  />
                ))}
              </div>
            )}
          </div>

          <aside id="carrinho" className="bg-[#f8f8f8] border border-[#c8c8c8] rounded-2xl p-5 lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Seu carrinho{totalUnits > 0 && ` · ${totalUnits} un.`}
            </h2>
            {validCart.length === 0 ? (
              <p className="text-sm text-gray-600">Nenhum item adicionado ainda.</p>
            ) : (
              <>
                <ul className="divide-y divide-gray-200 mb-5">
                  {validCart.map((item) => (
                    <li key={`${item.productId}-${item.color}`} className="py-3 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {item.quantity} un. · {parseColorEntry(item.color).name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        aria-label={`Remover ${item.name}`}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
                <a
                  href={whatsappUrl(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={20} />
                  Finalizar pelo WhatsApp
                </a>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Disponibilidade sujeita a confirmação.
                </p>
              </>
            )}
          </aside>
        </div>
      </main>

      {totalUnits > 0 && (
        <a
          href="#carrinho"
          className="lg:hidden fixed bottom-6 left-4 right-24 z-40 bg-[#8B5240] text-white font-medium py-3.5 rounded-full shadow-lg text-center"
        >
          Ver carrinho · {totalUnits} un.
        </a>
      )}

      <Footer />
    </div>
  )
}
