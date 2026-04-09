export const SUPPORTED_LANGUAGES = ['ru', 'en', 'de', 'uk', 'zh'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const SITE_ORIGIN = 'https://maketrades.info';

export function isSupportedLanguage(lang: string | null | undefined): lang is SupportedLanguage {
  return !!lang && SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

function pathParts(pathname: string): string[] {
  return pathname.split('/').filter(Boolean).map(part => decodeURIComponent(part));
}

export function getBlogLanguageFromPath(pathname: string): string | null {
  const parts = pathParts(pathname);
  return parts[0] === 'blog' && isSupportedLanguage(parts[1]) ? parts[1] : null;
}

export function getFaqLanguageFromPath(pathname: string): string | null {
  const parts = pathParts(pathname);
  return parts[0] === 'faq' && isSupportedLanguage(parts[1]) ? parts[1] : null;
}

export function getArticleSlugFromPath(pathname: string): string | null {
  const parts = pathParts(pathname);
  return parts[0] === 'blog' && isSupportedLanguage(parts[1]) && parts[2] ? parts[2] : null;
}

export function articlePath(slug: string, language: string): string {
  return `/blog/${encodeURIComponent(language)}/${encodeURIComponent(slug)}/`;
}

export function blogIndexPath(language: string): string {
  return `/blog/${encodeURIComponent(language)}/`;
}

export function faqPath(language: string): string {
  return `/faq/${encodeURIComponent(language)}/`;
}

export function legacyArticlePath(slug: string, language: string): string {
  return `/blog-post.html?slug=${encodeURIComponent(slug)}&lang=${encodeURIComponent(language)}`;
}

export function legacyBlogIndexPath(language: string): string {
  return `/blog.html?lang=${encodeURIComponent(language)}`;
}

export function legacyFaqPath(language: string): string {
  return `/faq.html?lang=${encodeURIComponent(language)}`;
}

export function isProductionBuild(): boolean {
  const env = (import.meta as ImportMeta & { env?: { PROD?: boolean } }).env;
  return Boolean(env?.PROD);
}

export function articleHref(slug: string, language: string): string {
  return isProductionBuild() ? articlePath(slug, language) : legacyArticlePath(slug, language);
}

export function blogIndexHref(language: string): string {
  return isProductionBuild() ? blogIndexPath(language) : legacyBlogIndexPath(language);
}

export function faqHref(language: string): string {
  return isProductionBuild() ? faqPath(language) : legacyFaqPath(language);
}

export function articleAbsoluteUrl(slug: string, language: string): string {
  return `${SITE_ORIGIN}${articlePath(slug, language)}`;
}

export function blogIndexAbsoluteUrl(language: string): string {
  return `${SITE_ORIGIN}${blogIndexPath(language)}`;
}

export function faqAbsoluteUrl(language: string): string {
  return `${SITE_ORIGIN}${faqPath(language)}`;
}
