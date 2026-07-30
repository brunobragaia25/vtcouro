import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solicite um orçamento',
  description:
    'Monte sua lista de produtos em couro e receba um orçamento personalizado da VTCouro, com quantidades, cores e personalização da sua marca.',
  alternates: { canonical: '/orcamento' },
  openGraph: {
    title: 'Solicite um orçamento | VTCouro',
    description:
      'Monte sua lista e receba um orçamento personalizado para produtos em couro.',
    url: '/orcamento',
  },
};

export default function OrcamentoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
