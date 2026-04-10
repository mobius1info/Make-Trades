import postImageCatalog from './post-image-catalog.json';

const SITE_ORIGIN = 'https://maketrades.info';
const FALLBACK_POST_IMAGES = [
  '/assets/market-analysis.png',
  '/assets/hero-main.jpg',
  '/assets/detail-bots.jpg',
  '/assets/detail-portfolios.jpg',
  '/assets/detail-solution.jpg',
] as const;

interface PostImageCatalogEntry {
  asset: string;
  slugs: string[];
}

const generatedPostImagesBySlug = new Map<string, string>();

for (const entry of postImageCatalog as PostImageCatalogEntry[]) {
  for (const slug of entry.slugs) {
    generatedPostImagesBySlug.set(slug, entry.asset);
  }
}

function hashString(value: string): number {
  let hash = 0;
  for (const char of value) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }
  return Math.abs(hash);
}

export function resolveGeneratedPostImage(seed: string | null | undefined): string {
  const normalizedSeed = String(seed || '').trim();
  if (!normalizedSeed) return '';

  return generatedPostImagesBySlug.get(normalizedSeed) || '';
}

export function fallbackPostImage(seed: string | null | undefined = 'post'): string {
  const normalizedSeed = String(seed || 'post').trim() || 'post';
  const generatedImage = resolveGeneratedPostImage(normalizedSeed);

  if (generatedImage) return generatedImage;

  return FALLBACK_POST_IMAGES[hashString(normalizedSeed) % FALLBACK_POST_IMAGES.length];
}

export function normalizePostImageUrl(imageUrl: string | null | undefined, seed: string = ''): string {
  const normalizedImageUrl = String(imageUrl || '').trim();
  if (normalizedImageUrl) return normalizedImageUrl;

  return fallbackPostImage(seed);
}

export function seoPostImageUrl(imageUrl: string | null | undefined, seed: string = ''): string {
  const generatedImage = resolveGeneratedPostImage(seed);
  if (generatedImage) return generatedImage;

  return normalizePostImageUrl(imageUrl, seed);
}

export function absoluteImageUrl(imageUrl: string): string {
  return imageUrl.startsWith('/') ? `${SITE_ORIGIN}${imageUrl}` : imageUrl;
}

export function sanitizeArticleHtmlImages(html: string, seed: string = ''): string {
  return String(html || '').replace(/(<img\b[^>]*\bsrc=["'])([^"']*)(["'][^>]*>)/gi, (_match, prefix, src, suffix) => {
    const normalizedSrc = String(src || '').trim();
    return `${prefix}${normalizedSrc || fallbackPostImage(seed)}${suffix}`;
  });
}

export function syncResolvedImageUrls(root: ParentNode = document): void {
  root.querySelectorAll<HTMLImageElement>('img').forEach((img, index) => {
    const seed = img.dataset.postSlug || img.alt || img.id || `${index}`;
    const fallbackImage = img.dataset.fallbackImage || fallbackPostImage(seed);
    const currentSrc = img.getAttribute('src');
    const normalizedSrc = normalizePostImageUrl(currentSrc, seed);

    if (normalizedSrc && currentSrc !== normalizedSrc) {
      img.src = normalizedSrc;
    }

    img.dataset.fallbackImage = fallbackImage;

    if (img.dataset.fallbackBound !== 'true') {
      img.dataset.fallbackBound = 'true';
      img.addEventListener('error', () => {
        if (img.dataset.fallbackApplied === 'true') return;

        img.dataset.fallbackApplied = 'true';
        img.src = fallbackImage;
      });
    }

    if (currentSrc && img.complete && img.naturalWidth === 0) {
      img.dataset.fallbackApplied = 'true';
      img.src = fallbackImage;
    }
  });
}
