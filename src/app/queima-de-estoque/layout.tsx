import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Queima de Estoque',
  description:
    'Produtos em couro da VTCouro com estoque limitado. Escolha as peças e feche pelo WhatsApp.',
  alternates: { canonical: '/queima-de-estoque' },
};

export default function QueimaDeEstoqueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
