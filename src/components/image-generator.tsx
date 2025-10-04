'use client';

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  usePromptInputAttachments,
} from '@/components/ai-elements/prompt-input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { fileToDataUrl, scoreLogoImage } from '@/lib/image-utils';
import type {
  EditImageRequest,
  GeneratedImage,
  GenerateImageRequest,
  ImageResponse,
  ModelConfig,
  ModelOption,
  LogoOptions,
  LogoPreset,
} from '@/lib/types';
import { buildWeddingLogoPrompt } from '@/lib/utils';
import { ImageHistory } from './image-history';

declare global {
  interface Window {
    __promptInputActions?: {
      addFiles: (files: File[] | FileList) => void;
      clear: () => void;
    };
  }
}

/**
 * Available AI models for image generation
 * These models integrate with the Echo SDK to provide different image generation capabilities
 */
const models: ModelConfig[] = [
  { id: 'openai', name: 'GPT Image' },
  { id: 'gemini', name: 'Gemini Flash Image' },
];

/**
 * API functions for image generation and editing
 * These functions communicate with the Echo SDK backend routes
 */

// ===== API FUNCTIONS =====
async function generateImage(
  request: GenerateImageRequest
): Promise<ImageResponse> {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

async function editImage(request: EditImageRequest): Promise<ImageResponse> {
  const response = await fetch('/api/edit-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * Main ImageGenerator component
 *
 * This component demonstrates how to integrate Echo SDK with AI image generation:
 * - Uses PromptInput for unified input handling with attachments
 * - Supports both text-to-image generation and image editing
 * - Maintains history of all generated/edited images
 * - Provides seamless model switching between OpenAI and Gemini
 */
export default function ImageGenerator() {
  const [model, setModel] = useState<ModelOption>('gemini');
  const [weddingMode, setWeddingMode] = useState<boolean>(true);
  const [logoOptions, setLogoOptions] = useState<LogoOptions>({
    initials: '',
    names: '',
    date: '',
    location: '',
    style: 'minimal',
    motifs: [],
    colors: { primary: '#000000' },
    variants: { transparent: true, dark: true, square: true },
  });
  const [preset, setPreset] = useState<LogoPreset>('minimal-monogram');
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [count, setCount] = useState<number>(4);
  const [includeDate, setIncludeDate] = useState<boolean>(true);
  const [initialsError, setInitialsError] = useState<string | null>(null);
  const [imageHistory, setImageHistory] = useState<GeneratedImage[]>([]);
  const promptInputRef = useRef<HTMLFormElement>(null);

  // Handle adding files to the input from external triggers (like from image history)
  const handleAddToInput = useCallback((files: File[]) => {
    const actions = window.__promptInputActions;
    if (actions) {
      actions.addFiles(files);
    }
  }, []);

  const clearForm = useCallback(() => {
    promptInputRef.current?.reset();
    const actions = window.__promptInputActions;
    if (actions) {
      actions.clear();
    }
  }, []);

  // Component to bridge PromptInput context with external file operations
  function FileInputManager() {
    const attachments = usePromptInputAttachments();

    // Store reference to attachment actions for external use
    useEffect(() => {
      window.__promptInputActions = {
        addFiles: attachments.add,
        clear: attachments.clear,
      };

      return () => {
        delete window.__promptInputActions;
      };
    }, [attachments]);

    return null;
  }

  // Validate initials and smart defaults
  useEffect(() => {
    const init = logoOptions.initials.trim();
    if (!init) {
      setInitialsError('Initials are required');
      return;
    }
    if (init.replace(/[^A-Za-z&]/g, '').length < 1 || init.length > 12) {
      setInitialsError('Use 1–6 letters, you may include “&”');
      return;
    }
    setInitialsError(null);
  }, [logoOptions.initials]);

  const normalizedLogoOptions: LogoOptions = {
    ...logoOptions,
    date: includeDate ? logoOptions.date : '',
  };

  const previewPrompt = weddingMode
    ? buildWeddingLogoPrompt({
        ...normalizedLogoOptions,
        preset,
        seed,
      })
    : (undefined as unknown as string);

  /**
   * Handles form submission for both image generation and editing
   * - Text-only: generates new image using selected model
   * - Text + attachments: edits uploaded images using Gemini
   */
  const handleSubmit = useCallback(
    async (message: PromptInputMessage) => {
      const hasText = Boolean(message.text?.trim());
      const hasAttachments = Boolean(message.files?.length);

      // Require either text prompt or attachments
      if (!(hasText || hasAttachments)) {
        return;
      }

      const isEdit = hasAttachments;
      const effectiveLogoOptions = {
        ...logoOptions,
        date: includeDate ? logoOptions.date : undefined,
      };
      const prompt = weddingMode
        ? buildWeddingLogoPrompt({ ...effectiveLogoOptions, preset, seed })
        : message.text?.trim() || '';

      // Generate unique ID for this request
      const imageId = `img_${Date.now()}`;

      // Convert attachment blob URLs to permanent data URLs for persistent display
      const attachmentDataUrls =
        message.files && message.files.length > 0
          ? await Promise.all(
              message.files
                .filter(f => f.mediaType?.startsWith('image/'))
                .map(async f => {
                  try {
                    const response = await fetch(f.url);
                    const blob = await response.blob();
                    return await fileToDataUrl(
                      new File([blob], f.filename || 'image', {
                        type: f.mediaType,
                      })
                    );
                  } catch (error) {
                    console.error(
                      'Failed to convert attachment to data URL:',
                      error
                    );
                    return f.url; // fallback
                  }
                })
            )
          : undefined;

      // Multi-candidate support
      const numCandidates = Math.max(1, Math.min(8, count));
      const baseSeed = typeof seed === 'number' && !Number.isNaN(seed) ? seed : Math.floor(Math.random() * 1_000_000_000);
      const candidateIds = Array.from({ length: numCandidates }, (_, i) => `${imageId}_${i + 1}`);

      // Create placeholders for each candidate
      const placeholders: GeneratedImage[] = candidateIds.map((cid, idx) => ({
        id: cid,
        prompt,
        model: model,
        timestamp: new Date(),
        attachments: attachmentDataUrls,
        isEdit,
        isLoading: true,
        seed: baseSeed + idx,
      }));
      setImageHistory(prev => [...placeholders, ...prev]);

      try {
        let imageUrl: ImageResponse['imageUrl'];

        if (isEdit) {
          const imageFiles =
            message.files?.filter(
              file =>
                file.mediaType?.startsWith('image/') || file.type === 'file'
            ) || [];

          if (imageFiles.length === 0) {
            throw new Error('No image files found in attachments');
          }

          try {
            const imageUrls = await Promise.all(
              imageFiles.map(async imageFile => {
                // Convert blob URL to data URL for API
                const response = await fetch(imageFile.url);
                const blob = await response.blob();
                return await fileToDataUrl(
                  new File([blob], 'image', { type: imageFile.mediaType })
                );
              })
            );

            const result = await editImage({
              prompt,
              imageUrls,
              provider: model,
            });
            imageUrl = result.imageUrl;
          } catch (error) {
            console.error('Error processing image files:', error);
            throw error;
          }
        } else {
          // Generate all candidates in parallel
          const results = await Promise.all(
            candidateIds.map(async (cid, idx) => {
              const candidateSeed = baseSeed + idx;
              const result = await generateImage({
                prompt,
                model,
                ...(weddingMode
                  ? {
                      mode: 'wedding-logo' as const,
                      logoOptions: effectiveLogoOptions,
                      preset,
                      seed: candidateSeed,
                    }
                  : {}),
              } as GenerateImageRequest & { mode?: 'wedding-logo'; logoOptions?: LogoOptions; seed?: number; preset?: LogoPreset });

              // Score image for auto-ranking
              let score = 0;
              try {
                score = await scoreLogoImage(result.imageUrl);
              } catch {}
              return { cid, imageUrl: result.imageUrl, score } as const;
            })
          );

          // Update placeholders with results
          setImageHistory(prev => {
            const updated = prev.map(img => {
              const r = results.find(res => res.cid === img.id);
              if (!r) return img;
              return { ...img, imageUrl: r.imageUrl, isLoading: false, score: r.score };
            });
            // Auto-rank this batch to the top by score
            const batchSet = new Set(candidateIds);
            const batch = updated.filter(i => batchSet.has(i.id)).sort((a, b) => (b.score || 0) - (a.score || 0));
            const others = updated.filter(i => !batchSet.has(i.id));
            return [...batch, ...others];
          });
        }
      } catch (error) {
        console.error(
          `Error ${isEdit ? 'editing' : 'generating'} image:`,
          error
        );

        // Update all placeholders with error state
        setImageHistory(prev =>
          prev.map(img =>
            img.id.startsWith(imageId)
              ? {
                  ...img,
                  isLoading: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : 'Failed to generate image',
                }
              : img
          )
        );
      }
    },
    [model, weddingMode, logoOptions, includeDate, preset, seed, count]
  );

  return (
    <div className="space-y-6">
      <PromptInput
        ref={promptInputRef}
        onSubmit={handleSubmit}
        className="relative"
        globalDrop
        multiple
        accept="image/*"
      >
        {/* Wedding logo controls */}
        <div className="flex flex-col gap-3 p-3 border rounded-xl mb-3 bg-white/70 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Wedding Logo Mode</label>
            <input
              type="checkbox"
              checked={weddingMode}
              onChange={e => setWeddingMode(e.target.checked)}
            />
          </div>
          {weddingMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                placeholder="Initials (e.g., A&B)"
                value={logoOptions.initials}
                onChange={e => setLogoOptions(o => ({ ...o, initials: e.target.value }))}
                onBlur={e => {
                  const v = e.target.value.trim();
                  if (/^[A-Za-z]{2}$/.test(v)) {
                    setLogoOptions(o => ({ ...o, initials: `${v[0].toUpperCase()} & ${v[1].toUpperCase()}` }));
                  }
                }}
                className="border rounded px-2 py-2"
              />
              {initialsError && (
                <div className="text-xs text-red-600 sm:col-span-2">{initialsError}</div>
              )}
              <input
                placeholder="Names (optional)"
                value={logoOptions.names || ''}
                onChange={e => setLogoOptions(o => ({ ...o, names: e.target.value }))}
                className="border rounded px-2 py-2"
              />
              <input
                placeholder="Date (optional)"
                value={logoOptions.date || ''}
                onChange={e => setLogoOptions(o => ({ ...o, date: e.target.value }))}
                className="border rounded px-2 py-2"
              />
              <input
                placeholder="Location (optional)"
                value={logoOptions.location || ''}
                onChange={e => setLogoOptions(o => ({ ...o, location: e.target.value }))}
                className="border rounded px-2 py-2"
              />
              <select
                value={logoOptions.style}
                onChange={e => setLogoOptions(o => ({ ...o, style: e.target.value as LogoOptions['style'] }))}
                className="border rounded px-2 py-2"
              >
                <option value="minimal">Minimal</option>
                <option value="modern">Modern</option>
                <option value="ornate">Ornate</option>
                <option value="vintage">Vintage</option>
              </select>
              <input
                placeholder="Motifs (comma separated: rings, florals)"
                value={logoOptions.motifs?.join(', ') || ''}
                onChange={e => setLogoOptions(o => ({ ...o, motifs: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                className="border rounded px-2 py-2"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm">Primary</span>
                <input
                  type="color"
                  value={logoOptions.colors?.primary || '#000000'}
                  onChange={e => setLogoOptions(o => ({ ...o, colors: { ...o.colors, primary: e.target.value } }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Accent</span>
                <input
                  type="color"
                  value={logoOptions.colors?.accent || '#ffffff'}
                  onChange={e => setLogoOptions(o => ({ ...o, colors: { ...o.colors, accent: e.target.value } }))}
                />
              </div>
              {/* Presets */}
              <div className="sm:col-span-2 flex flex-wrap gap-2">
                {(
                  [
                    { id: 'minimal-monogram', label: 'Minimal Monogram', style: 'minimal' },
                    { id: 'crest-florals', label: 'Crest + Florals', style: 'ornate' },
                    { id: 'art-deco', label: 'Art Deco', style: 'modern' },
                    { id: 'modern-serif', label: 'Modern Serif', style: 'modern' },
                  ] as Array<{ id: LogoPreset; label: string; style: LogoOptions['style'] }>
                ).map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPreset(p.id);
                      setLogoOptions(o => ({ ...o, style: p.style }));
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm border ${preset === p.id ? 'bg-gray-900 text-white' : 'bg-white hover:bg-gray-50'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Variants & Controls */}
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={logoOptions.variants?.square ?? true}
                    onChange={e => setLogoOptions(o => ({ ...o, variants: { ...o.variants, square: e.target.checked } }))}
                  />
                  Square
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={logoOptions.variants?.wide ?? false}
                    onChange={e => setLogoOptions(o => ({ ...o, variants: { ...o.variants, wide: e.target.checked } }))}
                  />
                  Wide
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={logoOptions.variants?.dark ?? true}
                    onChange={e => setLogoOptions(o => ({ ...o, variants: { ...o.variants, dark: e.target.checked } }))}
                  />
                  Light/Dark variants
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeDate}
                    onChange={e => setIncludeDate(e.target.checked)}
                  />
                  Include date
                </label>
              </div>

              {/* Generation Controls */}
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Count</span>
                  <select
                    value={count}
                    onChange={e => setCount(parseInt(e.target.value))}
                    className="border rounded px-2 py-2"
                  >
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Seed</span>
                  <input
                    type="number"
                    value={typeof seed === 'number' ? seed : ''}
                    onChange={e => setSeed(e.target.value === '' ? undefined : Number(e.target.value))}
                    className="border rounded px-2 py-2 w-full"
                    placeholder="random"
                  />
                  <button
                    type="button"
                    className="px-2 py-1.5 border rounded"
                    onClick={() => setSeed(Math.floor(Math.random() * 1_000_000_000))}
                  >
                    Random
                  </button>
                </div>
              </div>

              {/* Palette Helpers and Invert Preview */}
              <div className="sm:col-span-2 flex items-center gap-3 flex-wrap">
                {['#000000','#FFFFFF','#C9A227','#0F172A','#2563EB','#16A34A'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setLogoOptions(o => ({ ...o, colors: { ...o.colors, primary: c } }))}
                    className="h-6 w-6 rounded-full border"
                    style={{ backgroundColor: c }}
                    aria-label={`Set primary ${c}`}
                  />
                ))}
                <div className="ml-auto flex items-center gap-2">
                  <div className="px-2 py-1 rounded border" style={{ background: '#ffffff', color: logoOptions.colors?.primary || '#000000' }}>Aa</div>
                  <div className="px-2 py-1 rounded border" style={{ background: '#000000', color: logoOptions.colors?.primary || '#ffffff' }}>Aa</div>
                </div>
              </div>

              {/* Live Prompt Preview */}
              <div className="sm:col-span-2">
                <div className="text-xs font-medium text-gray-600 mb-1">Live prompt</div>
                <div className="text-xs p-3 rounded-lg border bg-gray-50 max-h-24 overflow-auto">{previewPrompt}</div>
              </div>
            </div>
          )}
        </div>
        <FileInputManager />
        <PromptInputBody>
          <PromptInputAttachments>
            {attachment => <PromptInputAttachment data={attachment} />}
          </PromptInputAttachments>
          <PromptInputTextarea placeholder="Describe the image you want to generate, or attach an image and describe how to edit it..." />
        </PromptInputBody>
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <PromptInputModelSelect
              onValueChange={value => {
                setModel(value as ModelOption);
              }}
              value={model}
            >
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {models.map(model => (
                  <PromptInputModelSelectItem key={model.id} value={model.id}>
                    {model.name}
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
          </PromptInputTools>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearForm}
              className="h-9 w-9 p-0"
            >
              <X size={16} />
            </Button>
            <PromptInputSubmit />
          </div>
        </PromptInputToolbar>
      </PromptInput>

      <ImageHistory
        imageHistory={imageHistory}
        onAddToInput={handleAddToInput}
      />
    </div>
  );
}
