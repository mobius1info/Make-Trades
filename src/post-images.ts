import postImageCatalog from './post-image-catalog.json';

const SITE_ORIGIN = 'https://maketrades.info';

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

export function resolveGeneratedPostImage(seed: string | null | undefined): string {
  const normalizedSeed = String(seed || '').trim();
  if (!normalizedSeed) return '';

  return generatedPostImagesBySlug.get(normalizedSeed) || '';
}

export function normalizePostImageUrl(imageUrl: string | null | undefined, seed: string = ''): string {
  const generatedImage = resolveGeneratedPostImage(seed);
  if (generatedImage) return generatedImage;

  return String(imageUrl || '').trim();
}

export function absoluteImageUrl(imageUrl: string): string {
  return imageUrl.startsWith('/') ? `${SITE_ORIGIN}${imageUrl}` : imageUrl;
}

export function sanitizeArticleHtmlImages(html: string, seed: string = ''): string {
  return String(html || '').replace(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/gi, (_match, prefix, src, suffix) => {
    const normalizedSrc = normalizePostImageUrl(src, seed);
    return `${prefix}${normalizedSrc || src}${suffix}`;
  });
}

export function syncResolvedImageUrls(root: ParentNode = document): void {
  root.querySelectorAll<HTMLImageElement>('img').forEach((img, index) => {
    const seed = img.dataset.postSlug || img.alt || img.id || `${index}`;
    const currentSrc = img.getAttribute('src');
    const normalizedSrc = normalizePostImageUrl(currentSrc, seed);

    if (normalizedSrc && currentSrc !== normalizedSrc) {
      img.src = normalizedSrc;
    }
  });
}
