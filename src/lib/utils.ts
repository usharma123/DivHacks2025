import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Build a highly constrained prompt for wedding logo generation.
 * Emphasizes monogram-focused, vector-like, high-contrast logo outputs.
 */
export function buildWeddingLogoPrompt({
  initials,
  names,
  date,
  location,
  style,
  motifs = [],
  colors,
  variants,
  preset,
  seed,
}: {
  initials: string;
  names?: string;
  date?: string;
  location?: string;
  style: 'minimal' | 'modern' | 'ornate' | 'vintage';
  motifs?: string[];
  colors?: { primary?: string; accent?: string };
  variants?: { transparent?: boolean; dark?: boolean; square?: boolean; wide?: boolean };
  preset?: 'minimal-monogram' | 'crest-florals' | 'art-deco' | 'modern-serif';
  seed?: number;
}): string {
  const trimmedInitials = initials.trim().toUpperCase();
  const parts: string[] = [];

  parts.push(
    `Design a wedding logo (monogram) for ${names ? names : 'a couple'} with initials ${trimmedInitials}.`
  );

  if (date) parts.push(`Include the date: ${date}.`);
  if (location) parts.push(`Location context: ${location}.`);

  parts.push(
    `Style: ${style}. Focus on elegant typography and clear symbol integration.`
  );

  if (preset === 'minimal-monogram') {
    parts.push('Preset: minimal monogram, single-weight strokes, negative space, no ornaments.');
  } else if (preset === 'crest-florals') {
    parts.push('Preset: crest with subtle florals, balanced wreath-like framing, restrained detailing.');
  } else if (preset === 'art-deco') {
    parts.push('Preset: art deco geometry, symmetrical forms, clean lines, limited ornament.');
  } else if (preset === 'modern-serif') {
    parts.push('Preset: modern serif typography, refined contrast, elegant curves.');
  }

  if (typeof seed === 'number' && !Number.isNaN(seed)) {
    parts.push(`Use a consistent seed for reproducibility: ${seed}.`);
  }

  if (motifs.length > 0) {
    parts.push(`Incorporate subtle motifs: ${motifs.join(', ')} (tasteful, not busy).`);
  }

  if (colors?.primary || colors?.accent) {
    const primary = colors?.primary ? `primary ${colors.primary}` : 'a single-color palette';
    const accent = colors?.accent ? `with optional accent ${colors.accent}` : '';
    parts.push(`Color palette: ${primary} ${accent}.`);
  } else {
    parts.push('Use a single-color palette suitable for inversion (black or white).');
  }

  parts.push(
    'Constraints: vector-like, flat design, high contrast, crisp edges, centered composition, no photorealism, no backgrounds or scenes, no drop shadows, avoid busy details.'
  );
  parts.push(
    'Background: plain white or transparent. If transparency unsupported, ensure pure white background and clean edges for easy background removal.'
  );
  parts.push(
    'Deliver a logo-style image with the monogram as the primary focal point and optional minimal motif embellishments.'
  );

  if (variants?.dark) {
    parts.push('Also suitable for white-on-black inversion.');
  }

  return parts.join(' ');
}
