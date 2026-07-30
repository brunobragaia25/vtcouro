export const dynamic = 'force-dynamic'

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from '@/components/catalogo/ProductDetailClient';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/seo';

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

/** Primeira imagem do produto como URL absoluta, com fallback para a OG padrao. */
function productImage(product: { imageUrl: string | null; images: string[] }): string {
  const raw = product.imageUrl || product.images?.[0];
  if (!raw) return OG_IMAGE;
  return raw.startsWith('http') ? raw : absoluteUrl(raw);
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await fetchProduct(params.productSlug);

  if (!product) {
    return { title: 'Produto não encontrado', robots: { index: false, follow: true } };
  }

  const description =
    product.description?.slice(0, 300) ||
    `${product.name} em couro genuíno, personalizável com a marca da sua empresa. Peça um orçamento à VTCouro.`;
  const url = `/catalogo/${params.category}/${product.slug}`;
  const image = productImage(product);

  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: `${product.name} | ${SITE_NAME}`,
      description,
      url,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, productSlug } = params;
  const product = await fetchProduct(productSlug);

  if (!product) {
    notFound();
  }

  const url = absoluteUrl(`/catalogo/${category}/${product.slug}`);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || undefined,
    sku: product.sku || undefined,
    image: [productImage(product)],
    url,
    category: product.category?.name,
    material: 'Couro',
    brand: { '@type': 'Brand', name: SITE_NAME },
    color: product.availableColors?.map((c) => c.split('|')[0]).join(', ') || undefined,
    offers: {
      '@type': 'Offer',
      url,
      // O site trabalha sob orcamento, sem preco publico. `PreOrder` com
      // priceSpecification vazio seria invalido, entao declaramos so a
      // disponibilidade e o canal de contato.
      availability: 'https://schema.org/InStock',
      businessFunction: 'https://schema.org/Sell',
      seller: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Catálogo', item: absoluteUrl('/catalogo') },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category?.name || 'Categoria',
        item: absoluteUrl(`/catalogo?category=${category}`),
      },
      { '@type': 'ListItem', position: 4, name: product.name, item: url },
    ],
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productJsonLd, breadcrumbJsonLd]),
        }}
      />
      <Header />
      <ProductDetailClient productSlug={productSlug} category={category} initialProduct={product} />
      <Footer />
    </div>
  );
}
