import generatedPostImageManifest from './generated-post-image-manifest.json';

const SITE_ORIGIN = 'https://maketrades.info';
const generatedPostImagesBySlug = new Set<string>(generatedPostImageManifest as string[]);
const POST_IMAGE_VARIANT_WIDTHS = [480, 768, 1280] as const;
const POST_IMAGE_BASE_WIDTH = 1280;
const POST_IMAGE_BASE_HEIGHT = 720;

export type PostImageKind = 'card' | 'hero' | 'content';

function hasGeneratedPostImage(seed: string | null | undefined): boolean {
  return generatedPostImagesBySlug.has(String(seed || '').trim());
}

function generatedPostImagePath(seed: string, width: number = POST_IMAGE_BASE_WIDTH): string {
  return width === POST_IMAGE_BASE_WIDTH ? `/assets/blog/${seed}.jpg` : `/assets/blog/${seed}-${width}.jpg`;
}

function generatedPostImageCandidates(seed: string): Array<{ src: string; width: number }> {
  if (!hasGeneratedPostImage(seed)) return [];

  return POST_IMAGE_VARIANT_WIDTHS.map(width => ({
    src: generatedPostImagePath(seed, width),
    width,
  }));
}

function imageKindFromElement(img: HTMLImageElement): PostImageKind {
  if (img.dataset.imageKind === 'content') return 'content';
  return img.dataset.imageKind === 'hero' ? 'hero' : 'card';
}

export function resolveGeneratedPostImage(seed: string | null | undefined): string {
  const normalizedSeed = String(seed || '').trim();
  if (!normalizedSeed) return '';

  return hasGeneratedPostImage(normalizedSeed) ? generatedPostImagePath(normalizedSeed) : '';
}

export function generatedPostImageSrcSet(seed: string | null | undefined): string {
  const normalizedSeed = String(seed || '').trim();
  if (!normalizedSeed) return '';

  return generatedPostImageCandidates(normalizedSeed)
    .map(({ src, width }) => `${src} ${width}w`)
    .join(', ');
}

export function generatedPostImageSizes(kind: PostImageKind): string {
  if (kind === 'hero') {
    return '(max-width: 767px) calc(100vw - 2rem), (max-width: 1279px) calc(100vw - 4rem), 1200px';
  }

  if (kind === 'content') {
    return '(max-width: 767px) calc(100vw - 2rem), 800px';
  }

  return '(max-width: 767px) calc(100vw - 2rem), (max-width: 1279px) calc((100vw - 6rem) / 2), 400px';
}

export function getPostImageAttributes(
  imageUrl: string | null | undefined,
  seed: string | null | undefined,
  kind: PostImageKind = 'card'
): {
  src: string;
  srcset?: string;
  sizes?: string;
  width: number;
  height: number;
} {
  const srcset = generatedPostImageSrcSet(seed);

  return {
    src: normalizePostImageUrl(imageUrl, seed || ''),
    srcset: srcset || undefined,
    sizes: srcset ? generatedPostImageSizes(kind) : undefined,
    width: POST_IMAGE_BASE_WIDTH,
    height: POST_IMAGE_BASE_HEIGHT,
  };
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
  const srcset = generatedPostImageSrcSet(seed);
  const sizes = generatedPostImageSizes('content');

  return String(html || '').replace(/(<img\b[^>]*\bsrc=["'])([^"']*)(["'][^>]*>)/gi, (_match, prefix, _src, suffix) => {
    let nextSuffix = suffix;

    if (seed && !/\sdata-post-slug=/i.test(nextSuffix)) {
      nextSuffix = nextSuffix.replace(/\s*\/?>$/, (match: string) => ` data-post-slug="${seed}" data-image-kind="content"${match}`);
    }

    if (srcset && !/\ssrcset=/i.test(nextSuffix)) {
      nextSuffix = nextSuffix.replace(
        /\s*\/?>$/,
        (match: string) =>
          ` srcset="${srcset}" sizes="${sizes}" width="${POST_IMAGE_BASE_WIDTH}" height="${POST_IMAGE_BASE_HEIGHT}"${match}`
      );
    }

    return `${prefix}${generatedImage}${nextSuffix}`;
  });
}

export function syncResolvedImageUrls(root: ParentNode = document): void {
  root.querySelectorAll<HTMLImageElement>('img[data-post-slug]').forEach(img => {
    const seed = img.dataset.postSlug || img.alt || img.id || '';
    const kind = imageKindFromElement(img);
    const image = getPostImageAttributes(img.getAttribute('src'), seed, kind);
    const currentSrc = img.getAttribute('src');

    if (image.src && currentSrc !== image.src) {
      img.src = image.src;
    }

    if (image.srcset && img.getAttribute('srcset') !== image.srcset) {
      img.setAttribute('srcset', image.srcset);
    } else if (!image.srcset && img.hasAttribute('srcset')) {
      img.removeAttribute('srcset');
    }

    if (image.sizes && img.getAttribute('sizes') !== image.sizes) {
      img.setAttribute('sizes', image.sizes);
    } else if (!image.sizes && img.hasAttribute('sizes')) {
      img.removeAttribute('sizes');
    }

    if (!img.getAttribute('width')) {
      img.setAttribute('width', String(image.width));
    }

    if (!img.getAttribute('height')) {
      img.setAttribute('height', String(image.height));
    }
  });
}
