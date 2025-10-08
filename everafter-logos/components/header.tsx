"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useEcho } from "@merit-systems/echo-next-sdk/client"
import { useTheme } from "next-themes"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const echo = useEcho()
  const { signIn, isLoggedIn } = echo
  const { theme, setTheme } = useTheme()

  // Prompt to sign in on first visit per tab session, only if not already signed in.
  const promptedOnceRef = useRef(false)
  useEffect(() => {
    if (promptedOnceRef.current) return
    promptedOnceRef.current = true
    const GUARD_KEY = 'ea_prompted_signin'
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(GUARD_KEY)) return

    ;(async () => {
      try {
        const data = await fetch('/api/auth-status', { credentials: 'include' })
          .then(r => (r.ok ? r.json() : { signedIn: false }))
          .catch(() => ({ signedIn: false }))
        if (!data?.signedIn && !isLoggedIn) {
          sessionStorage.setItem(GUARD_KEY, '1')
          signIn?.()
        }
      } catch {
        // ignore
      }
    })()
  }, [isLoggedIn, signIn])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('header')) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Lock body scroll and close on Escape when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = previousOverflow
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isMobileMenuOpen])

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
            <Image 
              src="/my-logo.svg" 
              alt="EverAfter logo" 
              width={60} 
              height={60} 
              className="md:w-20 md:h-20"
              priority 
            />
            <span className="-ml-1.5 font-serif text-xl md:text-2xl lg:text-3xl font-semibold text-primary">EverAfter</span>
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
                onClick={() => {
                  if (isLoggedIn) {
                    // Keep guard set so we DON'T auto-prompt immediately after sign-out
                    try { sessionStorage.setItem('ea_prompted_signin', '1') } catch {}
                    ;(echo as any)?.signOut?.()
                  } else {
                    signIn?.()
                  }
                }}
                aria-label={isLoggedIn ? 'Sign out' : 'Sign in'}
              >
                <span className="inline-flex items-center gap-2">
                  {isLoggedIn && <span className="inline-block size-2 rounded-full bg-green-500" aria-hidden />}
                  {isLoggedIn ? 'Sign Out' : 'Sign In ECHO'}
                </span>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 rounded-xl text-foreground hover:text-primary hover:bg-accent/10 transition-all duration-200 active:scale-95"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
            aria-haspopup="menu"
          >
            <div className="relative">
              {isMobileMenuOpen ? (
                <X size={24} className="animate-in rotate-in-90 duration-200" />
              ) : (
                <Menu size={24} className="animate-in rotate-in-90 duration-200" />
              )}
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-in fade-in duration-200" 
              onClick={() => setIsMobileMenuOpen(false)} 
              aria-hidden="true"
            />
            
            {/* Menu */}
            <div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
              className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-br from-background via-background/98 to-background/95 backdrop-blur-xl border-t border-border/50 shadow-2xl z-50 animate-in slide-in-from-top-2 fade-in duration-300 max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain rounded-b-2xl"
            >
              <div className="container mx-auto px-6 pt-6 pb-6 pb-[env(safe-area-inset-bottom)]">
                <nav role="navigation" aria-label="Mobile" className="flex flex-col space-y-6">
                  {/* Navigation Links */}
                  <div className="space-y-1">
                    {navLinks.map((link, index) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group flex items-center text-lg font-medium text-foreground hover:text-primary transition-all duration-200 py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/20 hover:to-accent/10 hover:shadow-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
                        </span>
                      </Link>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gradient-to-r from-transparent via-border to-transparent" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Settings
                      </span>
                    </div>
                  </div>

                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-accent/5 border border-accent/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {theme === 'dark' ? <Sun className="size-4 text-primary" /> : <Moon className="size-4 text-primary" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Theme</p>
                        <p className="text-xs text-muted-foreground">Switch between light and dark mode</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                      onClick={() => { setIsMobileMenuOpen(false); setTheme(theme === 'dark' ? 'light' : 'dark') }}
                      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                      {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                    </Button>
                  </div>

                  {/* Sign In Button (Sticky Footer) */}
                  <div className="sticky bottom-0 left-0 right-0 -mx-6 px-6 pt-4 pb-[calc(env(safe-area-inset-bottom)+16px)] bg-gradient-to-t from-background/95 via-background/60 to-transparent backdrop-blur-sm">
                    <Button
                      size="lg"
                      className="w-full font-semibold bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200 py-4 rounded-xl"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        if (isLoggedIn) {
                          // Keep guard set so we DON'T auto-prompt immediately after sign-out
                          try { sessionStorage.setItem('ea_prompted_signin', '1') } catch {}
                          ;(echo as any)?.signOut?.()
                        } else {
                          signIn?.()
                        }
                      }}
                      aria-label={isLoggedIn ? 'Sign out' : 'Sign in'}
                    >
                      <span className="inline-flex items-center gap-3">
                        {isLoggedIn && <span className="inline-block size-2 rounded-full bg-green-400 animate-pulse" aria-hidden />}
                        <span className="text-base">
                          {isLoggedIn ? 'Sign Out' : 'Sign In ECHO'}
                        </span>
                        {!isLoggedIn && <span className="text-xs opacity-80">→</span>}
                      </span>
                    </Button>
                  </div>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
