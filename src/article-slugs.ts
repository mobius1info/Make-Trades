export interface ArticleSlugSource {
  id?: string | null;
  slug?: string | null;
  legacy_slug?: string | null;
  canonical_slug?: string | null;
  title?: string | null;
  language?: string | null;
}

const TECHNICAL_SLUG_PATTERNS = [
  /^(?:post|article|blog|news|entry|page)-\d+(?:-(?:ru|en|de|uk|zh))?$/i,
  /^(?:draft|temp|test|untitled)(?:-\d+)?$/i,
  /^new-(?:post|article)(?:-\d+)?$/i,
];

const GERMAN_CHAR_REPLACEMENTS: Record<string, string> = {
  'ä': 'ae',
  'ö': 'oe',
  'ü': 'ue',
  'ß': 'ss',
};

const CYRILLIC_TO_LATIN: Record<string, string> = {
  'а': 'a',
  'б': 'b',
  'в': 'v',
  'г': 'g',
  'ґ': 'g',
  'д': 'd',
  'е': 'e',
  'ё': 'e',
  'є': 'ye',
  'ж': 'zh',
  'з': 'z',
  'и': 'i',
  'і': 'i',
  'ї': 'yi',
  'й': 'y',
  'к': 'k',
  'л': 'l',
  'м': 'm',
  'н': 'n',
  'о': 'o',
  'п': 'p',
  'р': 'r',
  'с': 's',
  'т': 't',
  'у': 'u',
  'ф': 'f',
  'х': 'h',
  'ц': 'ts',
  'ч': 'ch',
  'ш': 'sh',
  'щ': 'shch',
  'ы': 'y',
  'э': 'e',
  'ю': 'yu',
  'я': 'ya',
  'ъ': '',
  'ь': '',
};

function hashString(value: string): number {
  let hash = 0;

  for (const char of value) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }

  return Math.abs(hash);
}

function stableSlugSuffix(source: ArticleSlugSource): string {
  const seed = String(source.id || source.slug || source.title || 'post');
  return hashString(seed).toString(36).slice(0, 6) || 'post';
}

function truncateSlug(slug: string, maxLength: number = 80): string {
  if (slug.length <= maxLength) {
    return slug;
  }

  const parts = slug.split('-').filter(Boolean);
  let result = '';

  for (const part of parts) {
    const next = result ? `${result}-${part}` : part;
    if (next.length > maxLength) {
      break;
    }

    result = next;
  }

  if (result) {
    return result;
  }

  return slug.slice(0, maxLength).replace(/-+$/g, '');
}

function replaceLanguageSpecificChars(value: string, language?: string | null): string {
  const lowerCased = value.toLowerCase();

  if (language === 'de') {
    return Array.from(lowerCased, char => GERMAN_CHAR_REPLACEMENTS[char] ?? char).join('');
  }

  if (language === 'ru' || language === 'uk') {
    return Array.from(lowerCased, char => CYRILLIC_TO_LATIN[char] ?? char).join('');
  }

  return lowerCased;
}

export function isTechnicalArticleSlug(slug: string | null | undefined): boolean {
  const normalized = String(slug || '').trim();

  if (!normalized) {
    return true;
  }

  return TECHNICAL_SLUG_PATTERNS.some(pattern => pattern.test(normalized));
}

export function hasHumanReadableArticleSlug(slug: string | null | undefined): boolean {
  const normalized = String(slug || '').trim();

  if (!normalized || isTechnicalArticleSlug(normalized)) {
    return false;
  }

  return /[\p{Letter}\p{Number}]/u.test(normalized);
}

export function buildTitleBasedArticleSlug(source: ArticleSlugSource, maxLength: number = 80): string {
  const language = source.language || undefined;
  const titleSlug = replaceLanguageSpecificChars(String(source.title || ''), language)
    .normalize('NFKD')
    .replace(/\p{Mark}+/gu, '')
    .replace(/&/g, ' and ')
    .replace(/[%]+/g, ' percent ')
    .replace(/['’"`]+/g, '')
    .replace(/[/.+]+/g, ' ')
    .replace(/[^\p{Letter}\p{Number}\s-]+/gu, ' ')
    .replace(/[_\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const trimmedTitleSlug = truncateSlug(titleSlug, maxLength);
  if (trimmedTitleSlug) {
    return trimmedTitleSlug;
  }

  const readableLegacySlug = hasHumanReadableArticleSlug(source.slug) ? String(source.slug).trim() : '';
  if (readableLegacySlug) {
    return truncateSlug(readableLegacySlug, maxLength);
  }

  return `article-${stableSlugSuffix(source)}`;
}

export function resolvePublicArticleSlug(source: ArticleSlugSource): string {
  const explicitCanonicalSlug = String(source.canonical_slug || '').trim();
  if (explicitCanonicalSlug) {
    return explicitCanonicalSlug;
  }

  const currentSlug = String(source.slug || '').trim();
  if (hasHumanReadableArticleSlug(currentSlug)) {
    return currentSlug;
  }

  return buildTitleBasedArticleSlug(source);
}

export function resolveLegacyArticleSlug(source: ArticleSlugSource): string {
  const legacySlug = String(source.legacy_slug || source.slug || '').trim();
  if (legacySlug) {
    return legacySlug;
  }

  return resolvePublicArticleSlug(source);
}
