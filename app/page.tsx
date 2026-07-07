import { About } from '@/components/about/about'
import { BlogSection } from '@/components/blog/blog-section'
import { Contact } from '@/components/contact/contact'
import { Footer } from '@/components/footer/footer'
import { Hero } from '@/components/hero/hero'
import { Navbar } from '@/components/navbar/navbar'
import { FeaturedProperties } from '@/components/properties/featured-properties'

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <BlogSection />
      <About />
      <Contact />
      <Footer />
    </>
  )
}
