import { Button } from "@/components/ui/button"
import { Shield, Zap, Download } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-gradient-to-br from-blush/20 via-champagne/20 to-sage/20 border border-border p-8 md:p-12 lg:p-16 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Make Your Day Uniquely Yours
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Create a beautiful wedding logo that reflects your love story. Start designing in minutes.
            </p>

            <Button size="lg" className="text-base px-8 py-6 h-auto font-medium mb-8">
              Create Your Logo
            </Button>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Instant Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
