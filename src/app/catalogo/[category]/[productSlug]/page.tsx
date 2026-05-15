export const dynamic = 'force-dynamic'

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from '@/components/catalogo/ProductDetailClient';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface ProductPageProps {
  params: {
    category: string;
    productSlug: string;
  };
}

async function fetchProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await fetchProduct(params.productSlug);

  return {
    title: `${product?.name || 'Produto'} | VTCouro`,
    description: product?.description || 'Detalhes do produto - VTCouro',
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, productSlug } = params;
  const product = await fetchProduct(productSlug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <ProductDetailClient productSlug={productSlug} category={category} initialProduct={product} />
      <Footer />
    </div>
  );
}
