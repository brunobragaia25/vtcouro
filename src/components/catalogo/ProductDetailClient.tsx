'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/contexts/ToastContext';
import { ProductDetailSkeleton } from '@/components/ui/Skeleton';
import ProductCard from '@/components/catalogo/ProductCard';

interface ProductDetailClientProps {
  productSlug: string;
  category: string;
  initialProduct?: any;
}

export default function ProductDetailClient({
  productSlug,
  category,
  initialProduct
}: ProductDetailClientProps) {
  const { data: products = [], isLoading } = useProducts();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(50);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'specifications' | 'customization' | 'care'>('specifications');

  const product = useMemo(() => {
    // Use initialProduct if available (from server), otherwise search in fetched products
    if (initialProduct) return initialProduct;
    return products.find((p: any) => p.slug === productSlug);
  }, [products, productSlug, initialProduct]);

  // Initialize selected color and quantity based on product data
  useEffect(() => {
    if (product) {
      const defaultColor = product.availableColors?.[0] || 'Caramelo';
      setSelectedColor(defaultColor);
      setQuantity(product.minQuantity || 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p: any) => p.category?.name === product.category?.name && p.id !== product.id)
      .slice(0, 3);
  }, [products, product]);

  const parseColor = (raw: string): { name: string; hex: string } => {
    if (raw.includes('|')) {
      const idx = raw.lastIndexOf('|')
      return { name: raw.slice(0, idx), hex: raw.slice(idx + 1) }
    }
    const legacyMap: { [key: string]: string } = {
      'Caramelo': '#D4A574', 'Preto': '#1f1f1f', 'Marrom': '#8B4513',
      'Natural': '#E8D4C0', 'Chocolate': '#6B4423', 'Café': '#8B6F47',
      'Branco': '#F5F5F5', 'Cinza': '#808080', 'Vermelho': '#C41E3A', 'Azul': '#1E40AF',
    }
    return { name: raw, hex: legacyMap[raw] || '#cccccc' }
  }

  const handleQuantityChange = (value: number) => {
    if (value >= 50 && value % 5 === 0) {
      setQuantity(value);
    }
  };

  const handleIncrement = () => {
    handleQuantityChange(quantity + 5);
  };

  const handleDecrement = () => {
    if (quantity > 50) {
      handleQuantityChange(quantity - 5);
    }
  };

  if (isLoading && !product) {
    return (
      <div className="flex-1 bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-6">
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-600">Produto não encontrado</p>
      </div>
    );
  }

  const categoryName = product.category?.name || category;
  const breadcrumbs = ['Início', 'Catálogo', categoryName, product.name];

  return (
    <div className="flex-1 bg-white">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-container px-6 py-6 mb-8">
        <div className="bg-[#fff5ec] rounded-3xl p-6">
          <nav className="flex items-center gap-2 text-sm text-gray-900 flex-wrap">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-gray-400">/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'font-medium' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-container px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-20">
          {/* Image Gallery */}
          <div className="flex flex-col gap-5 h-full">
            {/* Main Image */}
            <div className="bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-center relative h-full min-h-[500px]">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 uppercase text-sm tracking-wider">
                    {product.category?.name}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden flex items-center justify-center ${
                    selectedImageIndex === idx ? 'ring-2 ring-[#d2741f]' : 'bg-gray-100'
                  }`}
                >
                  {product.imageUrl && idx === 0 ? (
                    <Image
                      src={product.imageUrl}
                      alt={`${product.name} thumbnail`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <p className="text-xs font-extrabold text-[#d2741f] tracking-widest uppercase">
                  SKU {product.sku}
                </p>
                {product.isFeatured && (
                  <span className="bg-[#d2741f] text-white text-xs font-extrabold px-3 py-1 rounded-full tracking-widest uppercase">
                    Destaque
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-[#1a7a4a] text-white text-xs font-extrabold px-3 py-1 rounded-full tracking-widest uppercase">
                    Lançamento
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-semibold text-[#4b1c09]">
                {product.name}
              </h1>
            </div>

            {/* Description */}
            <p className="text-base text-gray-900 leading-relaxed">
              {product.description}
            </p>

            {/* Minimum Order Info */}
            <div className="bg-[#fff5ec] border border-[#ecc29c] rounded-2xl p-5 flex gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[#ecc29c] rounded-full flex items-center justify-center">
                  <span className="text-yellow-700">★</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-sm text-gray-900">Pedido mínimo</p>
                <p className="text-base font-semibold text-gray-900">
                  {product.minQuantity || 50} unidades - valor sob orçamento
                </p>
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-[#d2741f] tracking-widest uppercase">
                  Cor do couro
                </label>
                <span className="text-sm text-gray-900 font-medium">{parseColor(selectedColor).name}</span>
              </div>
              <div className="flex gap-3">
                {(product.availableColors || ['Caramelo', 'Preto', 'Marrom', 'Natural']).map((raw: string) => {
                  const { name, hex } = parseColor(raw)
                  return (
                  <button
                    key={raw}
                    onClick={() => setSelectedColor(raw)}
                    className={`h-10 w-10 rounded-full border-2 transition-all flex-shrink-0 ${
                      selectedColor === raw
                        ? 'border-[#d2741f] ring-2 ring-[#d2741f] ring-offset-2'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: hex }}
                    title={name}
                  />
                  )
                })}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-extrabold text-[#d2741f] tracking-widest uppercase">
                  Quantidade
                </label>
                <span className="text-sm text-gray-900">(mín. 50)</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 50}
                    className="px-3 py-2 text-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 text-xl font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="px-3 py-2 text-xl text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-600">incrementos de 5 un.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 md:flex-row md:gap-4">
              <Link
                href={`/orcamento?product=${product.id}&quantity=${quantity}&color=${selectedColor}`}
                className="flex-1 bg-[#4b1c09] hover:bg-[#3d1707] text-white font-medium py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                Solicitar orçamento
                <ChevronRight size={20} />
              </Link>
              <button className="flex-1 border border-gray-900 text-gray-900 hover:bg-gray-50 font-medium py-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <MessageCircle size={20} />
                Falar com vendas
              </button>
            </div>

            {/* Info Cards */}
            <div className="flex flex-col gap-5">
              <div className="bg-[#f8f8f8] border border-[#c8c8c8] rounded-[16px] p-5 flex gap-7 items-center">
                <div className="relative w-[60px] h-[60px] flex-shrink-0">
                  <div className="absolute inset-0 bg-white rounded-[10px]" />
                  <img src="/images/Scissors.svg" alt="Personalização" className="absolute inset-0 m-auto w-8 h-8" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[#1f1f1f] text-base font-semibold">Personalização sob medida</p>
                  <p className="text-[#1f1f1f] text-xs font-normal">Envie sua arte (PDF, AI ou PNG) — gravamos no couro.</p>
                </div>
              </div>
              <div className="bg-[#f8f8f8] border border-[#c8c8c8] rounded-[16px] p-5 flex gap-7 items-center">
                <div className="relative w-[60px] h-[60px] flex-shrink-0">
                  <div className="absolute inset-0 bg-white rounded-[10px]" />
                  <img src="/images/Bus.svg" alt="Entrega" className="absolute inset-0 m-auto w-8 h-8" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-[#1f1f1f] text-base font-semibold">Entrega para todo o Brasil</p>
                  <p className="text-[#1f1f1f] text-xs font-normal">Prazo de produção: 15 a 25 dias úteis após aprovação.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="py-12 mb-20">
          <div className="space-y-6">
            <div className="flex gap-4 md:gap-12 border-b border-gray-300 pb-4">
              <button
                onClick={() => setActiveTab('specifications')}
                className={`text-sm md:text-base font-medium pb-2 relative transition-colors ${
                  activeTab === 'specifications'
                    ? 'text-[#d2741f] after:w-full after:bg-[#d2741f]'
                    : 'text-gray-900 after:w-0 hover:text-[#d2741f]'
                } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all`}
              >
                Especificações
              </button>
              <button
                onClick={() => setActiveTab('customization')}
                className={`text-sm md:text-base font-medium pb-2 relative transition-colors ${
                  activeTab === 'customization'
                    ? 'text-[#d2741f] after:w-full after:bg-[#d2741f]'
                    : 'text-gray-900 after:w-0 hover:text-[#d2741f]'
                } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all`}
              >
                Personalização
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`text-sm md:text-base font-medium pb-2 relative transition-colors ${
                  activeTab === 'care'
                    ? 'text-[#d2741f] after:w-full after:bg-[#d2741f]'
                    : 'text-gray-900 after:w-0 hover:text-[#d2741f]'
                } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:transition-all`}
              >
                Cuidados
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-50 rounded-3xl p-8 min-h-64">
              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Especificações</h3>
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(product.specifications).map(([key, value]: [string, unknown]) => (
                        <div key={key} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                          <div className="w-32">
                            <p className="text-sm font-semibold text-[#d2741f] uppercase tracking-wide">
                              {key}
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{String(value)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Nenhuma especificação disponível</p>
                  )}
                </div>
              )}

              {activeTab === 'customization' && (
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalização</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {product.customization || 'Nenhuma informação de personalização disponível'}
                  </p>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cuidados</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {product.care || 'Nenhuma informação de cuidados disponível'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl md:text-4xl font-semibold text-[#4b1c09]">
              Mais em {categoryName}
            </h2>
            <div className="bg-[#fff5ec] rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relProduct: any) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
