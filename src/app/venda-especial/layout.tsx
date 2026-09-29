import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Venda Especial',
  description:
    'Produtos em couro da VTCouro com estoque limitado. Escolha as peças e feche pelo WhatsApp.',
  alternates: { canonical: '/venda-especial' },
};

export default function VendaEspecialLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
