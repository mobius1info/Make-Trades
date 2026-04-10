import generatedPostImageManifest from './generated-post-image-manifest.json';

const SITE_ORIGIN = 'https://maketrades.info';
const generatedPostImagesBySlug = new Set<string>(generatedPostImageManifest as string[]);

export function resolveGeneratedPostImage(seed: string | null | undefined): string {
  const normalizedSeed = String(seed || '').trim();
  if (!normalizedSeed) return '';

  return generatedPostImagesBySlug.has(normalizedSeed) ? `/assets/blog/${normalizedSeed}.jpg` : '';
}

export function normalizePostImageUrl(imageUrl: string | null | undefined, seed: string = ''): string {
  const generatedImage = resolveGeneratedPostImage(seed);
  if (generatedImage) return generatedImage;

  return String(imageUrl || '').trim();
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
  const generatedImage = resolveGeneratedPostImage(seed);
  if (!generatedImage) return String(html || '');

  return String(html || '').replace(/(<img\b[^>]*\bsrc=["'])([^"']*)(["'][^>]*>)/gi, (_match, prefix, _src, suffix) => {
    let nextSuffix = suffix;

    if (seed && !/\sdata-post-slug=/i.test(nextSuffix)) {
      nextSuffix = nextSuffix.replace(/>/, ` data-post-slug="${seed}">`);
    }

    return `${prefix}${generatedImage}${nextSuffix}`;
  });
}

export function syncResolvedImageUrls(root: ParentNode = document): void {
  root.querySelectorAll<HTMLImageElement>('img[data-post-slug]').forEach(img => {
    const seed = img.dataset.postSlug || img.alt || img.id || '';
    const currentSrc = img.getAttribute('src');
    const normalizedSrc = resolveGeneratedPostImage(seed);

    if (normalizedSrc && currentSrc !== normalizedSrc) {
      img.src = normalizedSrc;
    }
  });
}
