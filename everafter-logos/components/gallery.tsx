"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const templates = [
  {
    id: 1,
    name: "Classic Monogram",
    style: "Minimalist",
    preview: "M & K",
  },
  {
    id: 2,
    name: "Floral Wreath",
    style: "Romantic",
    preview: "S ❀ L",
  },
  {
    id: 3,
    name: "Elegant Crest",
    style: "Traditional",
    preview: "R & J",
  },
  {
    id: 4,
    name: "Modern Script",
    style: "Contemporary",
    preview: "A + E",
  },
  {
    id: 5,
    name: "Vintage Frame",
    style: "Classic",
    preview: "D & C",
  },
  {
    id: 6,
    name: "Botanical",
    style: "Natural",
    preview: "T ✿ M",
  },
]

export function Gallery() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="gallery" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Beautiful Templates to Start With
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Choose from our curated collection of wedding logo styles, then customize to make it uniquely yours
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="group cursor-pointer border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
              onMouseEnter={() => setHoveredId(template.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-blush/20 via-champagne/20 to-sage/20 flex items-center justify-center relative overflow-hidden">
                  <div className="font-serif text-5xl font-bold text-primary">{template.preview}</div>
                  {hoveredId === template.id && (
                    <div className="absolute inset-0 bg-primary/90 flex items-center justify-center animate-fade-in">
                      <Button variant="secondary" size="lg">
                        Use This Template
                      </Button>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.style}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
