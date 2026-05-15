'use client'

import Link from 'next/link'

const imgPropagandista = '/images/bolsa e pastas.png'
const imgViagem = '/images/mochila.png'
const imgCorporativa = '/images/carteira-uso.png'

interface CategoryCardProps {
  title: string
  image: string
  href: string
  className?: string
}

function CategoryCard({ title, image, href, className = '' }: CategoryCardProps) {
  return (
    <Link href={href} className={`relative rounded-[28px] md:rounded-[40px] bg-[#250b00] overflow-hidden flex flex-col justify-between p-6 md:p-10 h-[280px] min-h-[280px] md:h-[420px] md:min-h-[420px] ${className}`}>
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10">
        <span className="border border-white rounded-full px-4 py-2 md:px-5 md:py-3 text-white text-sm md:text-base font-normal hover:bg-white hover:text-[#250b00] transition">
          Veja mais
        </span>
      </div>
      <h2 className="relative z-10 font-serif font-semibold italic text-white leading-tight text-[40px] md:text-[68px]">
        {title}
      </h2>
    </Link>
  )
}

export function CategoriesSection() {
  return (
    <section className="w-full bg-white flex justify-center pt-[20px] pb-[20px]">
      <div className="max-w-container w-full px-5">
        {/* Row 1: Propagandista + Viagem */}
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:gap-5 md:mb-5">
          <CategoryCard
            title="Linha Propagandista"
            image={imgPropagandista}
            href="/catalogo?category=linha-propagandista"
            className="md:flex-1"
          />
          <CategoryCard
            title="Linha Viagem"
            image={imgViagem}
            href="/catalogo?category=linha-viagem"
            className="md:flex-1"
          />
        </div>

        {/* Row 2: Corporativa - full width */}
        <CategoryCard
          title="Linha Corporativa"
          image={imgCorporativa}
          href="/catalogo?category=linha-corporativa"
          className="w-full"
        />
      </div>
    </section>
  )
}
