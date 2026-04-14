import groupsManifest from './blog-article-groups.json';

export const BLOG_GROUP_LANGUAGES = ['ru', 'en', 'de', 'uk', 'zh'] as const;
export type BlogGroupLanguage = (typeof BLOG_GROUP_LANGUAGES)[number];
export type BlogContentStatus = 'core' | 'merged' | 'archived';

interface GroupTranslationDefinition {
  primary: string;
  merge?: string[];
}

export interface BlogArticleGroupDefinition {
  key: string;
  label: string;
  focus: string;
  keepReason: string;
  translations: Record<BlogGroupLanguage, GroupTranslationDefinition>;
}

export interface BlogArticleState {
  article_group_key?: string;
  content_status: BlogContentStatus;
  indexable: boolean;
  primary_slug?: string;
  canonical_target_slug?: string;
  shared_image_seed?: string;
  listing_order?: number;
  alternates?: Array<{
    language: BlogGroupLanguage;
    slug: string;
  }>;
}

interface ManifestShape {
  coreOrder: string[];
  groups: BlogArticleGroupDefinition[];
}

export interface BlogArticleIdentity {
  slug?: string | null;
  language?: string | null;
}

const manifest = groupsManifest as ManifestShape;
const groupOrderByKey = new Map(manifest.coreOrder.map((key, index) => [key, index]));
const groupsByKey = new Map(manifest.groups.map(group => [group.key, group]));
type GroupMatch =
  | {
      group: BlogArticleGroupDefinition;
      translation: GroupTranslationDefinition;
      role: 'primary';
    }
  | {
      group: BlogArticleGroupDefinition;
      translation: GroupTranslationDefinition;
      role: 'merged';
    };

function isBlogGroupLanguage(language: string | null | undefined): language is BlogGroupLanguage {
  return BLOG_GROUP_LANGUAGES.includes((language || '') as BlogGroupLanguage);
}

function findGroupMatch(slug: string, language: BlogGroupLanguage): GroupMatch | null {
  for (const group of manifest.groups) {
    const translation = group.translations[language];
    if (!translation) continue;

    if (translation.primary === slug) {
      return { group, translation, role: 'primary' };
    }

    if (translation.merge?.includes(slug)) {
      return { group, translation, role: 'merged' };
    }
  }

  return null;
}

export function getBlogArticleGroup(key: string): BlogArticleGroupDefinition | null {
  return groupsByKey.get(key) || null;
}

function getSharedImageSeed(group: BlogArticleGroupDefinition): string {
  return group.key;
}

export function getBlogArticleState(identity: BlogArticleIdentity): BlogArticleState {
  const slug = String(identity.slug || '').trim();
  const language = String(identity.language || '').trim();

  if (!slug || !isBlogGroupLanguage(language)) {
    return {
      content_status: 'archived',
      indexable: false,
      canonical_target_slug: slug || undefined,
    };
  }

  const match = findGroupMatch(slug, language);
  if (!match) {
    return {
      content_status: 'archived',
      indexable: false,
      canonical_target_slug: slug,
    };
  }

  const alternates = BLOG_GROUP_LANGUAGES.map(alternateLanguage => ({
    language: alternateLanguage,
    slug: match.group.translations[alternateLanguage].primary,
  }));

  return {
    article_group_key: match.group.key,
    content_status: match.role === 'primary' ? 'core' : 'merged',
    indexable: match.role === 'primary',
    primary_slug: match.translation.primary,
    canonical_target_slug: match.translation.primary,
    shared_image_seed: getSharedImageSeed(match.group) || undefined,
    listing_order: groupOrderByKey.get(match.group.key),
    alternates,
  };
}

export function enrichBlogArticle<T extends BlogArticleIdentity>(post: T): T & BlogArticleState {
  return {
    ...post,
    ...getBlogArticleState(post),
  };
}

export function isIndexableBlogArticle(post: BlogArticleIdentity): boolean {
  return getBlogArticleState(post).indexable;
}

export function isCoreBlogArticle(post: BlogArticleIdentity): boolean {
  return getBlogArticleState(post).content_status === 'core';
}

export function sortBlogArticlesForListing<T extends BlogArticleIdentity & { created_at?: string | null }>(posts: T[]): T[] {
  return [...posts].sort((left, right) => {
    const leftState = getBlogArticleState(left);
    const rightState = getBlogArticleState(right);
    const leftOrder = leftState.listing_order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = rightState.listing_order ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return String(right.created_at || '').localeCompare(String(left.created_at || ''));
  });
}

export function getCoreGroupDefinitions(): BlogArticleGroupDefinition[] {
  return manifest.coreOrder
    .map(key => groupsByKey.get(key))
    .filter((group): group is BlogArticleGroupDefinition => Boolean(group));
}
