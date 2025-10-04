"use client"

import { useCallback, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { buildWeddingLogoPrompt } from "@/lib/utils"
import { downloadDataUrl } from "@/lib/image-utils"
import type { GenerateImageRequest, ImageResponse } from "@/lib/types"
import { useEcho } from "@merit-systems/echo-next-sdk/client"

type StyleKey = "Minimalist" | "Floral" | "Crest" | "Modern"

const STYLE_TO_PROMPT: Record<StyleKey, { style: "minimal" | "modern" | "ornate" | "vintage"; motifs?: string[] }> = {
  Minimalist: { style: "minimal" },
  Floral: { style: "ornate", motifs: ["florals"] },
  Crest: { style: "ornate", motifs: ["crest"] },
  Modern: { style: "modern" },
}

const PALETTE = ["#000000", "#FFFFFF", "#C9A227", "#0F172A", "#2563EB", "#16A34A"]

export function CustomizationPreview() {
  const echo = useEcho()
  const [initials, setInitials] = useState("J & A")
  const [date, setDate] = useState("2025-06-15")
  const [venue, setVenue] = useState("Napa Valley")
  const [styleKey, setStyleKey] = useState<StyleKey>("Minimalist")
  const [primary, setPrimary] = useState("#000000")
  const [accent, setAccent] = useState<string>("")
  const [images, setImages] = useState<string[]>([])
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [improveText, setImproveText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const prompt = useMemo(() => {
    const map = STYLE_TO_PROMPT[styleKey]
    return buildWeddingLogoPrompt({
      initials,
      names: undefined,
      date,
      location: venue,
      style: map.style,
      motifs: map.motifs,
      colors: { primary, accent },
      variants: { dark: true, square: true },
      preset: styleKey === "Crest" ? "crest-florals" : styleKey === "Modern" ? "modern-serif" : "minimal-monogram",
    })
  }, [initials, date, venue, styleKey, primary, accent])

  const generate = useCallback(async () => {
    if (!echo.isLoggedIn) return
    if (!initials.trim()) return
    setIsLoading(true)
    setSelectedIdx(null)
    try {
      const baseSeed = Math.floor(Math.random() * 1_000_000_000)
      const tasks = Array.from({ length: 4 }, (_, i) =>
        fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            model: "gemini",
            mode: "wedding-logo",
            logoOptions: { initials, date, location: venue, style: STYLE_TO_PROMPT[styleKey].style, colors: { primary, accent } },
            seed: baseSeed + i,
          } satisfies GenerateImageRequest),
        }).then(async (r) => {
          if (!r.ok) throw new Error(await r.text())
          return (await r.json()) as ImageResponse
        })
      )
      const results = await Promise.all(tasks)
      setImages(results.map((r) => r.imageUrl))
    } catch (e) {
      console.error(e)
      setImages([])
    } finally {
      setIsLoading(false)
    }
  }, [echo.isLoggedIn, initials, date, venue, styleKey, primary, accent, prompt])

  const downloadPng = useCallback(() => {
    if (selectedIdx == null) return
    const url = images[selectedIdx]
    downloadDataUrl(url, `everafter-logo-${selectedIdx + 1}.png`)
  }, [images, selectedIdx])

  const downloadSvg = useCallback(async () => {
    if (selectedIdx == null) return
    const url = images[selectedIdx]
    try {
      const mod: any = await import("imagetracerjs")
      const ImageTracer = mod?.default || (globalThis as any).ImageTracer || mod
      await new Promise<void>((resolve, reject) => {
        ImageTracer.imageToSVG(url, (svg: string) => {
          try {
            const blob = new Blob([svg], { type: "image/svg+xml" })
            const a = document.createElement("a")
            a.href = URL.createObjectURL(blob)
            a.download = `everafter-logo-${selectedIdx + 1}.svg`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            resolve()
          } catch (err) {
            reject(err)
          }
        }, { ltres: 1, qtres: 1, pathomit: 1 })
      })
    } catch (e) {
      console.error("SVG vectorization failed; falling back to PNG.", e)
      downloadPng()
    }
  }, [images, selectedIdx, downloadPng])

  const improve = useCallback(async () => {
    if (selectedIdx == null || !improveText.trim()) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/edit-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: improveText.trim(), imageUrls: [images[selectedIdx]], provider: "gemini" }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = (await res.json()) as ImageResponse
      setImages((prev) => prev.map((img, i) => (i === selectedIdx ? data.imageUrl : img)))
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [images, selectedIdx, improveText])

  return (
    <section id="customization" className="py-20 md:py-32 bg-muted/30">
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
                    <div className="font-serif text-6xl md:text-7xl font-bold text-primary mb-4">{initials || 'A & B'}</div>
                    <div className="text-sm tracking-widest text-muted-foreground mb-2">{(date || '').toUpperCase()}</div>
                    <div className="text-xs text-muted-foreground">{venue}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="space-y-6">
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="names" className="text-sm font-medium">Couple Names / Initials</Label>
                    <Input id="names" placeholder="J & A" className="mt-1.5" value={initials} onChange={(e) => setInitials(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium">Wedding Date</Label>
                    <Input id="date" type="date" className="mt-1.5" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="venue" className="text-sm font-medium">Venue (Optional)</Label>
                    <Input id="venue" placeholder="Napa Valley" className="mt-1.5" value={venue} onChange={(e) => setVenue(e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Style</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["Minimalist", "Floral", "Crest", "Modern"] as StyleKey[]).map((s) => (
                        <button key={s} onClick={() => setStyleKey(s)} className={`px-4 py-2 text-sm border rounded-md transition-colors ${styleKey === s ? 'border-primary bg-primary/10' : 'border-border hover:border-primary hover:bg-primary/5'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Color Palette</Label>
                    <div className="flex gap-2 items-center flex-wrap">
                      {PALETTE.map((c) => (
                        <button key={c} onClick={() => setPrimary(c)} className={`w-9 h-9 rounded-full border ${primary === c ? 'border-primary ring-2 ring-primary/40' : 'border-border hover:border-primary'}`} style={{ backgroundColor: c }} aria-label={`Primary ${c}`} />
                      ))}
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-xs">Accent</span>
                        <input type="color" value={accent || '#ffffff'} onChange={(e) => setAccent(e.target.value)} className="w-9 h-9 rounded border" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <Button size="lg" onClick={generate} disabled={!echo.isLoggedIn || !initials.trim() || isLoading}>
                      {isLoading ? 'Generating…' : 'Generate 4 Logos'}
                    </Button>
                    {!echo.isLoggedIn && <span className="text-xs text-muted-foreground">Connect your account to generate</span>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Results grid */}
          {images.length > 0 && (
            <div className="mt-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((url, idx) => (
                  <button key={idx} onClick={() => setSelectedIdx(idx)} className={`relative aspect-square rounded-lg overflow-hidden border ${selectedIdx === idx ? 'border-primary ring-2 ring-primary/40' : 'border-border hover:border-primary'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Generated ${idx + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
              {selectedIdx != null && (
                <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                  <div className="flex gap-2">
                    <Button variant="turbo" onClick={downloadPng}>Download PNG</Button>
                    <Button variant="outline" onClick={downloadSvg}>Download SVG</Button>
                  </div>
                  <div className="flex-1 md:max-w-xl flex items-center gap-2">
                    <Input placeholder="Tell us how to improve this logo (e.g., add crest, thin lines)" value={improveText} onChange={(e) => setImproveText(e.target.value)} />
                    <Button onClick={improve} disabled={isLoading || !improveText.trim()}>Improve</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
