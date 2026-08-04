'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ChevronRight, X, Check, MessageCircle, Mail } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useCreateQuote } from '@/hooks/useQuotes'
import { useToast } from '@/contexts/ToastContext'
import { useUploadArt } from '@/hooks/useUploadArt'
import { parseColorEntry } from '@/lib/colors'
import { whatsappUrl } from '@/lib/seo'
import Link from 'next/link'

interface CartItem {
  productId: string
  color?: string
  name: string
  sku: string
  quantity: number
  imageUrl?: string
  minQuantity: number
  description?: string
  category?: string
  artFile?: File
  artFileName?: string
  artFileUrl?: string
}

const cartItemKey = (productId: string, color?: string) => `${productId}::${color ?? ''}`

interface CustomerData {
  name: string
  email: string
  phone: string
  company: string
  notes: string
}

function OrcamentoPageContent() {
  const searchParams = useSearchParams()
  const { addToast } = useToast()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quoteId, setQuoteId] = useState<string>('')
  const [showProductModal, setShowProductModal] = useState(false)

  const { data: products = [] } = useProducts()
  const createQuote = useCreateQuote()
  const { uploadFile, isUploading } = useUploadArt()

  // Products not yet in cart
  const availableProducts = useMemo(
    () =>
      products.filter(
        (p: any) => !cart.find(item => item.productId === p.id)
      ),
    [products, cart]
  )

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('orcamento_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Error loading cart:', e)
      }
    }
    setMounted(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('orcamento_cart', JSON.stringify(cart))
      // Dispatch custom event to notify header
      window.dispatchEvent(new Event('cartUpdated'))
    }
  }, [cart, mounted])

  // Load product from URL params and ADD to existing cart
  useEffect(() => {
    if (!mounted || products.length === 0) return

    const productId = searchParams.get('product')
    const quantity = searchParams.get('quantity')
    const color = searchParams.get('color') || undefined

    if (productId) {
      const product = products.find((p: any) => p.id === productId)
      setCart(prev => {
        if (product && !prev.find(item => item.productId === productId && item.color === color)) {
          return [
            ...prev,
            {
              productId: product.id,
              color,
              name: product.name,
              sku: product.sku,
              quantity: quantity ? parseInt(quantity) : product.minQuantity || 50,
              imageUrl: product.imageUrl,
              minQuantity: product.minQuantity || 50,
              description: product.description,
              category: product.category?.name,
            },
          ]
        }
        return prev
      })
    }
  }, [searchParams, products, mounted])

  const totalQuantity = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  )

  const totalArtFiles = useMemo(
    () => cart.filter(item => item.artFile).length,
    [cart]
  )

  const handleAddProduct = (product: any) => {
    const existingItem = cart.find(item => item.productId === product.id)

    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? {
              ...item,
              quantity: Math.max(
                product.minQuantity || 50,
                item.quantity + (product.minQuantity || 50)
              ),
            }
          : item
      ))
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          quantity: product.minQuantity || 50,
          imageUrl: product.imageUrl,
          minQuantity: product.minQuantity || 50,
        },
      ])
    }
  }

  const handleQuantityChange = (productId: string, color: string | undefined, newQuantity: number) => {
    const item = cart.find(i => i.productId === productId && i.color === color)
    if (!item) return

    if (newQuantity < item.minQuantity) return
    if (newQuantity % 5 !== 0) return

    setCart(cart.map(item =>
      item.productId === productId && item.color === color
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const handleArtFileUpload = async (
    productId: string,
    color: string | undefined,
    file: File | undefined
  ) => {
    if (!file) {
      setCart(cart.map(item =>
        item.productId === productId && item.color === color
          ? {
              ...item,
              artFile: undefined,
              artFileName: undefined,
            }
          : item
      ))
      return
    }

    try {
      const result = await uploadFile(file)
      setCart(cart.map(item =>
        item.productId === productId && item.color === color
          ? {
              ...item,
              artFile: file,
              artFileName: file.name,
              artFileUrl: result.url,
            }
          : item
      ))
      addToast('Arquivo de arte enviado com sucesso!', 'success')
    } catch (error) {
      addToast('Erro ao enviar arquivo de arte', 'error')
    }
  }

  const handleRemoveProduct = (productId: string, color: string | undefined) => {
    setCart(cart.filter(item => !(item.productId === productId && item.color === color)))
  }

  const handleSubmitQuote = async () => {
    if (!customerData.name || !customerData.email || !customerData.phone) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (cart.length === 0) {
      alert('Adicione pelo menos um produto')
      return
    }

    setIsSubmitting(true)

    try {
      const quoteData = {
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        companyName: customerData.company,
        notes: customerData.notes,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          color: item.color || null,
          artFile: item.artFileUrl || null,
        })),
      }

      const result = await createQuote.mutateAsync(quoteData)
      setQuoteId(result.protocolNumber)
      setStep(3)
      addToast('Orçamento criado com sucesso!', 'success')

      // Limpa o carrinho: sem isso o pedido concluido continuava aparecendo
      // se o cliente voltasse ao catalogo ou reabrisse /orcamento.
      setCart([])
      localStorage.removeItem('orcamento_cart')
    } catch (error) {
      console.error('Erro ao criar orçamento:', error)
      addToast('Erro ao enviar orçamento. Tente novamente.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main className="overflow-x-hidden pb-5">
        {/* Header Section with Breadcrumb & Title */}
        <div className="mx-auto max-w-[1440px] px-5 mt-0">
          <section className="bg-gradient-to-b from-[#fff5ec] to-[#ffd8b5] rounded-[28px] md:rounded-[40px] w-full py-10 md:py-20">
            <div className="mx-auto px-6 md:px-16">
              <p className="text-[#1f1f1f] text-sm font-medium mb-6 md:mb-8">
                Início / Catálogo / Orçamento
              </p>
              <h1 className="text-[#4b1c09] font-semibold font-serif mb-8 md:mb-12 text-4xl md:text-6xl">
                Seu carrinho de orçamento
              </h1>

              {/* Step Indicator - Figma Style */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Step 1 */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-colors ${
                    step >= 1
                      ? 'bg-[#8B5240] text-white'
                      : 'bg-white text-[#1f1f1f]'
                  }`}>
                    1
                  </div>
                  <span className="text-[#1f1f1f] text-sm font-medium">
                    Produtos e artes
                  </span>
                </div>

                {/* Divider */}
                <div className={`w-12 h-px shrink-0 transition-colors ${
                  step >= 2 ? 'bg-[#1f1f1f]' : 'bg-[#c8c8c8]'
                }`}></div>

                {/* Step 2 */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-colors ${
                    step >= 2
                      ? 'bg-[#8B5240] text-white'
                      : 'bg-white text-[#1f1f1f]'
                  }`}>
                    2
                  </div>
                  <span className="text-[#1f1f1f] text-sm font-medium">
                    Seus dados
                  </span>
                </div>

                {/* Divider */}
                <div className={`w-12 h-px shrink-0 transition-colors ${
                  step >= 3 ? 'bg-[#1f1f1f]' : 'bg-[#c8c8c8]'
                }`}></div>

                {/* Step 3 */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-colors ${
                    step >= 3
                      ? 'bg-[#8B5240] text-white'
                      : 'bg-white text-[#1f1f1f]'
                  }`}>
                    3
                  </div>
                  <span className="text-[#1f1f1f] text-sm font-medium">
                    Enviar
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Main Content */}
        <section className="mx-auto max-w-[1440px] px-5 py-16">
          {/* Step 1: Produtos & Artes - Two Column Layout */}
          {step === 1 && (
            <div className="flex flex-col gap-5 md:flex-row">
              {/* Left Column - Products */}
              <div className="flex-1">
                {/* Info Box */}
                <div className="bg-[#8B5240] rounded-2xl p-5 flex gap-4 mb-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-[10px] bg-white flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#4b1c09" strokeWidth="2">
                      <circle cx="6" cy="6" r="3"></circle>
                      <circle cx="18" cy="18" r="3"></circle>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm mb-1">
                      Envie a arte de cada produto
                    </p>
                    <p className="text-white text-sm">
                      — PDF, AI ou PNG (300dpi). Você pode enviar agora ou depois pelo nosso atendimento.
                    </p>
                  </div>
                </div>

                {/* Products in Cart */}
                <div className="space-y-5">
                  {cart.length > 0 ? (
                    cart.map(item => (
                      <div
                        key={cartItemKey(item.productId, item.color)}
                        className="bg-white rounded-2xl p-7 border border-[#c8c8c8]"
                      >
                        {/* Product Header with Image */}
                        <div className="flex flex-col gap-5 mb-7 pb-7 border-b border-[#c8c8c8] md:flex-row md:gap-10">
                          <div className="w-full h-48 md:w-40 md:h-40 bg-[#d9d9d9] rounded-3xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            {/* SKU and Remove */}
                            <div className="flex items-start justify-between mb-3">
                              <p className="text-[#8b8b8b] text-sm font-normal">
                                {item.category} · SKU {item.sku}
                              </p>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleRemoveProduct(item.productId, item.color)
                                }}
                                className="text-red-500 hover:text-red-700 flex items-center gap-1"
                              >
                                <X size={16} />
                                <span className="text-sm">Remover</span>
                              </button>
                            </div>

                            {/* Product Name */}
                            <h3 className="text-[#1f1f1f] text-xl font-semibold mb-1">
                              {item.name}
                            </h3>

                            {/* Color */}
                            {item.color && (
                              <div className="flex items-center gap-2 mb-3">
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-[#c8c8c8] flex-shrink-0"
                                  style={{ backgroundColor: parseColorEntry(item.color).hex }}
                                />
                                <span className="text-sm text-[#1f1f1f]">
                                  Cor: {parseColorEntry(item.color).name}
                                </span>
                              </div>
                            )}

                            {/* Description */}
                            <p className="text-[#1f1f1f] text-sm mb-4">
                              {item.description}
                            </p>

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-5">
                              <div className="flex items-center border border-[#c8c8c8] rounded-2xl p-2 bg-white">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.productId,
                                      item.color,
                                      item.quantity - 5
                                    )
                                  }
                                  disabled={item.quantity <= item.minQuantity}
                                  className="w-10 h-10 flex items-center justify-center border border-[#c8c8c8] rounded text-[#1f1f1f] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  −
                                </button>
                                <span className="px-8 text-2xl font-semibold text-[#1f1f1f]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.productId,
                                      item.color,
                                      item.quantity + 5
                                    )
                                  }
                                  className="w-10 h-10 flex items-center justify-center border border-[#c8c8c8] rounded text-[#1f1f1f] hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-xs text-[#1f1f1f]">
                                mín. {item.minQuantity} · incrementos de 5
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Art File Upload Box */}
                        <label className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition border-2 border-dashed ${
                          item.artFile
                            ? 'bg-[#e8f5e9] border-[#10b981]'
                            : 'bg-[#fff5ec] border-[#d2741f]'
                        }`}>
                          <div className={`flex-shrink-0 w-14 h-14 rounded-[10px] flex items-center justify-center ${
                            item.artFile
                              ? 'bg-[#10b981]'
                              : 'bg-[#d2741f]'
                          }`}>
                            {item.artFile ? (
                              <Check size={24} className="text-white" />
                            ) : (
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-extrabold text-xs tracking-wider uppercase ${
                              item.artFile ? 'text-[#10b981]' : 'text-[#d2741f]'
                            }`}>
                              {item.artFile ? 'ARQUIVO ENVIADO' : 'SELECIONAR ARQUIVO DE ARTE'}
                            </p>
                            <p className="text-[#1f1f1f] text-sm">
                              {item.artFile ? item.artFileName : 'PDF, AI ou PNG - Até 10MB'}
                            </p>
                          </div>
                          {item.artFile && (
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                handleArtFileUpload(item.productId, item.color, undefined)
                              }}
                              className="ml-4 text-gray-400 hover:text-gray-600"
                            >
                              <X size={20} />
                            </button>
                          )}
                          <input
                            type="file"
                            accept=".pdf,.ai,.png"
                            onChange={e =>
                              handleArtFileUpload(
                                item.productId,
                                item.color,
                                e.target.files?.[0]
                              )
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16 bg-white rounded-2xl border border-[#c8c8c8]">
                      <p className="text-[#1f1f1f] font-medium mb-4">
                        Nenhum produto selecionado
                      </p>
                      <p className="text-[#8b8b8b] text-sm">
                        Volte ao catálogo para adicionar produtos.
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex flex-col gap-3 mt-8 md:flex-row md:gap-5">
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="flex-1 border-2 border-[#4b1c09] text-[#1f1f1f] font-medium py-4 rounded-2xl hover:bg-[#fff5ec] transition flex items-center justify-center gap-2"
                  >
                    <ChevronRight size={20} className="rotate-180" />
                    Continuar comprando
                  </button>
                  <button
                    onClick={() => cart.length > 0 && setStep(2)}
                    disabled={cart.length === 0}
                    className="flex-1 bg-[#8B5240] text-white font-medium py-4 rounded-2xl hover:bg-[#3d1707] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continuar para dados
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Right Sidebar - Summary */}
              <div className="w-full md:w-96 md:flex-shrink-0">
                {/* Summary Card */}
                <div className="bg-white rounded-2xl border border-[#c8c8c8] p-7 mb-5 md:sticky md:top-32">
                  <p className="text-[#1f1f1f] text-xs font-extrabold tracking-widest uppercase mb-4">
                    Resumo
                  </p>

                  <div className="space-y-4 mb-7 pb-7 border-b border-[#c8c8c8]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8b8b8b] text-sm">Produtos</span>
                      <span className="text-[#1f1f1f] font-semibold text-sm">{cart.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8b8b8b] text-sm">Unidades totais</span>
                      <span className="text-[#1f1f1f] font-semibold text-sm">{totalQuantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8b8b8b] text-sm">Artes enviadas</span>
                      <span className="text-[#1f1f1f] font-semibold text-sm">
                        {totalArtFiles} <span className="font-normal">/ {cart.length}</span>
                      </span>
                    </div>
                  </div>

                  {/* Como Funciona */}
                  <div className="bg-[#fff5ec] border border-[#ecc29c] rounded-2xl p-7 mb-5">
                    <p className="text-[#1f1f1f] text-xs font-extrabold tracking-widest uppercase mb-3">
                      Como funciona
                    </p>
                    <p className="text-[#1f1f1f] text-sm">
                      Após o envio, retornamos com valor unitário, prazo de produção e prévia da personalização em{' '}
                      <span className="font-bold">até 24h úteis.</span>
                    </p>
                  </div>

                  {/* Finalizar Button */}
                  <button className="w-full bg-[#8B5240] text-white font-medium py-4 rounded-2xl hover:bg-[#3d1707] transition flex items-center justify-center gap-2 mb-5">
                    Finalizar orçamento
                    <ChevronRight size={20} />
                  </button>

                  {/* Help Section */}
                  <div className="bg-[#8B5240] rounded-2xl p-7 text-white">
                    <div className="flex gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-[#d4a574] flex items-center justify-center flex-shrink-0">
                        <MessageCircle size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-xl mb-1">Precisa de ajuda?</p>
                        <p className="text-sm text-white">Fale com nossa equipe e tire suas dúvidas sobre couros, prazos e personalização.</p>
                      </div>
                    </div>
                    <a
                      href={whatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-[#d4a574] text-white font-medium py-3 rounded-2xl hover:bg-[#c29354] transition"
                    >
                      Falar agora
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dados do Cliente */}
          {step === 2 && (
            <div className="flex flex-col gap-5 md:flex-row">
              {/* Left Column */}
              <div className="flex-1">
                {/* Product Summary */}
                <div className="bg-white rounded-2xl p-7 border border-[#c8c8c8] mb-6">
                  <div className="flex items-center justify-between mb-7 pb-7 border-b border-[#c8c8c8]">
                    <h3 className="text-[#1f1f1f] font-semibold text-xl">
                      Resumo dos produtos
                    </h3>
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 text-[#d4a574] text-sm hover:text-[#d2741f] font-medium transition"
                    >
                      <ChevronRight size={20} className="rotate-180" />
                      <span>Editar carrinho</span>
                    </button>
                  </div>

                  {/* Products List */}
                  <div className="space-y-5 mb-7">
                    {cart.map((item, index) => (
                      <div key={cartItemKey(item.productId, item.color)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                              item.artFile ? 'bg-[#10b981]' : 'bg-[#d2741f]'
                            }`}></div>
                            <span className="text-[#1f1f1f] text-sm">
                              <span className="font-semibold">{item.name}</span>
                              {item.color && (
                                <span className="text-[#8b8b8b]"> ({parseColorEntry(item.color).name})</span>
                              )}
                              <span className="text-[#1f1f1f]"> x {item.quantity} unidades</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.artFile ? (
                              <>
                                <Check size={16} className="text-[#10b981]" />
                                <span className="text-[#10b981] text-xs font-medium">Arte enviada</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 text-[#d2741f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="8" x2="12" y2="12"></line>
                                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                <span className="text-[#d2741f] text-xs font-medium">Aguardando arte</span>
                              </>
                            )}
                          </div>
                        </div>
                        {index < cart.length - 1 && (
                          <div className="border-t border-[#c8c8c8] mt-5"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Info Box */}
                  <div className="bg-[#fff5ec] rounded-2xl p-5">
                    <p className="text-[#1f1f1f] text-sm">
                      Você pode enviar agora mesmo assim — nossa equipe entrará em contato para receber as artes pendentes.
                    </p>
                  </div>
                </div>

                {/* Customer Data Form */}
                <div className="bg-white rounded-2xl p-7 border border-[#c8c8c8]">
                  <div className="mb-7">
                    <h3 className="text-[#1f1f1f] font-semibold text-xl mb-2">
                      Seus dados
                    </h3>
                    <p className="text-[#8b8b8b] text-sm">
                      Usamos apenas para enviar o orçamento e responder dúvidas.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Nome e Email */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-[#1f1f1f] mb-3">
                          Nome completo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={customerData.name}
                          onChange={e =>
                            setCustomerData({
                              ...customerData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-[#c8c8c8] rounded-lg focus:outline-none focus:border-[#d2741f] focus:ring-1 focus:ring-[#d2741f]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#1f1f1f] mb-3">
                          E-mail <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={customerData.email}
                          onChange={e =>
                            setCustomerData({
                              ...customerData,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-[#c8c8c8] rounded-lg focus:outline-none focus:border-[#d2741f] focus:ring-1 focus:ring-[#d2741f]"
                        />
                      </div>
                    </div>

                    {/* Telefone e Empresa */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-[#1f1f1f] mb-3">
                          Telefone / Whatsapp <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={customerData.phone}
                          onChange={e =>
                            setCustomerData({
                              ...customerData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-[#c8c8c8] rounded-lg focus:outline-none focus:border-[#d2741f] focus:ring-1 focus:ring-[#d2741f]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#1f1f1f] mb-3">
                          Empresa
                        </label>
                        <input
                          type="text"
                          value={customerData.company}
                          onChange={e =>
                            setCustomerData({
                              ...customerData,
                              company: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-[#c8c8c8] rounded-lg focus:outline-none focus:border-[#d2741f] focus:ring-1 focus:ring-[#d2741f]"
                        />
                      </div>
                    </div>

                    {/* Observações */}
                    <div>
                      <label className="block text-sm font-semibold text-[#1f1f1f] mb-3">
                        Observações{' '}
                        <span className="text-[#c8c8c8] font-normal">(opcional)</span>
                      </label>
                      <textarea
                        placeholder="Cores específicas, prazo desejado, detalhes da personalização"
                        value={customerData.notes}
                        onChange={e =>
                          setCustomerData({
                            ...customerData,
                            notes: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-[#c8c8c8] rounded-lg focus:outline-none focus:border-[#d2741f] focus:ring-1 focus:ring-[#d2741f] resize-none"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-8 md:flex-row md:gap-5">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-[#4b1c09] text-[#1f1f1f] font-medium py-4 rounded-2xl hover:bg-[#fff5ec] transition flex items-center justify-center gap-2"
                  >
                    <ChevronRight size={24} className="rotate-180" />
                    Voltar
                  </button>

                  <button
                    onClick={handleSubmitQuote}
                    disabled={isSubmitting}
                    className="flex-1 bg-[#8B5240] text-white font-medium py-4 rounded-2xl hover:bg-[#3d1707] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar orçamento'}
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>

              {/* Right Sidebar - Summary */}
              <div className="w-full md:w-96 md:flex-shrink-0">
                {/* Summary Card */}
                <div className="bg-white rounded-2xl border border-[#c8c8c8] p-7 mb-5 md:sticky md:top-32">
                  <p className="text-[#1f1f1f] text-xs font-extrabold tracking-widest uppercase mb-4">
                    Resumo
                  </p>

                  <div className="space-y-4 mb-7 pb-7 border-b border-[#c8c8c8]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8b8b8b] text-sm">Produtos</span>
                      <span className="text-[#1f1f1f] font-semibold text-sm">{cart.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8b8b8b] text-sm">Unidades totais</span>
                      <span className="text-[#1f1f1f] font-semibold text-sm">{totalQuantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8b8b8b] text-sm">Artes enviadas</span>
                      <span className="text-[#1f1f1f] font-semibold text-sm">
                        {totalArtFiles} <span className="font-normal">/ {cart.length}</span>
                      </span>
                    </div>
                  </div>

                  {/* Como Funciona */}
                  <div className="bg-[#fff5ec] border border-[#ecc29c] rounded-2xl p-7 mb-5">
                    <p className="text-[#1f1f1f] text-xs font-extrabold tracking-widest uppercase mb-3">
                      Como funciona
                    </p>
                    <p className="text-[#1f1f1f] text-sm">
                      Após o envio, retornamos com valor unitário, prazo de produção e prévia da personalização em{' '}
                      <span className="font-bold">até 24h úteis.</span>
                    </p>
                  </div>

                  {/* Finalizar Button */}
                  <button className="w-full bg-[#8B5240] text-white font-medium py-4 rounded-2xl hover:bg-[#3d1707] transition flex items-center justify-center gap-2 mb-5">
                    Finalizar orçamento
                    <ChevronRight size={20} />
                  </button>

                  {/* Help Section */}
                  <div className="bg-[#8B5240] rounded-2xl p-7 text-white">
                    <div className="flex gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-[#d4a574] flex items-center justify-center flex-shrink-0">
                        <MessageCircle size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-xl mb-1">Precisa de ajuda?</p>
                        <p className="text-sm text-white">Fale com nossa equipe e tire suas dúvidas sobre couros, prazos e personalização.</p>
                      </div>
                    </div>
                    <a
                      href={whatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-[#d4a574] text-white font-medium py-3 rounded-2xl hover:bg-[#c29354] transition"
                    >
                      Falar agora
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmação */}
          {step === 3 && (
            <div className="flex flex-col gap-5 max-w-[1400px]">
              {/* Success Message Card */}
              <div className="bg-white border border-[#c8c8c8] rounded-lg p-7 flex flex-col gap-5 md:flex-row md:gap-10 md:items-center">
                {/* Check Icon */}
                <div className="flex-shrink-0 w-[90px] h-[90px] rounded-xl bg-[#e8f5e9] flex items-center justify-center">
                  <Check size={50} className="text-[#10b981]" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="text-3xl md:text-[40px] font-semibold text-[#4b1c09] mb-2 font-serif leading-tight">
                    Orçamento enviado!
                  </h2>
                  <p className="text-[#1f1f1f] text-base leading-relaxed">
                    Recebemos seu pedido e nossa equipe entrará em contato em até 24 horas úteis com um orçamento detalhado.
                  </p>
                </div>
              </div>

              {/* Protocol Number Box */}
              <div className="bg-[#fff5ec] border border-[#ecc29c] rounded-4xl p-7">
                <p className="text-[#1f1f1f] text-xs uppercase tracking-[1.8px] font-extrabold mb-5">
                  Protocolo do orçamento
                </p>
                <p className="text-[#1f1f1f] text-2xl font-medium">
                  #{quoteId}
                </p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#ecc29c] text-[#4b1c09] text-sm">
                  <Mail size={16} className="flex-shrink-0" />
                  <span>
                    Enviamos uma confirmação do orçamento para <strong>{customerData.email}</strong>.
                  </span>
                </div>
              </div>

              {/* Back Button */}
              <div className="flex">
                <Link
                  href="/catalogo"
                  className="bg-[#8B5240] border border-[#4b1c09] text-white font-medium px-7 py-4 rounded-xl hover:bg-[#3d1707] transition flex items-center gap-1"
                >
                  <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Voltar ao catálogo
                </Link>
              </div>
            </div>
          )}

          {/* Products Modal */}
          {showProductModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[70vh] overflow-hidden flex flex-col">
                <div className="sticky top-0 bg-white border-b border-[#c8c8c8] px-8 py-6 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-[#1f1f1f]">
                    Adicionar produtos
                  </h3>
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="text-[#8b8b8b] hover:text-[#1f1f1f]"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 px-8 py-6 space-y-3">
                  {products && products.length > 0 ? (
                    products.map((product: any) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          handleAddProduct(product)
                          setShowProductModal(false)
                        }}
                        className="w-full flex items-center gap-4 p-4 border border-[#c8c8c8] rounded-lg hover:border-[#d2741f] hover:bg-[#fff5ec] transition text-left"
                      >
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-xs font-medium text-[#d2741f] tracking-wider uppercase mb-1">
                            {product.sku}
                          </p>
                          <h4 className="font-semibold text-[#1f1f1f]">
                            {product.name}
                          </h4>
                          <p className="text-xs text-[#8b8b8b] mt-1">
                            Mín. {product.minQuantity || 50} un.
                          </p>
                        </div>
                        <div className="text-[#d2741f] text-2xl flex-shrink-0">+</div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center text-[#8b8b8b] py-8">
                      <p>Carregando produtos...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </section>
      </main>
      <Footer />
    </>
  )
}

export default function OrcamentoPage() {
  return (
    <Suspense>
      <OrcamentoPageContent />
    </Suspense>
  )
}

