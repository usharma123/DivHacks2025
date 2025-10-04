import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blush/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-champagne/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground text-sm font-medium mb-6">
            <Sparkles size={16} />
            <span>Instant Wedding Logo Creation</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
            Design Your Wedding Monogram in Minutes
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Create a personalized wedding logo with instant customization, designer fonts, and high-resolution
            downloads. Perfect for invitations, signage, and all your special day details.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild size="lg" className="text-base px-8 py-6 h-auto font-medium">
              <Link href="#customization">Start Designing</Link>
            </Button>
          </div>

          {/* Hero Visual */}
          <div className="relative max-w-3xl mx-auto">
            <div className="aspect-video rounded-xl bg-gradient-to-br from-blush/30 via-champagne/30 to-sage/30 border border-border shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="font-serif text-6xl md:text-8xl font-bold text-primary mb-4 animate-fade-in">A & J</div>
                <div className="text-sm md:text-base text-muted-foreground tracking-widest">JUNE 15, 2025</div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-blush/40 rounded-full" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-sage/40 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
