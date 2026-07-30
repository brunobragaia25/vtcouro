import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /admin ja e protegido pelo middleware, mas nao ha porque gastar
      // crawl budget nele nem expor /api nos resultados.
      disallow: ['/admin', '/admin/', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
