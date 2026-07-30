/**
 * Configuracao central de SEO.
 *
 * O host canonico e o `www`: o apex (vtcouro.com.br) responde 308 para ele,
 * entao todas as URLs absolutas, canonicals e o sitemap precisam usar `www`
 * para nao apontarem para uma URL que redireciona.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://www.vtcouro.com.br';

export const SITE_NAME = 'VTCouro';

export const SITE_DESCRIPTION =
  'Bolsas, pastas, mochilas e acessórios de couro de alta qualidade, personalizáveis com a marca da sua empresa. Fabricação própria e atendimento sob orçamento.';

/** Imagem padrao de compartilhamento (1200x630). */
export const OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Dados da empresa reaproveitados no JSON-LD. */
export const ORGANIZATION = {
  name: SITE_NAME,
  legalName: 'VTCouro',
  email: 'vendas@vtcouro.com.br',
  telephone: '+551126361112',
  url: SITE_URL,
};
