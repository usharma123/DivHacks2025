import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Gallery } from "@/components/gallery"
import { CustomizationPreview } from "@/components/customization-preview"
import { Testimonials } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Gallery />
        <CustomizationPreview />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
