import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import '../styles/globals.css'
import { QueryProvider } from '@/providers/QueryProvider'
import { ToastProvider } from '@/contexts/ToastContext'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

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
  title: 'VTCouro - Produtos de Couro Personalizados',
  description: 'Bolsas, pastas, mochilas e acessórios de couro de alta qualidade, personalizáveis para seu negócio.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${playfair.variable}`}>
<body className={dmSans.className}>
        <QueryProvider>
          <ToastProvider>
            {children}
            <WhatsAppButton />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
