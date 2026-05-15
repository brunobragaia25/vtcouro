'use client'

const heroBg = '/images/foto-hero.png'
const textCircleSeloSvg = '/images/text-circle-selo.svg'
const medalRibbonsStar = '/images/Medal Ribbons Star.svg'

export function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-[#fff5ec] to-[#ffd8b5] flex justify-center overflow-x-hidden">
      <div className="max-w-container w-full px-5 relative flex items-center h-[600px] md:h-[700px] xl:h-[838px]">
        {/* Background gradient box */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fff5ec] to-[#ffd8b5] rounded-[40px] -z-10" />

        {/* Content wrapper */}
        <div className="w-full h-full flex items-stretch relative">
          {/* Left side - Text content */}
          <div className="flex-1 flex flex-col justify-between pt-[80px] pb-[60px] pl-5 z-10 md:pt-[100px] md:pb-[80px] xl:pt-[140px] xl:pb-[110px]">
            {/* Top section - ATELIER */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#1f1f1f] tracking-wider">ATELIER</span>
                <span className="text-sm font-black italic text-[#d2741f] tracking-wider">DESDE 1998</span>
              </div>
              <div className="w-80 h-px bg-gray-400" />
            </div>

            {/* Bottom section - Main content */}
            <div className="flex flex-col gap-8">
              {/* Titles */}
              <div className="flex flex-col gap-0">
                <h1 className="font-serif font-semibold text-[#4b1c09] leading-[1.2] text-[40px] md:text-[56px] xl:text-[80px]">
                  Couro genuíno,
                </h1>
                <h2 className="font-semibold italic text-[#d2741f] underline decoration-solid leading-none text-[40px] md:text-[56px] xl:text-[80px] xl:tracking-[-2.4px]">
                  feito sob medida
                </h2>
                <h3 className="font-serif font-semibold text-[#4b1c09] leading-none text-[40px] md:text-[56px] xl:text-[80px]">
                  para sua marca.
                </h3>
              </div>

              {/* Description */}
              <p className="text-[#4b1c09] leading-[1.5] max-w-xl text-[15px] md:text-[17px] xl:text-[20px]">
                Bolsas, pastas, mochilas, carteiras e sacolas em couro autêntico, personalizadas com a identidade da sua empresa. Produção própria em São Paulo.
              </p>
            </div>
          </div>

          {/* Right side - Image with Badge/Seal */}
          <div className="absolute right-0 top-0 h-full w-auto flex items-center justify-center overflow-hidden">
            {/* Hero Image */}
            <img
              src={heroBg}
              alt="Bolsa VTCouro"
              className="h-[600px] object-contain md:h-[700px] xl:h-[838px]"
            />

            {/* Badge/Seal */}
            <div className="absolute bottom-[40px] right-[40px] w-[120px] h-[120px] flex items-center justify-center z-20 md:w-[155px] md:h-[155px] md:bottom-[60px] md:right-[60px] xl:w-[196px] xl:h-[196px] xl:bottom-[80px] xl:right-[80px]">
              <div className="absolute inset-0 rounded-full bg-[#D4A574]" />
              <div className="absolute inset-[10%] rounded-full flex items-center justify-center">
                <img src={textCircleSeloSvg} alt="Text circle" className="w-full h-full object-contain" />
              </div>
              <div className="absolute inset-[22%] rounded-full bg-white flex items-center justify-center z-10">
                <img src={medalRibbonsStar} alt="Medal Ribbons Star" className="w-[65%] h-[65%] object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
