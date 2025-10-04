import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function CustomizationPreview() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Customize Every Detail
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">See your changes in real-time as you design</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Preview */}
            <Card className="border-border/50">
              <CardContent className="p-8">
                <div className="aspect-square bg-gradient-to-br from-background to-muted rounded-lg flex items-center justify-center border border-border">
                  <div className="text-center">
                    <div className="font-serif text-6xl md:text-7xl font-bold text-primary mb-4">J & A</div>
                    <div className="text-sm tracking-widest text-muted-foreground mb-2">JUNE 15, 2025</div>
                    <div className="text-xs text-muted-foreground">Napa Valley</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="space-y-6">
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="names" className="text-sm font-medium">
                      Couple Names / Initials
                    </Label>
                    <Input id="names" placeholder="John & Alice" className="mt-1.5" defaultValue="J & A" />
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium">
                      Wedding Date
                    </Label>
                    <Input id="date" type="date" className="mt-1.5" defaultValue="2025-06-15" />
                  </div>
                  <div>
                    <Label htmlFor="venue" className="text-sm font-medium">
                      Venue (Optional)
                    </Label>
                    <Input id="venue" placeholder="Napa Valley" className="mt-1.5" defaultValue="Napa Valley" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Style</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Minimalist", "Floral", "Crest", "Modern"].map((style) => (
                        <button
                          key={style}
                          className="px-4 py-2 text-sm border border-border rounded-md hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Color Palette</Label>
                    <div className="flex gap-2">
                      <button className="w-10 h-10 rounded-full bg-blush border-2 border-border hover:border-primary transition-colors" />
                      <button className="w-10 h-10 rounded-full bg-champagne border-2 border-border hover:border-primary transition-colors" />
                      <button className="w-10 h-10 rounded-full bg-sage border-2 border-border hover:border-primary transition-colors" />
                      <button className="w-10 h-10 rounded-full bg-primary border-2 border-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
