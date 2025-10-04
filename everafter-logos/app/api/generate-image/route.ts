import {
  GenerateImageRequest,
  validateGenerateImageRequest,
} from './validation'
import { buildWeddingLogoPrompt } from '@/lib/utils'
import { handleGoogleGenerate } from './google'
import { handleOpenAIGenerate } from './openai'

const providers = {
  openai: handleOpenAIGenerate,
  gemini: handleGoogleGenerate,
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validation = validateGenerateImageRequest(body)
    if (!validation.isValid) {
      return Response.json(
        { error: validation.error!.message },
        { status: validation.error!.status }
      )
    }

    const { prompt, model, mode, logoOptions, preset, seed } = body as GenerateImageRequest & {
      mode?: 'wedding-logo'
      logoOptions?: Parameters<typeof buildWeddingLogoPrompt>[0]
      preset?: 'minimal-monogram' | 'crest-florals' | 'art-deco' | 'modern-serif'
      seed?: number
    }

    const finalPrompt =
      mode === 'wedding-logo' && logoOptions
        ? buildWeddingLogoPrompt({ ...logoOptions, preset, seed })
        : prompt
    const handler = providers[model as keyof typeof providers]

    if (!handler) {
      return Response.json(
        { error: `Unsupported model: ${String(model)}` },
        { status: 400 }
      )
    }

    return handler(finalPrompt)
  } catch (error) {
    console.error('Image generation error:', error)

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Image generation failed. Please try again later.',
      },
      { status: 500 }
    )
  }
}


