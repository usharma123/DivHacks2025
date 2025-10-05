import { ModelOption, type LogoOptions } from '@/lib/types'

export type { GenerateImageRequest } from '@/lib/types'

export interface ValidationResult {
  isValid: boolean
  error?: { message: string; status: number }
}

export function validateGenerateImageRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: { message: 'Invalid request body', status: 400 } }
  }

  const { prompt, model, mode, logoOptions } = body as Record<string, unknown>

  if (!prompt || typeof prompt !== 'string') {
    return { isValid: false, error: { message: 'Prompt is required', status: 400 } }
  }
  if (prompt.length < 3 || prompt.length > 1000) {
    return { isValid: false, error: { message: 'Prompt must be 3-1000 characters', status: 400 } }
  }

  const validModels: ModelOption[] = ['openai', 'gemini']
  if (!model || !validModels.includes(model as ModelOption)) {
    return {
      isValid: false,
      error: { message: `Model must be: ${validModels.join(', ')}`, status: 400 },
    }
  }

  if (mode && mode !== 'wedding-logo') {
    return { isValid: false, error: { message: 'Unsupported mode', status: 400 } }
  }

  if (mode === 'wedding-logo') {
    const l = logoOptions as LogoOptions | undefined
    if (!l) {
      return { isValid: false, error: { message: 'logoOptions required for wedding-logo mode', status: 400 } }
    }
    if (!l.initials || typeof l.initials !== 'string' || l.initials.trim().length < 1 || l.initials.trim().length > 6) {
      return { isValid: false, error: { message: 'initials (1-6 chars) required', status: 400 } }
    }
    const validStyles = ['minimal', 'modern', 'ornate', 'vintage']

    if (!l.style || !validStyles.includes(l.style)) {
      return { isValid: false, error: { message: `style must be one of: ${validStyles.join(', ')}`, status: 400 } }
    }
    if (l.colors) {
      const hex = /^#?[0-9A-Fa-f]{6}$/
      if (l.colors.primary && !hex.test(l.colors.primary)) {
        return { isValid: false, error: { message: 'colors.primary must be hex like #000000', status: 400 } }
      }
      if (l.colors.accent && !hex.test(l.colors.accent)) {
        return { isValid: false, error: { message: 'colors.accent must be hex like #FFFFFF', status: 400 } }
      }
    }
  }

  return { isValid: true }
}


