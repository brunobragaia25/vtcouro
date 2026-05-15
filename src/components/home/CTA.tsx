'use client'

export function CTA() {
  return (
    <section className="w-full bg-[#fff5ec] flex justify-center pt-10 md:pt-16 xl:pt-[64px] pb-[64px] md:pb-[96px] xl:pb-[128px]">
      <div className="max-w-container w-full px-5">
        <div className="bg-[#250b00] rounded-[28px] md:rounded-[40px] flex flex-col items-center justify-center p-8 md:p-12 xl:p-[60px] h-auto xl:h-[520px] gap-6 xl:gap-[28px]">

          {/* Label and Heading */}
          <div className="flex flex-col gap-2.5 items-center">
            <p className="text-[#d2741f] text-sm font-black italic tracking-wider uppercase">
              Próximo Passo
            </p>
            <h2 className="font-serif text-white font-semibold leading-tight text-center text-4xl md:text-5xl xl:text-6xl">
              Pronto para começar
              <br />
              seu projeto?
            </h2>
          </div>

          {/* Description */}
          <p className="text-white leading-relaxed text-center max-w-2xl text-base md:text-lg xl:text-xl">
            Monte seu pedido pelo catálogo, envie sua arte e nossa equipe retorna com um orçamento detalhado em até 24 horas úteis.
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-5 w-full md:w-auto">
            <button className="w-full md:w-auto bg-[#d2741f] text-white px-7 py-4 rounded-[12px] font-medium hover:opacity-90 transition flex items-center justify-center gap-1">
              Iniciar Orçamento
              <span>→</span>
            </button>
            <button className="w-full md:w-auto border border-white text-white px-7 py-4 rounded-[12px] font-medium hover:bg-white hover:text-[#250b00] transition">
              Whatsapp
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
