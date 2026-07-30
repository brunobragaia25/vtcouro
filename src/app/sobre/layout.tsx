import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre nós',
  description:
    'Conheça a VTCouro: fabricação própria de produtos em couro genuíno, com personalização para empresas e atenção a cada detalhe do acabamento.',
  alternates: { canonical: '/sobre' },
  openGraph: {
    title: 'Sobre a VTCouro',
    description:
      'Fabricação própria de produtos em couro genuíno, com personalização para empresas.',
    url: '/sobre',
  },
};

export default function SobreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
