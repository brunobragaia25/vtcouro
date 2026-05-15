import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { NewProducts } from '@/components/home/NewProducts'
import { CTA } from '@/components/home/CTA'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <CategoriesSection />
        <FeaturedProducts />
        <NewProducts />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
