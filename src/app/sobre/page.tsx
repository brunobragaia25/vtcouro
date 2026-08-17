'use client'

import Link from 'next/link'
import { ChevronRight, MessageCircle } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { whatsappUrl } from '@/lib/seo'

export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">

        {/* Hero */}
        <div className="px-5 mt-0">
          <section className="bg-gradient-to-b from-[#fff5ec] to-[#ffd8b5] rounded-[28px] md:rounded-[40px] w-full py-10 md:py-16 xl:py-20">
            <div className="max-w-container mx-auto px-6 md:px-12">
              <h1 className="font-serif text-[#4b1c09] font-semibold leading-[1.1] text-4xl md:text-5xl xl:text-[64px]">
                Couro vivo,{' '}
                <span className="italic text-[#d2741f]">histórias</span>
                <br />
                que duram décadas.
              </h1>
            </div>
          </section>
        </div>

        {/* Intro */}
        <section className="w-full bg-white flex justify-center px-5 py-16 md:py-20">
          <div className="max-w-container w-full flex flex-col gap-10 md:flex-row md:gap-16 md:items-center">
            <p className="flex-1 text-[#1f1f1f] font-normal text-base md:text-lg xl:text-[20px]" style={{ lineHeight: '40px' }}>
              Há 27 anos transformamos couro nacional em peças que carregam a identidade de marcas brasileiras. Tradição artesanal, produção própria, e o cuidado de quem ama o que faz.
            </p>
            <div className="flex-1 h-[280px] md:h-[400px] xl:h-[480px] rounded-[20px] md:rounded-[28px] flex-shrink-0 overflow-hidden">
              <img
                src="/images/foto-quemsomos-01.jpeg"
                alt="Produção artesanal e showroom VTCouro"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="w-full bg-[#8B5240] flex justify-center px-5 py-10 md:py-[40px]">
          <div className="max-w-container w-full grid grid-cols-2 gap-8 md:flex md:justify-between md:items-center">
            {[
              { value: '27+', label: 'ANOS DE EMPRESA' },
              { value: '500+', label: 'MARCAS ATENDIDAS' },
              { value: '100k+', label: 'PEÇAS PRODUZIDAS' },
              { value: '100%', label: 'COURO NACIONAL' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-3 items-center justify-center">
                <p className="font-serif font-semibold text-white leading-[1.1] text-4xl md:text-5xl xl:text-[48px]">
                  {stat.value}
                </p>
                <p className="font-medium text-[#fff5ec] text-xs md:text-sm xl:text-base tracking-wider text-center">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Nossa História */}
        <section className="w-full bg-white flex justify-center px-5 py-16 md:py-20">
          <div className="max-w-container w-full flex flex-col gap-10 md:flex-row md:gap-16 md:items-center">
            <div className="flex-1 self-stretch rounded-[28px] md:rounded-[40px] flex-shrink-0 min-h-[320px] overflow-hidden">
              <img
                src="/images/foto-quemsomos-02.jpeg"
                alt="Vera Sena e Rosana Cossielo, fundadoras da VTCouro"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col gap-10">
              <div className="flex flex-col gap-7">
                <p className="text-[#d2741f] text-sm font-bold tracking-[2.4px] uppercase">
                  NOSSA HISTÓRIA
                </p>
                <h2 className="font-serif font-semibold text-[#4b1c09] leading-[1.1] text-4xl md:text-5xl xl:text-[64px]">
                  Nascida da amizade, construída com propósito.
                </h2>
              </div>
              <p className="text-[#1f1f1f] font-normal text-base md:text-lg xl:text-[20px]" style={{ lineHeight: '40px' }}>
                A VTCOURO nasceu em 1999 a partir da amizade e do espírito empreendedor de Vera Sena e Rosana Cossielo. Ao longo dos anos, a empresa consolidou sua atuação no desenvolvimento de bolsas, mochilas e acessórios personalizados, sempre valorizando a qualidade dos materiais, a funcionalidade dos produtos e a atenção aos detalhes.
                <br /><br />
                Mais do que produzir bolsas, a VTCOURO acredita na construção de relações duradouras com clientes, parceiros e colaboradores — baseadas em confiança, compromisso e respeito. Nossa trajetória é feita por pessoas que acreditam no trabalho bem-feito, na evolução constante e na busca por soluções que unam praticidade, organização e qualidade.
              </p>
            </div>
          </div>
        </section>

        {/* Como produzimos */}
        <section className="w-full bg-[#fff5ec] flex justify-center px-5 py-16 md:py-20">
          <div className="max-w-container w-full flex flex-col gap-16">
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-7">
                <p className="text-[#d2741f] text-sm font-bold tracking-[2.4px] uppercase">
                  COMO PRODUZIMOS
                </p>
                <h2 className="font-serif font-semibold text-[#4b1c09] leading-[1.1] text-3xl md:text-4xl xl:text-[40px]">
                  Da seleção do couro
                  <br />à entrega da peça.
                </h2>
              </div>
              <Link
                href="/catalogo"
                className="border border-[#1f1f1f] rounded-[12px] px-7 py-4 flex items-center gap-1 w-fit hover:bg-[#1f1f1f] hover:text-white transition text-base font-medium"
              >
                Catálogo completo
                <ChevronRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { num: '01', label: 'DESENHO DO PROJETO', desc: 'Todas as informações colhidas com nosso cliente norteiam nosso design no desenvolvimento da primeira peça para aprovação. Estando tudo aprovado, partimos para a produção.', span: 'md:col-span-2' },
                { num: '02', label: 'CORTE', desc: 'Nessa etapa é feito o corte do couro, revestimento interno, espuma e demais componentes.', span: 'md:col-span-1' },
                { num: '03', label: 'REBAIXAMENTO E AVIAMENTOS', desc: 'Rebaixamento do couro nas áreas de costura e separação de todos os aviamentos.', span: 'md:col-span-1' },
                { num: '04', label: 'PREPARAÇÃO E MONTAGEM', desc: 'Onde há dezenas ou até centenas de processos dependendo da peça — fazemos a preparação, montagem e costura das partes.', span: 'md:col-span-1' },
                { num: '05', label: 'COSTURA DE FECHAMENTO', desc: 'Unimos todas as partes da peça, fazendo a costura pelo avesso.', span: 'md:col-span-1' },
                { num: '06', label: 'MONTAGEM DE ACESSÓRIOS', desc: 'Desvira-se a peça para o lado certo, coloca-se acessórios como rodinhas quando necessário e faz-se uma primeira revisão.', span: 'md:col-span-1' },
                { num: '07', label: 'FINALIZAÇÃO E ENVIO', desc: 'Revisão rigorosa e cuidadosa, limpeza, embalagem e envio.', span: 'md:col-span-2' },
              ].map((step, i) => (
                <div key={i} className={`bg-white rounded-[40px] p-10 flex flex-col gap-5 ${step.span}`}>
                  <div className="flex flex-col gap-2.5">
                    <p className="font-serif font-semibold text-[#d2741f] text-[64px] leading-[1.1]">{step.num}</p>
                    <p className="text-[#1f1f1f] text-sm font-bold tracking-[2.4px]">{step.label}</p>
                  </div>
                  <p className="text-[#1f1f1f] text-sm font-normal leading-[1.4]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Quer conhecer nosso showroom? */}
        <section className="w-full bg-white flex justify-center px-5 py-10 md:py-20">
          <div className="max-w-container w-full">
            <div className="bg-[#8B5240] rounded-[28px] md:rounded-[40px] p-10 md:p-20 flex flex-col gap-16">
              <div className="flex flex-col gap-5">
                <h2 className="font-serif font-semibold text-[#d4a574] leading-[1.1] text-3xl md:text-4xl xl:text-[40px]">
                  Quer conhecer<br />nossos showrooms?
                </h2>
                <p className="text-white font-normal leading-[1.4] text-sm md:text-base max-w-xl">
                  Agende uma visita. Estamos em São Paulo.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:gap-5">
                <Link
                  href="/catalogo"
                  className="border border-white text-white rounded-[12px] px-7 py-4 flex items-center justify-center gap-1 w-fit hover:bg-white hover:text-[#4b1c09] transition font-medium"
                >
                  Catálogo completo
                  <ChevronRight size={20} />
                </Link>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-[#1f1f1f] rounded-[12px] px-7 py-4 flex items-center justify-center gap-3 w-fit hover:bg-[#d4a574] hover:text-white transition font-medium"
                >
                  <MessageCircle size={20} />
                  Falar com vendas
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}


