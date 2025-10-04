import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  const footerLinks = {
    Product: [
      { label: "Templates", href: "#gallery" },
      { label: "How It Works", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
    Company: [
      { label: "About Us", href: "#" },
      { label: "Contact", href: "#contact" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
    Legal: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "License Agreement", href: "#" },
      { label: "Refund Policy", href: "#" },
    ],
  }

  return (
    <footer id="contact" className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-semibold text-primary">EverAfter</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-sm">
              Create beautiful, personalized wedding logos in minutes. Perfect for invitations, signage, and all your
              special day details.
            </p>
            {/* Newsletter */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Stay inspired</p>
              <div className="flex gap-2">
                <Input type="email" placeholder="Enter your email" className="max-w-xs" />
                <Button variant="secondary">Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-medium text-foreground mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 EverAfter. All rights reserved.</p>
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href="#"
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </Link>
            <Link
              href="#"
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
