/**
 * Minimal Image Utilities
 *
 * Simple, clean API with just data URLs. No complex conversions.
 */

/**
 * Converts a File to a data URL
 */
export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a data URL to a File object
 */
export function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
  const bytes = atob(base64);
  const array = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; i++) {
    array[i] = bytes.charCodeAt(i);
  }

  return new File([array], filename, { type: mime });
}

/**
 * Downloads an image from a data URL
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copies an image to the clipboard from a data URL
 */
export async function copyDataUrlToClipboard(dataUrl: string): Promise<void> {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
  const bytes = atob(base64);
  const array = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; i++) {
    array[i] = bytes.charCodeAt(i);
  }

  const blob = new Blob([array], { type: mime });
  await navigator.clipboard.write([new ClipboardItem({ [mime]: blob })]);
}

/**
 * Generates a filename for an image
 */
export function generateFilename(imageId: string): string {
  return `generated-image-${imageId}.png`;
}

/**
 * Extracts media type from a data URL
 */
export function getMediaTypeFromDataUrl(dataUrl: string): string {
  if (!dataUrl.startsWith('data:')) return 'image/jpeg';
  return dataUrl.match(/^data:([^;]+);base64,/)?.[1] || 'image/jpeg';
}

/**
 * Heuristic image scoring for logos (0..1):
 * - favors high contrast, central mass, limited colors
 * This is a lightweight approximation and fast enough client-side.
 */
export async function scoreLogoImage(dataUrl: string): Promise<number> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(0.5);

      const size = 128;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const { data } = ctx.getImageData(0, 0, size, size);

      let contrastSum = 0;
      let colorVarSum = 0;
      let centerMass = 0;

      const center = size / 2;
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          // simple neighboring contrast (x-1)
          if (x > 0) {
            const j = (y * size + (x - 1)) * 4;
            const r2 = data[j];
            const g2 = data[j + 1];
            const b2 = data[j + 2];
            const luma2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
            contrastSum += Math.abs(luma - luma2);
          }

          // color variance proxy
          const mean = (r + g + b) / 3;
          colorVarSum += Math.abs(r - mean) + Math.abs(g - mean) + Math.abs(b - mean);

          // center mass weighting
          const dx = x - center;
          const dy = y - center;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const weight = 1 - Math.min(dist / center, 1);
          centerMass += weight * (255 - Math.min(255, Math.max(0, luma)));
        }
      }

      const pixels = size * size;
      const contrastScore = contrastSum / (pixels * 255);
      const colorSimplicity = 1 - Math.min(1, colorVarSum / (pixels * 255 * 3));
      const centrality = centerMass / (pixels * 255);

      // Weighted sum
      const score = Math.max(0, Math.min(1, 0.45 * contrastScore + 0.35 * centrality + 0.20 * colorSimplicity));
      resolve(score);
    };
    img.onerror = () => resolve(0.5);
    img.src = dataUrl;
  });
}
