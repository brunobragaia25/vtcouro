import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '../styles/globals.css'
import { QueryProvider } from '@/providers/QueryProvider'
import { ToastProvider } from '@/contexts/ToastContext'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { OG_IMAGE, ORGANIZATION, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-dm-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'VTCouro - Produtos de Couro Personalizados',
    // Paginas internas viram "Catalogo | VTCouro" sem repetir a marca na mao
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'bolsas de couro personalizadas',
    'pastas de couro',
    'mochilas de couro',
    'brindes corporativos em couro',
    'couro personalizado com logo',
    'VTCouro',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'VTCouro - Produtos de Couro Personalizados',
    description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VTCouro - Produtos de Couro Personalizados',
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: ORGANIZATION.name,
  legalName: ORGANIZATION.legalName,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logotipo-nav-bar-vt-couro.svg`,
  image: OG_IMAGE,
  description: SITE_DESCRIPTION,
  email: ORGANIZATION.email,
  telephone: ORGANIZATION.telephone,
  address: { '@type': 'PostalAddress', addressCountry: 'BR' },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: ORGANIZATION.telephone,
    email: ORGANIZATION.email,
    availableLanguage: ['Portuguese'],
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'pt-BR',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/catalogo?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className={dmSans.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, websiteJsonLd]),
          }}
        />
        <QueryProvider>
          <ToastProvider>
            {children}
            <WhatsAppButton />
          </ToastProvider>
        </QueryProvider>
        {/* nao rastreia o painel administrativo, so o site publico */}
        <Analytics beforeSend={(event) => (event.url.startsWith('/admin') ? null : event)} />
      </body>
    </html>
  )
}
