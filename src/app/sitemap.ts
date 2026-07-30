import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/seo';

// O sitemap depende do banco, entao nao pode ser gerado no build estatico.
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/catalogo`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/sobre`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/orcamento`, changeFrequency: 'monthly', priority: 0.7 },
  ];

  try {
    const [categories, products] = await Promise.all([
      prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
      }),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${SITE_URL}/catalogo?category=${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${SITE_URL}/catalogo/${p.category.slug}/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch (error) {
    // Um erro de banco nao pode derrubar o sitemap inteiro: sem as rotas
    // estaticas o Google perderia ate a home.
    console.error('sitemap: falha ao carregar dados do banco', error);
    return staticRoutes;
  }
}
