import {
  resolveLegacyArticleSlug,
  resolvePublicArticleSlug,
  type ArticleSlugSource,
} from './article-slugs';

export const SUPPORTED_LANGUAGES = ['ru', 'en', 'de', 'uk', 'zh'] as const;
export const DEFAULT_LANGUAGE = 'ru' as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
type ArticleSlugInput = string | ArticleSlugSource;

const SITE_ORIGIN = 'https://maketrades.info';

export function isSupportedLanguage(lang: string | null | undefined): lang is SupportedLanguage {
  return !!lang && SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

export function normalizeLanguage(lang: string | null | undefined): SupportedLanguage {
  return isSupportedLanguage(lang) ? lang : DEFAULT_LANGUAGE;
}

function pathParts(pathname: string): string[] {
  return pathname.split('/').filter(Boolean).map(part => decodeURIComponent(part));
}

export function getHomeLanguageFromPath(pathname: string): SupportedLanguage | null {
  const parts = pathParts(pathname);
  return parts.length === 1 && isSupportedLanguage(parts[0]) ? parts[0] : null;
}

export function getBlogLanguageFromPath(pathname: string): SupportedLanguage | null {
  const parts = pathParts(pathname);
  return parts[0] === 'blog' && isSupportedLanguage(parts[1]) ? parts[1] : null;
}

export function getFaqLanguageFromPath(pathname: string): SupportedLanguage | null {
  const parts = pathParts(pathname);
  return parts[0] === 'faq' && isSupportedLanguage(parts[1]) ? parts[1] : null;
}

export function getArticleSlugFromPath(pathname: string): string | null {
  const parts = pathParts(pathname);
  return parts[0] === 'blog' && isSupportedLanguage(parts[1]) && parts[2] ? parts[2] : null;
}

function resolveArticleLanguage(article: ArticleSlugInput, language?: string): string {
  return normalizeLanguage(typeof article === 'string' ? language : article.language || language);
}

export function homePath(language: string): string {
  const resolvedLanguage = normalizeLanguage(language);
  return resolvedLanguage === DEFAULT_LANGUAGE ? '/' : `/${encodeURIComponent(resolvedLanguage)}/`;
}

function resolvePublicSlug(article: ArticleSlugInput, language?: string): string {
  if (typeof article === 'string') {
    return article;
  }

  return resolvePublicArticleSlug({ ...article, language: article.language || language || null });
}

function resolveLegacySlug(article: ArticleSlugInput, language?: string): string {
  if (typeof article === 'string') {
    return article;
  }

  return resolveLegacyArticleSlug({ ...article, language: article.language || language || null });
}

export function articlePath(article: ArticleSlugInput, language?: string): string {
  const slug = resolvePublicSlug(article, language);
  const resolvedLanguage = resolveArticleLanguage(article, language);
  return `/blog/${encodeURIComponent(resolvedLanguage)}/${encodeURIComponent(slug)}/`;
}

export function blogIndexPath(language: string): string {
  return `/blog/${encodeURIComponent(normalizeLanguage(language))}/`;
}

export function faqPath(language: string): string {
  return `/faq/${encodeURIComponent(normalizeLanguage(language))}/`;
}

export function legacyArticlePath(article: ArticleSlugInput, language?: string): string {
  const slug = resolveLegacySlug(article, language);
  const resolvedLanguage = resolveArticleLanguage(article, language);
  return `/blog-post.html?slug=${encodeURIComponent(slug)}&lang=${encodeURIComponent(resolvedLanguage)}`;
}

export function legacyBlogIndexPath(language: string): string {
  return `/blog.html?lang=${encodeURIComponent(normalizeLanguage(language))}`;
}

export function legacyFaqPath(language: string): string {
  return `/faq.html?lang=${encodeURIComponent(normalizeLanguage(language))}`;
}

export function isProductionBuild(): boolean {
  const env = (import.meta as ImportMeta & { env?: { PROD?: boolean } }).env;
  return Boolean(env?.PROD);
}

export function articleHref(article: ArticleSlugInput, language?: string): string {
  return isProductionBuild() ? articlePath(article, language) : legacyArticlePath(article, language);
}

export function homeHref(language: string): string {
  return homePath(language);
}

export function blogIndexHref(language: string): string {
  return isProductionBuild() ? blogIndexPath(language) : legacyBlogIndexPath(language);
}

export function faqHref(language: string): string {
  return isProductionBuild() ? faqPath(language) : legacyFaqPath(language);
}

export function articleAbsoluteUrl(article: ArticleSlugInput, language?: string): string {
  return `${SITE_ORIGIN}${articlePath(article, language)}`;
}

export function homeAbsoluteUrl(language: string): string {
  return `${SITE_ORIGIN}${homePath(language)}`;
}

export function blogIndexAbsoluteUrl(language: string): string {
  return `${SITE_ORIGIN}${blogIndexPath(language)}`;
}

export function faqAbsoluteUrl(language: string): string {
  return `${SITE_ORIGIN}${faqPath(language)}`;
}
