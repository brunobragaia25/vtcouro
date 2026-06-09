import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BannerSlider } from '@/components/home/BannerSlider'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { NewProducts } from '@/components/home/NewProducts'
import { CTA } from '@/components/home/CTA'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <BannerSlider />
        <CategoriesSection />
        <FeaturedProducts />
        <NewProducts />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
