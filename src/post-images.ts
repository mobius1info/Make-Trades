import generatedPostImageManifest from './generated-post-image-manifest.json';

const SITE_ORIGIN = 'https://maketrades.info';
const DEFAULT_POST_IMAGE_WIDTH = 1200;
const DEFAULT_POST_IMAGE_HEIGHT = 675;

export type PostImageKind = 'card' | 'hero' | 'content';

interface GeneratedPostImageEntry {
  src: string;
  width: number;
  height: number;
}

const generatedPostImages = generatedPostImageManifest as Record<string, GeneratedPostImageEntry>;

function getGeneratedPostImage(seed: string | null | undefined): GeneratedPostImageEntry | null {
  const normalizedSeed = String(seed || '').trim();
  if (!normalizedSeed) return null;

  return generatedPostImages[normalizedSeed] || null;
}

function imageKindFromElement(img: HTMLImageElement): PostImageKind {
  if (img.dataset.imageKind === 'content') return 'content';
  return img.dataset.imageKind === 'hero' ? 'hero' : 'card';
}

export function resolveGeneratedPostImage(seed: string | null | undefined): string {
  return getGeneratedPostImage(seed)?.src || '';
}

export function getPostImageAttributes(
  imageUrl: string | null | undefined,
  seed: string | null | undefined,
  _kind: PostImageKind = 'card'
): {
  src: string;
  srcset?: string;
  sizes?: string;
  width: number;
  height: number;
} {
  const generatedImage = getGeneratedPostImage(seed);
  if (generatedImage) {
    return {
      src: generatedImage.src,
      width: generatedImage.width,
      height: generatedImage.height,
    };
  }

  return {
    src: String(imageUrl || '').trim(),
    width: DEFAULT_POST_IMAGE_WIDTH,
    height: DEFAULT_POST_IMAGE_HEIGHT,
  };
}

export function normalizePostImageUrl(imageUrl: string | null | undefined, seed: string = ''): string {
  return resolveGeneratedPostImage(seed) || String(imageUrl || '').trim();
}

export function seoPostImageUrl(imageUrl: string | null | undefined, seed: string = ''): string {
  return normalizePostImageUrl(imageUrl, seed);
}

export function absoluteImageUrl(imageUrl: string): string {
  return imageUrl.startsWith('/') ? `${SITE_ORIGIN}${imageUrl}` : imageUrl;
}

export function sanitizeArticleHtmlImages(html: string, _seed: string = ''): string {
  return String(html || '')
    .replace(/<figure\b[^>]*>[\s\S]*?(?:<picture\b[^>]*>[\s\S]*?<\/picture>|<img\b[^>]*>)[\s\S]*?<\/figure>/gi, '')
    .replace(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi, '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<a\b[^>]*>\s*(?:&nbsp;|\s|<br\s*\/?>)*<\/a>/gi, '')
    .replace(/<(p|div)>\s*(?:&nbsp;|\s|<br\s*\/?>)*<\/\1>/gi, '')
    .trim();
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

    img.setAttribute('width', String(image.width));
    img.setAttribute('height', String(image.height));
  });
}
