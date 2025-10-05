"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useEcho } from "@merit-systems/echo-next-sdk/client"
import { useTheme } from "next-themes"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { signIn, isLoggedIn } = useEcho()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Top-left: Logo */}
          <Link href="/" className="flex items-center space-x-0.5">
            <Image src="/my-logo.svg" alt="EverAfter logo" width={80} height={80} priority />
            <span className="-ml-1.5 font-serif text-2xl md:text-3xl font-semibold text-primary">EverAfter</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Top-right: Theme toggle + Sign In ECHO */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
              <Button
                size="sm"
                className="bg-black text-white hover:bg-black/90"
                onClick={() => { if (!isLoggedIn) signIn() }}
              >
                <span className="inline-flex items-center gap-2">
                  {isLoggedIn && <span className="inline-block size-2 rounded-full bg-green-500" aria-hidden />}
                  {isLoggedIn ? 'Signed In' : 'Sign In ECHO'}
                </span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => { setIsMobileMenuOpen(false); setTheme(theme === 'dark' ? 'light' : 'dark') }}
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </Button>
                <Button
                  size="lg"
                  className="w-full font-medium bg-black text-white hover:bg-black/90"
                  onClick={() => { setIsMobileMenuOpen(false); if (!isLoggedIn) signIn() }}
                >
                  <span className="inline-flex items-center gap-2">
                    {isLoggedIn && <span className="inline-block size-2 rounded-full bg-green-500" aria-hidden />}
                    {isLoggedIn ? 'Signed In' : 'Sign In ECHO'}
                  </span>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
