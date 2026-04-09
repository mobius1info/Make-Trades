const SITE_ORIGIN = 'https://maketrades.info';

const FALLBACK_POST_IMAGES = [
  '/assets/market-analysis.png',
  '/assets/hero-main.jpg',
  '/assets/detail-bots.jpg',
  '/assets/detail-portfolios.jpg',
  '/assets/detail-solution.jpg',
] as const;

const KNOWN_BROKEN_REMOTE_IMAGE_REPLACEMENTS: Array<[needle: string, replacement: string]> = [
  ['/photos/6801653/pexels-photo-6801653.jpeg', '/assets/market-analysis.png'],
  ['/photos/6801654/pexels-photo-6801654.jpeg', '/assets/hero-main.jpg'],
  ['/photos/6801655/pexels-photo-6801655.jpeg', '/assets/detail-bots.jpg'],
  ['/photos/6801656/pexels-photo-6801656.jpeg', '/assets/detail-portfolios.jpg'],
  ['/photos/6801657/pexels-photo-6801657.jpeg', '/assets/detail-solution.jpg'],
  ['/photos/6801658/pexels-photo-6801658.jpeg', '/assets/market-analysis.png'],
];

function hashString(value: string): number {
  let hash = 0;
  for (const char of value) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }
  return Math.abs(hash);
}

export function fallbackPostImage(seed: string = 'post'): string {
  return FALLBACK_POST_IMAGES[hashString(seed) % FALLBACK_POST_IMAGES.length];
}

export function normalizePostImageUrl(imageUrl: string | null | undefined, seed: string = 'post'): string {
  const trimmedUrl = String(imageUrl || '').trim();
  if (!trimmedUrl) return fallbackPostImage(seed);

  const comparableUrl = trimmedUrl.replace(/&amp;/g, '&');
  const replacement = KNOWN_BROKEN_REMOTE_IMAGE_REPLACEMENTS.find(([needle]) => comparableUrl.includes(needle))?.[1];

  return replacement || trimmedUrl;
}

export function absoluteImageUrl(imageUrl: string): string {
  return imageUrl.startsWith('/') ? `${SITE_ORIGIN}${imageUrl}` : imageUrl;
}

export function sanitizeArticleHtmlImages(html: string, seed: string = 'post'): string {
  return String(html || '').replace(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/gi, (_match, prefix, src, suffix) => {
    return `${prefix}${normalizePostImageUrl(src, seed)}${suffix}`;
  });
}

export function setupImageFallbacks(root: ParentNode = document): void {
  root.querySelectorAll<HTMLImageElement>('img').forEach((img, index) => {
    const seed = img.alt || img.id || img.className || `${index}`;
    const fallbackImage = img.dataset.fallbackImage || fallbackPostImage(seed);
    const currentSrc = img.getAttribute('src');
    const normalizedSrc = normalizePostImageUrl(currentSrc, seed);

    if (currentSrc && currentSrc !== normalizedSrc) {
      img.src = normalizedSrc;
    }

    img.dataset.fallbackImage = fallbackImage;
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied === 'true') return;

      img.dataset.fallbackApplied = 'true';
      img.src = fallbackImage;
    });

    if (currentSrc && img.complete && img.naturalWidth === 0) {
      img.dataset.fallbackApplied = 'true';
      img.src = fallbackImage;
    }
  });
}
