'use client'

import { FaInstagram, FaLinkedin } from 'react-icons/fa'
import { useCategories } from '@/hooks/useCategories'
import { useSubcategories } from '@/hooks/useSubcategories'
import { whatsappUrl } from '@/lib/seo'

export function Footer() {
  const { data: categories = [] } = useCategories()
  const { data: allSubcategories = [] } = useSubcategories()

  const subcategoriesByCategoryId = categories.reduce((acc: Record<string, any[]>, category: any) => {
    acc[category.id] = allSubcategories.filter((sub: any) => sub.categoryId === category.id)
    return acc
  }, {} as Record<string, any[]>)

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
                  {subcategoriesByCategoryId[category.id]?.map((sub: any) => (
                    <li key={sub.id}>
                      <a
                        href={`/catalogo?category=${category.slug}&subcategory=${sub.id}`}
                        className="text-[#1f1f1f] hover:text-[#8B5240] transition"
                      >
                        {sub.name}
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






