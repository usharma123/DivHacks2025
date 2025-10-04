import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah & Michael",
    initials: "SM",
    quote:
      "EverAfter Logos made creating our wedding monogram so easy! We had our design ready in under 10 minutes, and it looked absolutely stunning on our invitations.",
    rating: 5,
  },
  {
    name: "Emily & David",
    initials: "ED",
    quote:
      "The print quality was exceptional. Our printer was impressed with the file formats, and the logo looked perfect on everything from napkins to our welcome sign.",
    rating: 5,
  },
  {
    name: "Jessica & Ryan",
    initials: "JR",
    quote:
      "We saved so much time and money compared to hiring a designer. The templates were beautiful, and customizing them was incredibly intuitive.",
    rating: 5,
  },
  {
    name: "Amanda & Chris",
    initials: "AC",
    quote:
      "I loved being able to see changes in real-time. We tried dozens of variations until we found the perfect one. Highly recommend!",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Loved by Couples Everywhere
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of happy couples who created their perfect wedding logo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-6 text-pretty">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
