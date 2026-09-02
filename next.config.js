// Extrai o hostname a partir da URL do Supabase em uso, em vez de
// hardcodar o projeto - assim o remotePattern acompanha o .env em
// qualquer ambiente (dev, preview, producao).
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Imagens de produto/categoria/banner/fonte enviadas pelo admin
      // ficam no Supabase Storage - sem isso, o next/image bloqueia a
      // otimizacao (o browser mostra imagem quebrada mesmo com a URL
      // funcionando normalmente fora do componente Image).
      ...(supabaseHostname
        ? [{ protocol: 'https', hostname: supabaseHostname }]
        : []),
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  async redirects() {
    return [
      // O site antigo (CMS PHP) ainda esta indexado no Google com URLs
      // /index.php/... que hoje nao existem mais - um 404 nao avisa o
      // Google que a pagina sumiu de vez, entao ele demora a atualizar o
      // indice. Um 301 para o catalogo e o sinal mais forte, alem de nao
      // deixar quem clicar num link antigo (ex: resultado de busca) cair
      // numa pagina quebrada.
      {
        source: '/index.php/:path*',
        destination: '/catalogo',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
