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
}

module.exports = nextConfig
