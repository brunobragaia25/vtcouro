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

export const WHATSAPP_NUMBER = '5511941382445';

/**
 * Atribuicao de campanhas pagas (Google Ads) para o WhatsApp.
 *
 * Nao da pra so trocar a mensagem padrao do WhatsApp para todo mundo: isso
 * faria visitantes organicos/diretos tambem mandarem "vi o anuncio no
 * Google", o que destroi o proprio rastreamento que a campanha precisa.
 * Em vez disso, capturamos o parametro que o Google Ads anexa na URL de
 * chegada (gclid, ou utm_source=google configurado no sufixo da URL final)
 * uma unica vez na entrada do visitante, guardamos em sessionStorage (dura
 * a sessao da aba, nao contamina visitas futuras) e so entao os botoes de
 * WhatsApp passam a usar a mensagem da campanha, em qualquer pagina do site
 * que o visitante clicar durante essa sessao.
 */
const ADS_SESSION_KEY = 'whatsapp_ads_attribution';

const GOOGLE_ADS_WHATSAPP_MESSAGE =
  'Olá! Vi o anúncio da VTCouro no Google e gostaria de solicitar um orçamento para o atacado/corporativo.';

/**
 * Le a URL de chegada em busca de sinais de campanha do Google Ads e marca
 * a sessao, se encontrar. Chamar uma vez, na montagem do layout raiz -
 * so tem efeito no navegador (verifica `window` por seguranca, caso algum
 * dia seja importado por engano em um componente de servidor).
 */
export function captureAdsAttribution(): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const fromGoogleAds =
    params.has('gclid') || params.get('utm_source')?.toLowerCase() === 'google';

  if (fromGoogleAds) {
    window.sessionStorage.setItem(ADS_SESSION_KEY, '1');
  }
}

function isAdsSession(): boolean {
  if (typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(ADS_SESSION_KEY) === '1';
}

export function whatsappUrl(message?: string): string {
  const resolvedMessage = message ?? (isAdsSession() ? GOOGLE_ADS_WHATSAPP_MESSAGE : undefined);
  const text = resolvedMessage ? `?text=${encodeURIComponent(resolvedMessage)}` : '';
  return `https://wa.me/${WHATSAPP_NUMBER}${text}`;
}

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
  // Sem CEP: preencher assim que soubermos, mas nao deixar postalCode vazio
  // no JSON-LD (o validador do Google pode acusar campo invalido).
  address: {
    streetAddress: 'Alameda Segundo Sargento Névio Baracho Dos Santos, 114',
    addressLocality: 'São Paulo',
    addressRegion: 'SP',
    addressCountry: 'BR',
  },
};

/**
 * Remetente dos e-mails transacionais (Resend). Precisa ser um endereco do
 * dominio verificado na conta Resend em uso - sem isso, o Resend aceita o
 * envio apenas para o proprio e-mail dono da conta (modo sandbox).
 */
export const FROM_EMAIL = ORGANIZATION.email;
