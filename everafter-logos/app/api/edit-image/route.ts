import { EditImageRequest, validateEditImageRequest } from './validation'
import { handleGoogleEdit } from './google'
import { handleOpenAIEdit } from './openai'

const providers = {
  openai: handleOpenAIEdit,
  gemini: handleGoogleEdit,
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validation = validateEditImageRequest(body)
    if (!validation.isValid) {
      return Response.json(
        { error: validation.error!.message },
        { status: validation.error!.status }
      )
    }

    const { prompt, imageUrls, provider } = body as EditImageRequest
    const handler = providers[provider as keyof typeof providers]
    if (!handler) {
      return Response.json(
        { error: `Unsupported provider: ${String(provider)}` },
        { status: 400 }
      )
    }

    return handler(prompt, imageUrls)
  } catch (error) {
    console.error('Image editing error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Image editing failed. Please try again later.' },
      { status: 500 }
    )
  }
}


