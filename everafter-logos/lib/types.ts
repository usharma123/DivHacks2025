export type ModelOption = 'openai' | 'gemini'

export interface ModelConfig {
  id: ModelOption
  name: string
}

export interface GeneratedImage {
  id: string
  imageUrl?: string
  prompt: string
  model?: ModelOption
  timestamp: Date
  attachments?: string[]
  isEdit: boolean
  isLoading?: boolean
  error?: string
  logoMeta?: {
    initials: string
    names?: string
    date?: string
    location?: string
    style: 'minimal' | 'modern' | 'ornate' | 'vintage'
    motifs: string[]
    colors: { primary: string; accent?: string }
  }
  seed?: number
  score?: number
  variant?: 'square' | 'wide'
  tone?: 'light' | 'dark'
}

export interface GenerateImageRequest {
  prompt: string
  model: ModelOption
  mode?: 'wedding-logo'
  logoOptions?: LogoOptions
  count?: number
  seed?: number
  preset?: LogoPreset
}

export interface EditImageRequest {
  prompt: string
  imageUrls: string[]
  provider: ModelOption
}

export interface ImageResponse {
  imageUrl: string
}

export interface ErrorResponse {
  error: string
}

export interface ImageActionHandlers {
  onAddToInput: (files: File[]) => void
  onImageClick?: (image: GeneratedImage) => void
}

export interface LogoOptions {
  initials: string
  names?: string
  date?: string
  location?: string
  style: 'minimal' | 'modern' | 'ornate' | 'vintage'
  motifs?: string[]
  colors?: { primary?: string; accent?: string }
  variants?: { transparent?: boolean; dark?: boolean; square?: boolean; wide?: boolean }
}

export type LogoPreset = 'minimal-monogram' | 'crest-florals' | 'art-deco' | 'modern-serif'


