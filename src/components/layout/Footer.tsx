'use client'

import { useMemo } from 'react'
import { FaInstagram, FaLinkedin } from 'react-icons/fa'
import { useCategories } from '@/hooks/useCategories'
import { useProducts } from '@/hooks/useProducts'
import { whatsappUrl } from '@/lib/seo'

export function Footer() {
  const { data: categories = [] } = useCategories()
  // useProducts() ja e chamado pelo Header em toda pagina, entao isso nao
  // gera uma requisicao extra (mesma queryKey, cache do React Query).
  const { data: apiProducts = [] } = useProducts()

  // Mesma regra usada no filtro do catalogo (src/app/catalogo/page.tsx):
  // agrupa por categoria a que o produto pertence (principal OU
  // adicional) + nome da subcategoria, em vez de listar as subcategorias
  // cadastradas no banco para aquela categoria. A lista cadastrada podia
  // ter subcategoria sem nenhum produto (link morto, ex: "Porta Tablet")
  // e ficava sem as que so chegam ali via categoria adicional (ex:
  // "Bolsa de Apoio" aparecendo em Linha Corporativa).
  const subcategoriesByCategorySlug = useMemo(() => {
    const map: Record<string, Set<string>> = {}
    apiProducts.forEach((product: any) => {
      if (!product.subcategory?.name) return
      const slugs = [product.category?.slug, ...(product.additionalCategories || []).map((c: any) => c.slug)].filter(Boolean)
      slugs.forEach((slug: string) => {
        if (!map[slug]) map[slug] = new Set()
        map[slug].add(product.subcategory.name)
      })
    })
    const sorted: Record<string, string[]> = {}
    Object.keys(map).forEach((slug) => {
      sorted[slug] = Array.from(map[slug]).sort((a, b) => a.localeCompare(b))
    })
    return sorted
  }, [apiProducts])

  return (
    <footer className="w-full bg-[#FFEEDE] text-[#1f1f1f] flex justify-center">
      <div className="max-w-container w-full px-5 md:px-8 py-12 md:py-16">
        {/* Main Content */}
        <div className="flex flex-col gap-10 mb-10 pb-10 border-b lg:flex-row lg:justify-between lg:mb-12 lg:pb-12" style={{ borderBottomColor: 'rgba(0,0,0,0.1)' }}>
          {/* Logo Section */}
          <div className="flex flex-col gap-6 lg:gap-0 lg:justify-between lg:w-[287px] lg:flex-shrink-0">
            <div className="w-32 h-12 relative">
              <img
                src="/images/logotipo-footer-vt-couro.svg"
                alt="VTCouro"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm text-[#1f1f1f]/70 leading-relaxed">
              Especialistas em produtos de couro personalizados para empresas e marcas. Showroom em São Paulo desde 1998.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/vtcouro_oficial/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da VTCouro"
                className="w-9 h-9 border border-[#1f1f1f]/30 rounded-full flex items-center justify-center text-[#1f1f1f] hover:bg-[#d2741f] hover:border-[#d2741f] hover:text-white transition"
              >
                <FaInstagram size={16} />
              </a>
              <a
                href="https://www.linkedin.com/company/vt-couro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn da VTCouro"
                className="w-9 h-9 border border-[#1f1f1f]/30 rounded-full flex items-center justify-center text-[#1f1f1f] hover:bg-[#d2741f] hover:border-[#d2741f] hover:text-white transition"
              >
                <FaLinkedin size={16} />
              </a>
            </div>
          </div>

          {/* Links grid — 2 cols on mobile, inline on md+ */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:flex lg:gap-16">
            {/* Colunas de categorias, com subcategorias */}
            {categories.map((category: any) => (
              <div key={category.id} className="space-y-5">
                <h4 className="text-[#d2741f] text-sm font-semibold tracking-wider uppercase">
                  {category.name}
                </h4>
                <ul className="space-y-3 text-sm">
                  {subcategoriesByCategorySlug[category.slug]?.map((subName: string) => (
                    <li key={subName}>
                      <a
                        href={`/catalogo?category=${category.slug}&subcategory=${encodeURIComponent(`${category.slug}::${subName}`)}`}
                        className="text-[#1f1f1f] hover:text-[#8B5240] transition"
                      >
                        {subName}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href={`/catalogo?category=${category.slug}`} className="text-[#1f1f1f] hover:text-[#8B5240] transition">
                      Ver produtos
                    </a>
                  </li>
                </ul>
              </div>
            ))}

            {/* Column 4: Contact & Company */}
            <div className="space-y-8">
              <div className="space-y-5">
                <h4 className="text-[#d2741f] text-sm font-semibold tracking-wider uppercase">
                  Contato
                </h4>
                <div className="space-y-3 text-sm">
                  <a href="https://maps.google.com/?q=Alameda+Segundo+Sargento+Névio+Baracho+Dos+Santos,+114,+São+Paulo,+SP" target="_blank" rel="noopener noreferrer" className="block text-[#1f1f1f] hover:text-[#8B5240] transition">
                    Al. Segundo Sargento Névio
                    <br />
                    Baracho Dos Santos, 114
                    <br />
                    - Pq Novo Mundo, São Paulo / SP
                  </a>
                  <p className="text-[#1f1f1f]">(11) 2636-1112</p>
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#1f1f1f] hover:text-[#8B5240] transition"
                  >
                    (11) 94138-2445
                  </a>
                  <a href="mailto:vtcouro@vtcouro.com.br" className="block text-[#1f1f1f] hover:text-[#8B5240] transition">vtcouro@vtcouro.com.br</a>
                </div>
              </div>

              <div className="space-y-5">
                <h4 className="text-[#d2741f] text-sm font-semibold tracking-wider uppercase">
                  Empresa
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="/sobre" className="text-[#1f1f1f] hover:text-[#8B5240] transition">
                      Sobre nós
                    </a>
                  </li>
                  <li>
                    <a href="/orcamento" className="text-[#1f1f1f] hover:text-[#8B5240] transition">
                      Orçamento
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[#1f1f1f]/60">© 2026 VTCouro. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 md:gap-6">
            <a href="/politica-de-privacidade" className="text-[#1f1f1f]/60 hover:text-[#8B5240] transition">
              Política de Privacidade
            </a>
            <div className="w-px h-3 bg-gray-600 hidden lg:block"></div>
            <a href="/termos-de-servico" className="text-[#1f1f1f]/60 hover:text-[#8B5240] transition">
              Termos de Serviço
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}






