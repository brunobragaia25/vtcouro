import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface LegalPageLayoutProps {
  eyebrow: string;
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ eyebrow, title, updatedAt, children }: LegalPageLayoutProps) {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">
        {/* Hero */}
        <div className="px-5 mt-0">
          <section className="bg-gradient-to-b from-[#fff5ec] to-[#ffd8b5] rounded-[28px] md:rounded-[40px] w-full py-10 md:py-16 xl:py-20">
            <div className="max-w-container mx-auto px-6 md:px-12 flex flex-col gap-3">
              <p className="text-[#d2741f] text-sm font-bold tracking-[2.4px] uppercase">
                {eyebrow}
              </p>
              <h1 className="font-serif text-[#4b1c09] font-semibold leading-[1.1] text-4xl md:text-5xl xl:text-[56px]">
                {title}
              </h1>
              <p className="text-[#1f1f1f]/60 text-sm mt-2">Última atualização em {updatedAt}</p>
            </div>
          </section>
        </div>

        {/* Content */}
        <section className="w-full bg-white flex justify-center px-5 py-16 md:py-20">
          <div className="max-w-3xl w-full flex flex-col gap-10 legal-content">
            {children}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
