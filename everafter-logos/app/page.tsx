import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { CustomizationPreview } from "@/components/customization-preview"
import { Testimonials } from "@/components/testimonials"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <CustomizationPreview />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
