import type { Metadata } from 'next';

// A page.tsx de /catalogo e client component e nao pode exportar metadata,
// entao ela vive neste layout.
export const metadata: Metadata = {
  // Precisa ser objeto com `template`: um title em string simples aqui
  // sobrescreveria o template da raiz para as paginas de produto abaixo,
  // que perderiam o sufixo "| VTCouro".
  title: {
    default: 'Catálogo de produtos em couro',
    template: '%s | VTCouro',
  },
  description:
    'Conheça a linha completa VTCouro: bolsas, pastas, mochilas, carteiras e acessórios em couro, personalizáveis com a marca da sua empresa.',
  alternates: { canonical: '/catalogo' },
  openGraph: {
    title: 'Catálogo de produtos em couro | VTCouro',
    description:
      'Bolsas, pastas, mochilas e acessórios em couro personalizáveis para sua empresa.',
    url: '/catalogo',
  },
};

export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
