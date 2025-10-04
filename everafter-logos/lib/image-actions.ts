import { dataUrlToFile, downloadDataUrl, copyDataUrlToClipboard, generateFilename } from '@/lib/image-utils'
import type { GeneratedImage } from '@/lib/types'

export function handleImageDownload(imageUrl: string, imageId: string): void {
  const filename = generateFilename(imageId)
  downloadDataUrl(imageUrl, filename)
}

export async function handleImageCopy(imageUrl: string): Promise<void> {
  await copyDataUrlToClipboard(imageUrl)
}

export function handleImageToFile(imageUrl: string, imageId: string): File {
  const filename = generateFilename(imageId)
  return dataUrlToFile(imageUrl, filename)
}

export function isImageActionable(image: GeneratedImage): boolean {
  return !!image.imageUrl
}

export function getModelDisplayName(model?: string): string {
  const modelMap = { openai: 'GPT Image', gemini: 'Gemini Flash Image' }
  return modelMap[model as keyof typeof modelMap] || 'Unknown Model'
}


