import { supabaseAnonKey, supabaseUrl } from './supabase-config';
import { resolvePublicArticleSlug } from './article-slugs';
import {
  enrichBlogArticle,
  getBlogArticleState,
  isIndexableBlogArticle,
  sortBlogArticlesForListing,
} from './blog-article-groups';
import { getUnifiedFaqItems, normalizeFaqCategory } from './faq-content';

type Primitive = string | number | boolean;
type FilterOperator = 'eq' | 'neq';

interface QueryFilter {
  column: string;
  operator?: FilterOperator;
  value: Primitive | null | undefined;
}

interface QueryOrder {
  column: string;
  ascending?: boolean;
}

interface QueryOptions {
  select: string;
  filters?: QueryFilter[];
  order?: QueryOrder;
  limit?: number;
  cacheKey?: string;
  ttlMs?: number;
}

interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

export interface TranslationRow {
  key: string;
  value: string;
}

export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  language: string;
  published?: boolean;
  hidden_from_users?: boolean;
  created_at: string;
  updated_at?: string;
  author?: string;
  category?: string;
  tags?: string[];
  reading_time?: number;
  meta_title?: string;
  meta_description?: string;
  canonical_slug?: string;
  legacy_slug?: string;
  alternates?: Array<{
    language: string;
    slug: string;
    legacy_slug?: string;
  }>;
  article_group_key?: string;
  content_status?: 'core' | 'merged' | 'archived';
  indexable?: boolean;
  canonical_target_slug?: string;
  primary_slug?: string;
  shared_image_seed?: string;
  listing_order?: number;
}

export interface PublicFAQItem {
  id: string;
  question: string;
  answer: string;
  language: string;
  order: number;
  category: string;
}

interface CheckRecentSubmissionResponse {
  is_duplicate?: boolean;
}

const DEFAULT_TTL_MS = 10 * 60 * 1000;
const memoryCache = new Map<string, CacheEntry<unknown>>();

function canUseSessionStorage(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  } catch {
    return false;
  }
}

function readCache<T>(key: string): T | null {
  const memoryEntry = memoryCache.get(key) as CacheEntry<T> | undefined;
  if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
    return memoryEntry.value;
  }

  if (!canUseSessionStorage()) return null;

  try {
    const rawValue = window.sessionStorage.getItem(key);
    if (!rawValue) return null;

    const parsed = JSON.parse(rawValue) as CacheEntry<T>;
    if (!parsed || parsed.expiresAt <= Date.now()) {
      window.sessionStorage.removeItem(key);
      return null;
    }

    memoryCache.set(key, parsed);
    return parsed.value;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, value: T, ttlMs: number = DEFAULT_TTL_MS): T {
  const entry: CacheEntry<T> = {
    expiresAt: Date.now() + ttlMs,
    value,
  };

  memoryCache.set(key, entry);

  if (canUseSessionStorage()) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // Ignore storage quota errors and keep the in-memory cache.
    }
  }

  return value;
}

function normalizeFilterValue(value: Primitive): string {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

function buildSelectUrl(tableName: string, options: QueryOptions): string {
  const url = new URL(`${supabaseUrl}/rest/v1/${tableName}`);
  url.searchParams.set('select', options.select);

  for (const filter of options.filters || []) {
    if (filter.value === null || typeof filter.value === 'undefined') continue;

    const operator = filter.operator || 'eq';
    url.searchParams.set(filter.column, `${operator}.${normalizeFilterValue(filter.value)}`);
  }

  if (options.order) {
    url.searchParams.set('order', `${options.order.column}.${options.order.ascending === false ? 'desc' : 'asc'}`);
  }

  if (typeof options.limit === 'number') {
    url.searchParams.set('limit', String(options.limit));
  }

  return url.toString();
}

function createHeaders(contentType?: string): HeadersInit {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    ...(contentType ? { 'Content-Type': contentType } : {}),
  };
}

