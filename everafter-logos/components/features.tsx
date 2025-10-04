import { Palette, Sparkles, Download, Type } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Type,
    title: "Personalized Monograms",
    description:
      "Enter your names, initials, wedding date, and venue. Create a logo that tells your unique love story.",
  },
  {
    icon: Palette,
    title: "Designer Fonts & Palettes",
    description:
      "Choose from curated wedding typography and color swatches including pastels, neutrals, and bold accents.",
  },
  {
    icon: Sparkles,
    title: "Instant Preview",
    description: "See real-time updates as you adjust style, layout, and ornaments. What you see is what you get.",
  },
  {
    icon: Download,
    title: "Export Ready",
    description:
      "Download in SVG, PNG, and PDF formats with print-safe color profiles. Transparent backgrounds included.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need for Your Perfect Logo
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Professional-quality wedding logos with unlimited customization options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Vector quality guaranteed.</span> All logos are created as
            scalable vectors with unlimited resolution.
          </p>
        </div>
      </div>
    </section>
  )
}
