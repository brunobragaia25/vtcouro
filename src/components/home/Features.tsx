'use client'


interface FeatureProps {
  title: string
  subtitle: string
  icon: React.ReactNode
}

function BagIcon() {
  return <img src="/images/Bag 6.svg" alt="Bag" className="w-8 h-8" />
}

function ScissorsIcon() {
  return <img src="/images/Scissors.svg" alt="Scissors" className="w-8 h-8" />
}

function HandshakeIcon() {
  return <img src="/images/Hand Shake.svg" alt="Handshake" className="w-8 h-8" />
}

function BusIcon() {
  return <img src="/images/Bus.svg" alt="Bus" className="w-8 h-8" />
}

function FeatureCard({ title, subtitle, icon }: FeatureProps) {
  return (
    <div className="border border-[#d7d7d7] rounded-[28px] p-5 flex gap-2.5 items-center flex-1 min-w-0">
      <div className="w-[72px] h-[72px] bg-[#fff5ec] rounded-[20px] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-1.5 flex-1 items-center text-center">
        <p className="text-[16px] font-medium text-[#1f1f1f]">
          {title}
        </p>
        <p className="text-[12px] font-normal text-[#1f1f1f]">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export function Features() {
  const features = [
    {
      title: 'Couro Selecionado',
      subtitle: 'Vegetal e cromo curtido',
      icon: <BagIcon />
    },
    {
      title: 'Corte sob medida',
      subtitle: 'Sua arte, nossa execução',
      icon: <ScissorsIcon />
    },
    {
      title: 'Acabamento manual',
      subtitle: 'Costuras à mão',
      icon: <HandshakeIcon />
    },
    {
      title: 'Entrega Brasil',
      subtitle: 'Logística para todo o país',
      icon: <BusIcon />
    }
  ]

  return (
    <section className="w-full bg-white flex justify-center pt-[20px]">
      <div className="max-w-container w-full px-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              subtitle={feature.subtitle}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