async function fetchJson<T>(
  input: RequestInfo | URL,
  init: RequestInit,
  cacheKey?: string,
  ttlMs?: number,
  allowEmptyResponse: boolean = false
): Promise<T> {
  if (cacheKey) {
    const cachedValue = readCache<T>(cacheKey);
    if (cachedValue !== null) return cachedValue;
  }

  const response = await fetch(input, init);
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Public API request failed: ${response.status} ${errorText}`);
  }

  if (allowEmptyResponse && response.status === 204) {
    return undefined as T;
  }

  const rawValue = await response.text();
  if (allowEmptyResponse && !rawValue.trim()) {
    return undefined as T;
  }

  const value = JSON.parse(rawValue) as T;
  if (cacheKey) {
    return writeCache(cacheKey, value, ttlMs);
  }

  return value;
}

async function selectRows<T>(tableName: string, options: QueryOptions): Promise<T[]> {
  return fetchJson<T[]>(
    buildSelectUrl(tableName, options),
    {
      headers: createHeaders(),
    },
    options.cacheKey,
    options.ttlMs
  );
}

async function maybeSingleRow<T>(tableName: string, options: QueryOptions): Promise<T | null> {
  const rows = await selectRows<T>(tableName, {
    ...options,
    limit: 1,
  });

  return rows[0] || null;
}

function enrichPublicBlogPost<T extends PublicBlogPost>(post: T): T {
  return enrichBlogArticle(post) as T;
}

function enrichPublicBlogPosts<T extends PublicBlogPost>(posts: T[]): T[] {
  return posts.map(post => enrichPublicBlogPost(post));
}

async function fetchPublishedBlogPostsByLanguage(language: string): Promise<PublicBlogPost[]> {
  const posts = await selectRows<PublicBlogPost>('blog_posts', {
    select:
      'id,title,slug,excerpt,content,image_url,language,published,hidden_from_users,created_at,updated_at,author,category,tags,reading_time,meta_title,meta_description',
    filters: [
      { column: 'language', value: language },
      { column: 'published', value: true },
    ],
    order: { column: 'created_at', ascending: false },
    cacheKey: `published-blog-posts-by-language:${language}`,
    ttlMs: 10 * 60 * 1000,
  });

  return enrichPublicBlogPosts(posts);
}

async function callRpc<T>(
  functionName: string,
  body: Record<string, unknown>,
  cacheKey?: string,
  ttlMs?: number,
  allowEmptyResponse: boolean = false
): Promise<T> {
  return fetchJson<T>(
    `${supabaseUrl}/rest/v1/rpc/${functionName}`,
    {
      method: 'POST',
      headers: createHeaders('application/json'),
      body: JSON.stringify(body),
    },
    cacheKey,
    ttlMs,
    allowEmptyResponse
  );
}

export async function fetchTranslations(language: string): Promise<TranslationRow[]> {
  return selectRows<TranslationRow>('translations', {
    select: 'key,value',
    filters: [{ column: 'language', value: language }],
    cacheKey: `translations:${language}`,
    ttlMs: 60 * 60 * 1000,
  });
}

export async function fetchVisibleBlogPosts(language: string, limit?: number): Promise<PublicBlogPost[]> {
  const posts = await selectRows<PublicBlogPost>('blog_posts', {
    select:
      'id,title,slug,excerpt,image_url,language,published,hidden_from_users,created_at,updated_at,author,category,tags,reading_time',
    filters: [
      { column: 'language', value: language },
      { column: 'published', value: true },
    ],
    order: { column: 'created_at', ascending: false },
    cacheKey: `visible-blog-posts:core:${language}:${limit || 'all'}`,
    ttlMs: 10 * 60 * 1000,
  });

  const visiblePosts = sortBlogArticlesForListing(enrichPublicBlogPosts(posts).filter(isIndexableBlogArticle));
  return typeof limit === 'number' ? visiblePosts.slice(0, limit) : visiblePosts;
}

export async function fetchRelatedBlogPosts(
  language: string,
  category: string,
  excludeId: string,
  limit: number = 3
): Promise<PublicBlogPost[]> {
  const posts = await selectRows<PublicBlogPost>('blog_posts', {
    select: 'id,title,slug,excerpt,image_url,language,created_at,author,category,reading_time',
    filters: [
      { column: 'language', value: language },
      { column: 'published', value: true },
      { column: 'category', value: category },
      { column: 'id', operator: 'neq', value: excludeId },
    ],
    order: { column: 'created_at', ascending: false },
    cacheKey: `related-posts:core:${language}:${category}:${excludeId}:${limit}`,
    ttlMs: 10 * 60 * 1000,
  });

  return sortBlogArticlesForListing(enrichPublicBlogPosts(posts).filter(isIndexableBlogArticle)).slice(0, limit);
}

export async function fetchPublishedBlogPost(slug: string, language: string): Promise<PublicBlogPost | null> {
  const exactMatch = await maybeSingleRow<PublicBlogPost>('blog_posts', {
    select:
      'id,title,slug,excerpt,content,image_url,language,published,hidden_from_users,created_at,updated_at,author,category,tags,reading_time,meta_title,meta_description',
    filters: [
      { column: 'slug', value: slug },
      { column: 'language', value: language },
      { column: 'published', value: true },
    ],
    cacheKey: `published-post:${language}:${slug}`,
    ttlMs: 10 * 60 * 1000,
  });

  if (exactMatch) {
    return enrichPublicBlogPost(exactMatch);
  }

  const languagePosts = await fetchPublishedBlogPostsByLanguage(language);
  const fallbackMatch = languagePosts.find(post => {
    if (post.slug === slug) return true;

    const state = getBlogArticleState(post);
    if (state.primary_slug === slug) return true;
    if (state.canonical_target_slug === slug) return true;

    return resolvePublicArticleSlug(post) === slug;
  });

  return fallbackMatch || null;
}

export async function fetchFaqItems(language: string, category: string = 'all', limit?: number): Promise<PublicFAQItem[]> {
  return getUnifiedFaqItems(language, normalizeFaqCategory(category), limit);
}

export async function incrementPostViews(postId: string): Promise<void> {
  await callRpc<unknown>('increment_post_views', { post_id: postId }, undefined, undefined, true);
}

export async function checkRecentSubmission(email: string, telegram: string | null): Promise<CheckRecentSubmissionResponse | null> {
  return callRpc<CheckRecentSubmissionResponse>(
    'check_recent_submission',
    {
      p_email: email,
      p_telegram: telegram,
    }
  );
}

export async function insertPublicRow(tableName: string, payload: Record<string, unknown>): Promise<void> {
  const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
    method: 'POST',
    headers: {
      ...createHeaders('application/json'),
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Insert failed for ${tableName}: ${response.status} ${errorText}`);
  }
}
