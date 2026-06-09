'use client'

import Link from 'next/link'
import { ChevronRight, MessageCircle } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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
            <div className="flex-1 h-[280px] md:h-[400px] xl:h-[480px] bg-[#d9d9d9] rounded-[20px] md:rounded-[28px] flex-shrink-0" />
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
            <div className="flex-1 h-[320px] md:h-[500px] xl:h-[626px] bg-[#d9d9d9] rounded-[28px] md:rounded-[40px] flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-10">
              <div className="flex flex-col gap-7">
                <p className="text-[#d2741f] text-sm font-bold tracking-[2.4px] uppercase">
                  NOSSA HISTÓRIA
                </p>
                <h2 className="font-serif font-semibold text-[#4b1c09] leading-[1.1] text-4xl md:text-5xl xl:text-[64px]">
                  De uma pequena empresa à referência nacional.
                </h2>
              </div>
              <p className="text-[#1f1f1f] font-normal text-base md:text-lg xl:text-[20px]" style={{ lineHeight: '40px' }}>
                Começamos com três artesãos e uma máquina de costura emprestada. Hoje, somos uma equipe de 24 pessoas em nossa sede de 600m² no bairro do Cambuci, em São Paulo — e cada peça que sai daqui carrega a mesma atenção do primeiro dia.
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

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                { num: '01', label: 'SELEÇÃO DO COURO', desc: 'Recebemos peles inteiras dos curtumes e classificamos por espessura, textura e veio.' },
                { num: '02', label: 'CORTE E MODELAGEM', desc: 'Moldes desenvolvidos na empresa, corte feito peça a peça com supervisão de mestres artesãos.' },
                { num: '03', label: 'COSTURA E ACABAMENTO', desc: 'Costura à mão nas linhas finas, máquina industrial nos volumes. Acabamento manual em todas as bordas.' },
                { num: '04', label: 'PERSONALIZAÇÃO', desc: 'Sua arte aplicada via hot stamping, laser ou bordado. Conferência final, embalagem e expedição.' },
              ].map((step, i) => (
                <div key={i} className="bg-white rounded-[40px] p-10 flex flex-col gap-5">
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
                  Quer conhecer nosso showroom?
                </h2>
                <p className="text-white font-normal leading-[1.4] text-sm md:text-base max-w-xl">
                  Agende uma visita ao nosso showroom em São Paulo, conheça nossos couros e veja a produção de perto. Atendimento sob agendamento, de segunda a sexta.
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
                <button className="bg-white text-[#1f1f1f] rounded-[12px] px-7 py-4 flex items-center justify-center gap-3 w-fit hover:bg-[#d4a574] hover:text-white transition font-medium">
                  <MessageCircle size={20} />
                  Falar com vendas
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}


