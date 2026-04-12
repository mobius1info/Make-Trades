import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT_DIR = process.cwd();
const DIST_DIR = join(ROOT_DIR, 'dist');
const PUBLIC_DIR = join(ROOT_DIR, 'public');
const BASE_URL = 'https://maketrades.info';
const LANGUAGES = ['ru', 'en', 'de', 'uk', 'zh'];
const sitemapOnly = process.argv.includes('--sitemap-only');
const generatedPostImageManifest = JSON.parse(await readFile(join(ROOT_DIR, 'src', 'generated-post-image-manifest.json'), 'utf8'));
const generatedPostImagesBySlug = new Set(generatedPostImageManifest);
const POST_IMAGE_VARIANT_WIDTHS = [480, 768, 1280];
const POST_IMAGE_BASE_WIDTH = 1280;
const POST_IMAGE_BASE_HEIGHT = 720;

const blogIndexCopy = {
  ru: {
    title: 'Блог MakeTrades - статьи о трейдинге и брокерском бизнесе',
    heading: 'Блог MakeTrades',
    subtitle: 'Полезные статьи о создании брокерской компании, торговых стратегиях и управлении финансовыми платформами',
  },
  en: {
    title: 'MakeTrades Blog - trading and brokerage business articles',
    heading: 'MakeTrades Blog',
    subtitle: 'Useful articles about brokerage launch, trading strategies and financial platform management',
  },
  de: {
    title: 'MakeTrades Blog - Artikel zu Trading und Brokerage',
    heading: 'MakeTrades Blog',
    subtitle: 'Praxisnahe Artikel zu Brokerage-Start, Handelsstrategien und Finanzplattformen',
  },
  uk: {
    title: 'Блог MakeTrades - статті про трейдинг і брокерський бізнес',
    heading: 'Блог MakeTrades',
    subtitle: 'Корисні статті про запуск брокера, торгові стратегії та керування фінансовими платформами',
  },
  zh: {
    title: 'MakeTrades Blog - 交易和经纪业务文章',
    heading: 'MakeTrades Blog',
    subtitle: '关于经纪业务启动、交易策略和金融平台管理的实用文章',
  },
};

const faqIndexCopy = {
  ru: {
    title: 'FAQ MakeTrades - вопросы и ответы о платформе для брокеров',
    heading: 'Часто задаваемые вопросы',
    subtitle: 'Найдите ответы на самые популярные вопросы о платформе MakeTrades',
  },
  en: {
    title: 'MakeTrades FAQ - questions and answers about the broker platform',
    heading: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions about the MakeTrades platform',
  },
  de: {
    title: 'MakeTrades FAQ - Fragen und Antworten zur Broker-Plattform',
    heading: 'Haufig gestellte Fragen',
    subtitle: 'Antworten auf haufige Fragen zur MakeTrades-Plattform',
  },
  uk: {
    title: 'FAQ MakeTrades - питання та відповіді про платформу для брокерів',
    heading: 'Часті запитання',
    subtitle: 'Знайдіть відповіді на популярні запитання про платформу MakeTrades',
  },
  zh: {
    title: 'MakeTrades FAQ - 经纪商平台常见问题',
    heading: '常见问题',
    subtitle: '查找有关 MakeTrades 平台的常见问题答案',
  },
};

function buildTranslationsIndex(rows = []) {
  const index = new Map();

  for (const row of rows) {
    const language = String(row.language || '').trim();
    const key = String(row.key || '').trim();
    if (!language || !key) continue;

    if (!index.has(language)) index.set(language, new Map());
    index.get(language).set(key, String(row.value || ''));
  }

  return index;
}

function translate(index, language, key, fallback = '') {
  return index.get(language)?.get(key) || fallback;
}

function homePath(language) {
  return language === 'ru' ? '/' : `/?lang=${encodeURIComponent(language)}`;
}

async function readSupabasePublicConfig() {
  const source = await readFile(join(ROOT_DIR, 'src', 'supabase-config.ts'), 'utf8');
  const defaultUrl = source.match(/supabaseUrl[\s\S]*?\|\|\s*'([^']+)'/)?.[1];
  const defaultAnonKey = source.match(/supabaseAnonKey[\s\S]*?\|\|\s*'([^']+)'/)?.[1];

  const url = process.env.VITE_SUPABASE_URL || defaultUrl;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || defaultAnonKey;

  if (!url || !anonKey) {
    throw new Error('Missing Supabase public config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  return { url, anonKey };
}

async function fetchRestRows(config, tableName, params) {
  const url = new URL(`${config.url}/rest/v1/${tableName}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      Prefer: 'count=exact',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase REST request failed for ${tableName}: ${response.status} ${body}`);
  }

  const rows = await response.json();
  const contentRange = response.headers.get('content-range');
  const count = contentRange?.match(/\/(\d+)$/)?.[1];

  return {
    rows,
    count: count ? Number(count) : null,
  };
}

async function fetchAllRows(config, tableName, params) {
  const pageSize = 1000;
  let offset = 0;
  let exactCount = null;
  const rows = [];

  while (true) {
    const { rows: data, count } = await fetchRestRows(config, tableName, {
      ...params,
      limit: pageSize,
      offset,
    });

    if (exactCount === null && Number.isInteger(count)) exactCount = count;
    if (data?.length) rows.push(...data);

    if (!data || data.length < pageSize) break;
    offset += pageSize;
  }

  return { rows, count: exactCount ?? rows.length };
}

async function fetchSeoData(config) {
  const postSelect = [
    'id',
    'title',
    'slug',
    'excerpt',
    'content',
    'image_url',
    'language',
    'published',
    'hidden_from_users',
    'created_at',
    'updated_at',
    'author',
    'category',
    'tags',
    'reading_time',
    'meta_title',
    'meta_description',
  ].join(',');

  const { rows: posts, count: publishedCount } = await fetchAllRows(config, 'blog_posts', {
    select: postSelect,
    published: 'eq.true',
    order: 'updated_at.desc,created_at.desc',
  });

  if (posts.length !== publishedCount) {
    throw new Error(`Fetched ${posts.length} published posts, but Supabase reported ${publishedCount}.`);
  }

  const { rows: faqItems } = await fetchAllRows(config, 'faq_items', {
    select: 'id, question, answer, language, category, order',
    order: 'language.asc,order.asc',
  });

  const { rows: translations } = await fetchAllRows(config, 'translations', {
    select: 'language,key,value',
    order: 'language.asc,key.asc',
  });

  return { posts: ensureUniquePublicSlugs(posts), publishedCount, faqItems, translations };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeXml(value) {
  return escapeHtml(value);
}

function escapeScriptJson(value) {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}

function plainTextFromHtml(value) {
  return String(value ?? '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(value, maxLength) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}...`;
}

async function inlineDeferredHomeBootstrap(html) {
  const scriptMatch = html.match(/<script type="module" crossorigin src="(\/assets\/main-[^"]+\.js)"><\/script>/);
  if (!scriptMatch) return html;

  const assetRelativePath = scriptMatch[1].replace(/^\//, '');
  const assetPath = join(DIST_DIR, assetRelativePath);
  const bootstrapCode = (await readFile(assetPath, 'utf8')).replace(/import\("\.\//g, 'import("/assets/');

  if (!bootstrapCode.includes('requestIdleCallback') || !bootstrapCode.includes('Failed to load main app bundle:')) {
    return html;
  }

  return html.replace(
    scriptMatch[0],
    `<script type="module">\n${bootstrapCode.replace(/<\/script/gi, '<\\/script')}\n</script>`
  );
}

const TECHNICAL_SLUG_PATTERNS = [
  /^(?:post|article|blog|news|entry|page)-\d+(?:-(?:ru|en|de|uk|zh))?$/i,
  /^(?:draft|temp|test|untitled)(?:-\d+)?$/i,
  /^new-(?:post|article)(?:-\d+)?$/i,
];

const GERMAN_CHAR_REPLACEMENTS = {
  'ä': 'ae',
  'ö': 'oe',
  'ü': 'ue',
  'ß': 'ss',
};

const CYRILLIC_TO_LATIN = {
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

function hashString(value) {
  let hash = 0;
  for (const char of String(value || 'post')) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }
  return Math.abs(hash);
}

function stableSlugSuffix(post) {
  return hashString(String(post.id || post.slug || post.title || 'post')).toString(36).slice(0, 6) || 'post';
}

function truncateSlug(slug, maxLength = 80) {
  if (slug.length <= maxLength) return slug;

  const parts = slug.split('-').filter(Boolean);
  let result = '';

  for (const part of parts) {
    const next = result ? `${result}-${part}` : part;
    if (next.length > maxLength) break;
    result = next;
  }

  return result || slug.slice(0, maxLength).replace(/-+$/g, '');
}

function replaceLanguageSpecificChars(value, language) {
  const lowerCased = String(value || '').toLowerCase();

  if (language === 'de') {
    return Array.from(lowerCased, char => GERMAN_CHAR_REPLACEMENTS[char] ?? char).join('');
  }

  if (language === 'ru' || language === 'uk') {
    return Array.from(lowerCased, char => CYRILLIC_TO_LATIN[char] ?? char).join('');
  }

  return lowerCased;
}

function isTechnicalArticleSlug(slug) {
  const normalized = String(slug || '').trim();
  if (!normalized) return true;
  return TECHNICAL_SLUG_PATTERNS.some(pattern => pattern.test(normalized));
}

function hasHumanReadableArticleSlug(slug) {
  const normalized = String(slug || '').trim();
  if (!normalized || isTechnicalArticleSlug(normalized)) return false;
  return /[\p{Letter}\p{Number}]/u.test(normalized);
}

function buildTitleBasedArticleSlug(post, maxLength = 80) {
  const titleSlug = replaceLanguageSpecificChars(post.title, post.language)
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
  if (trimmedTitleSlug) return trimmedTitleSlug;

  if (hasHumanReadableArticleSlug(post.slug)) {
    return truncateSlug(String(post.slug).trim(), maxLength);
  }

  return `article-${stableSlugSuffix(post)}`;
}

function resolvePublicArticleSlug(post) {
  const explicitCanonicalSlug = String(post.canonical_slug || '').trim();
  if (explicitCanonicalSlug) return explicitCanonicalSlug;
  if (hasHumanReadableArticleSlug(post.slug)) return String(post.slug).trim();
  return buildTitleBasedArticleSlug(post);
}

function ensureUniquePublicSlugs(posts) {
  const usedByLanguage = new Map();

  return posts.map(post => {
    const language = String(post.language || 'ru');
    const used = usedByLanguage.get(language) || new Set();
    const legacySlug = String(post.slug || '').trim();
    const desiredSlug = resolvePublicArticleSlug(post);

    let canonicalSlug = desiredSlug;
    if (used.has(canonicalSlug)) {
      const suffix = stableSlugSuffix(post);
      const base = truncateSlug(desiredSlug, Math.max(20, 80 - suffix.length - 1));
      canonicalSlug = `${base}-${suffix}`;
    }

    while (used.has(canonicalSlug)) {
      const suffix = stableSlugSuffix({ ...post, title: `${post.title || ''}-${canonicalSlug}` });
      const base = truncateSlug(desiredSlug, Math.max(20, 80 - suffix.length - 1));
      canonicalSlug = `${base}-${suffix}`;
    }

    used.add(canonicalSlug);
    usedByLanguage.set(language, used);

    return {
      ...post,
      slug: legacySlug,
      legacy_slug: legacySlug,
      canonical_slug: canonicalSlug,
    };
  });
}

function resolveGeneratedPostImage(seed = '') {
  const normalizedSeed = String(seed || '').trim();
  if (!normalizedSeed) return '';

  return generatedPostImagesBySlug.has(normalizedSeed) ? `/assets/blog/${normalizedSeed}.jpg` : '';
}

function generatedPostImagePath(seed, width = POST_IMAGE_BASE_WIDTH) {
  return width === POST_IMAGE_BASE_WIDTH ? `/assets/blog/${seed}.jpg` : `/assets/blog/${seed}-${width}.jpg`;
}

function generatedPostImageSrcSet(seed = '') {
  const normalizedSeed = String(seed || '').trim();
  if (!normalizedSeed || !generatedPostImagesBySlug.has(normalizedSeed)) return '';

  return POST_IMAGE_VARIANT_WIDTHS.map(width => `${generatedPostImagePath(normalizedSeed, width)} ${width}w`).join(', ');
}

function generatedPostImageSizes(kind = 'card') {
  if (kind === 'hero') {
    return '(max-width: 767px) calc(100vw - 2rem), (max-width: 1279px) calc(100vw - 4rem), 1200px';
  }

  if (kind === 'content') {
    return '(max-width: 767px) calc(100vw - 2rem), 800px';
  }

  return '(max-width: 767px) calc(100vw - 2rem), (max-width: 1279px) calc((100vw - 6rem) / 2), 400px';
}

function postImageAttributes(post, kind = 'card') {
  const srcset = generatedPostImageSrcSet(post.slug);

  return {
    src: postImageUrl(post),
    srcset,
    sizes: srcset ? generatedPostImageSizes(kind) : '',
    width: POST_IMAGE_BASE_WIDTH,
    height: POST_IMAGE_BASE_HEIGHT,
  };
}

function normalizePostImageUrl(imageUrl, seed = '') {
  const generatedImage = resolveGeneratedPostImage(seed);
  if (generatedImage) return generatedImage;

  return String(imageUrl || '').trim();
}

function seoPostImageUrl(imageUrl, seed = '') {
  const generatedImage = resolveGeneratedPostImage(seed);
  if (generatedImage) return generatedImage;

  return normalizePostImageUrl(imageUrl, seed);
}

function absoluteImageUrl(imageUrl) {
  return imageUrl.startsWith('/') ? `${BASE_URL}${imageUrl}` : imageUrl;
}

function postImageUrl(post) {
  return normalizePostImageUrl(post.image_url, post.slug);
}

function postSeoImageUrl(post) {
  return seoPostImageUrl(post.image_url, post.slug);
}

function postImageAbsoluteUrl(post) {
  return absoluteImageUrl(postSeoImageUrl(post));
}

function sanitizeArticleHtmlImages(html, seed = 'post') {
  const generatedImage = resolveGeneratedPostImage(seed);
  if (!generatedImage) return String(html || '');
  const srcset = generatedPostImageSrcSet(seed);
  const sizes = generatedPostImageSizes('content');

  return String(html || '').replace(/(<img\b[^>]*\bsrc=["'])([^"']*)(["'][^>]*>)/gi, (_match, prefix, _src, suffix) => {
    let nextSuffix = suffix;

    if (seed && !/\sdata-post-slug=/i.test(nextSuffix)) {
      nextSuffix = nextSuffix.replace(/\s*\/?>$/, match => ` data-post-slug="${seed}" data-image-kind="content"${match}`);
    }

    if (srcset && !/\ssrcset=/i.test(nextSuffix)) {
      nextSuffix = nextSuffix.replace(
        /\s*\/?>$/,
        match =>
          ` srcset="${srcset}" sizes="${sizes}" width="${POST_IMAGE_BASE_WIDTH}" height="${POST_IMAGE_BASE_HEIGHT}"${match}`
      );
    }

    return `${prefix}${generatedImage}${nextSuffix}`;
  });
}

function articleAlternatesPayload(post, clusters) {
  return articleSiblings(post, clusters).map(sibling => ({
    language: sibling.language,
    slug: sibling.canonical_slug || sibling.slug,
    legacy_slug: sibling.legacy_slug || sibling.slug,
  }));
}

function prerenderedPostData(post, clusters) {
  return {
    ...post,
    image_url: postImageUrl(post),
    content: sanitizeArticleHtmlImages(post.content, post.slug),
    alternates: articleAlternatesPayload(post, clusters),
  };
}

function metaTitle(post) {
  return truncate(post.meta_title || `${post.title} | MakeTrades`, 70);
}

function metaDescription(post) {
  return truncate(post.meta_description || post.excerpt || plainTextFromHtml(post.content), 180);
}

function postKeywords(post) {
  return Array.isArray(post.tags) && post.tags.length > 0
    ? post.tags.filter(Boolean).join(', ')
    : 'trading, broker, MakeTrades';
}

function articlePath(post) {
  return `/blog/${encodeURIComponent(post.language)}/${encodeURIComponent(post.canonical_slug || post.slug)}/`;
}

function articleUrl(post) {
  return `${BASE_URL}${articlePath(post)}`;
}

function legacyArticlePath(post) {
  return `/blog/${encodeURIComponent(post.language)}/${encodeURIComponent(post.legacy_slug || post.slug)}/`;
}

function legacyArticleUrl(post) {
  return `${BASE_URL}${legacyArticlePath(post)}`;
}

function blogIndexPath(language) {
  return `/blog/${encodeURIComponent(language)}/`;
}

function blogIndexUrl(language) {
  return `${BASE_URL}${blogIndexPath(language)}`;
}

function faqPath(language) {
  return `/faq/${encodeURIComponent(language)}/`;
}

function faqUrl(language) {
  return `${BASE_URL}${faqPath(language)}`;
}

function postFilePath(post) {
  const publicSlug = post.canonical_slug || post.slug;

  if (publicSlug.includes('/') || publicSlug.includes('\\') || post.language.includes('/') || post.language.includes('\\')) {
    throw new Error(`Unsafe blog post path: ${post.language}/${publicSlug}`);
  }

  return join(DIST_DIR, 'blog', post.language, publicSlug, 'index.html');
}

function legacyPostFilePath(post) {
  const legacySlug = post.legacy_slug || post.slug;

  if (legacySlug.includes('/') || legacySlug.includes('\\') || post.language.includes('/') || post.language.includes('\\')) {
    throw new Error(`Unsafe legacy blog post path: ${post.language}/${legacySlug}`);
  }

  return join(DIST_DIR, 'blog', post.language, legacySlug, 'index.html');
}

function languagePosts(posts, language, { visibleOnly = false } = {}) {
  return posts
    .filter(post => post.language === language && (!visibleOnly || !post.hidden_from_users))
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

function clusterKey(post) {
  const clusterSlug = post.legacy_slug || post.slug;
  const match = clusterSlug.match(/^(.+)-(ru|en|de|uk|zh)$/);
  return match ? `suffix:${match[1]}` : `single:${post.language}:${clusterSlug}`;
}

function makeClusters(posts) {
  const clusters = new Map();

  for (const post of posts) {
    const key = clusterKey(post);
    if (!clusters.has(key)) clusters.set(key, new Map());
    clusters.get(key).set(post.language, post);
  }

  return clusters;
}

function articleSiblings(post, clusters) {
  const group = clusters.get(clusterKey(post));
  if (!group) return [post];

  const siblings = LANGUAGES
    .map(language => group.get(language))
    .filter(Boolean);

  return siblings.some(sibling => sibling.slug === post.slug && sibling.language === post.language)
    ? siblings
    : [post];
}

function articleAlternateLinks(post, clusters, indent = '    ') {
  const siblings = articleSiblings(post, clusters);
  const defaultPost = siblings.find(sibling => sibling.language === 'ru') || siblings[0] || post;
  const uniqueSiblings = siblings.length > 0 ? siblings : [post];

  const links = uniqueSiblings.map(sibling =>
    `${indent}<link rel="alternate" hreflang="${escapeHtml(sibling.language)}" href="${escapeHtml(articleUrl(sibling))}" />`
  );
  links.push(`${indent}<link rel="alternate" hreflang="x-default" href="${escapeHtml(articleUrl(defaultPost))}" />`);
  return `${links.join('\n')}\n`;
}

function pageAlternateLinks(kind, indent = '    ') {
  const urlFor = kind === 'faq' ? faqUrl : blogIndexUrl;
  const links = LANGUAGES.map(language =>
    `${indent}<link rel="alternate" hreflang="${language}" href="${urlFor(language)}" />`
  );
  links.push(`${indent}<link rel="alternate" hreflang="x-default" href="${urlFor('ru')}" />`);
  return `${links.join('\n')}\n`;
}

function replaceHtmlLang(html, language) {
  return html.replace(/<html lang="[^"]*"/i, `<html lang="${escapeHtml(language)}"`);
}

function replaceTitle(html, title) {
  return html.replace(/<title(?:\s+id="[^"]*")?>[\s\S]*?<\/title>/i, match => {
    const id = match.match(/\s+id="[^"]*"/)?.[0] || '';
    return `<title${id}>${escapeHtml(title)}</title>`;
  });
}

function setAttributeById(html, id, attribute, value) {
  const tagRe = new RegExp(`<([^\\s>/]+)([^>]*\\bid="${id}"[^>]*)>`, 'i');
  return html.replace(tagRe, (full, tagName, attrs) => {
    const selfClosing = /\/\s*$/.test(attrs);
    const normalizedAttrs = selfClosing ? attrs.replace(/\/\s*$/, '') : attrs;
    const attrRe = new RegExp(`\\s${attribute}="[^"]*"`, 'i');
    const nextAttr = ` ${attribute}="${escapeHtml(value)}"`;
    const nextAttrs = attrRe.test(normalizedAttrs)
      ? normalizedAttrs.replace(attrRe, nextAttr)
      : `${normalizedAttrs}${nextAttr}`;
    return `<${tagName}${nextAttrs}${selfClosing ? ' /' : ''}>`;
  });
}

function setMetaName(html, name, content) {
  const re = new RegExp(`(<meta\\s+name="${name}"[^>]*\\scontent=")[^"]*("[^>]*>)`, 'i');
  return html.replace(re, (_match, start, end) => `${start}${escapeHtml(content)}${end}`);
}

function setMetaProperty(html, property, content) {
  const re = new RegExp(`(<meta\\s+property="${property}"[^>]*\\scontent=")[^"]*("[^>]*>)`, 'i');
  return html.replace(re, (_match, start, end) => `${start}${escapeHtml(content)}${end}`);
}

function setCanonical(html, url) {
  return html.replace(
    /(<link\s+rel="canonical"[^>]*\shref=")[^"]*("[^>]*>)/i,
    (_match, start, end) => `${start}${escapeHtml(url)}${end}`
  );
}

function replaceElementContentById(html, id, content) {
  const re = new RegExp(`(<([a-z0-9]+)\\b[^>]*\\bid="${id}"[^>]*>)[\\s\\S]*?(<\\/\\2>)`, 'i');
  return html.replace(re, (_match, start, _tagName, end) => `${start}${content}${end}`);
}

function replaceJsonLdById(html, id, data) {
  return replaceElementContentById(html, id, `\n${escapeScriptJson(data)}\n    `);
}

function replaceAlternateLinks(html, linksHtml) {
  const re = /    <link rel="alternate" hreflang="ru"[\s\S]*?    <link rel="alternate" hreflang="x-default"[^>]*\/>\s*/i;
  return html.replace(re, linksHtml);
}

function insertBeforeEntryScript(html, scriptHtml) {
  return html.replace(/(\s+<script type="module"[^>]+><\/script>)/i, `\n    ${scriptHtml}$1`);
}

function articleStructuredData(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: metaDescription(post),
    image: postImageAbsoluteUrl(post),
    keywords: postKeywords(post),
    articleBody: plainTextFromHtml(post.content),
    inLanguage: post.language,
    author: {
      '@type': 'Person',
      name: post.author || 'MakeTrades Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MakeTrades',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/assets/logo.svg`,
      },
    },
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl(post),
    },
  };
}

function internalLinksHtml(post, posts, translationIndex) {
  const postTags = Array.isArray(post.tags) ? post.tags : [];
  if (postTags.length === 0) return '';

  const relatedTopics = languagePosts(posts, post.language, { visibleOnly: true })
    .filter(candidate => candidate.id !== post.id)
    .filter(candidate => Array.isArray(candidate.tags) && candidate.tags.some(tag => postTags.includes(tag)))
    .slice(0, 5);

  if (relatedTopics.length === 0) return '';

  const heading = translate(translationIndex, post.language, 'blog_post.related_topics', 'Related topics:');

  return `
              <div class="internal-links">
                <h3>${escapeHtml(heading)}</h3>
                <ul>
                  ${relatedTopics.map(candidate => `<li><a href="${articlePath(candidate)}">${escapeHtml(candidate.title)}</a></li>`).join('')}
                </ul>
              </div>`;
}

function breadcrumbData(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'MakeTrades', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: blogIndexUrl(post.language) },
      { '@type': 'ListItem', position: 3, name: post.title, item: articleUrl(post) },
    ],
  };
}

function relatedPostsFor(post, posts) {
  const postTags = Array.isArray(post.tags) ? post.tags : [];

  return posts
    .filter(candidate => candidate.language === post.language && candidate.id !== post.id)
    .map(candidate => {
      const candidateTags = Array.isArray(candidate.tags) ? candidate.tags : [];
      const tagScore = candidateTags.filter(tag => postTags.includes(tag)).length;
      const categoryScore = candidate.category && candidate.category === post.category ? 2 : 0;
      return { post: candidate, score: tagScore + categoryScore };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || String(b.post.created_at).localeCompare(String(a.post.created_at)))
    .slice(0, 3)
    .map(item => item.post);
}

function blogCard(post, language = post.language, translationIndex = new Map(), options = {}) {
  const minLabel = translate(translationIndex, language, 'blog_page.min_read', 'min');
  const image = postImageAttributes(post, 'card');
  const prioritizeImage = options.prioritizeImage === true;

  return `
      <a href="${articlePath(post)}" class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
        <img src="${escapeHtml(image.src)}"
             alt="${escapeHtml(post.title)}"
             class="blog-card-image"
             itemprop="image"
             data-post-slug="${escapeHtml(post.slug)}"
             data-image-kind="card"
             width="${image.width}"
             height="${image.height}"
             ${image.srcset ? `srcset="${escapeHtml(image.srcset)}"` : ''}
             ${image.sizes ? `sizes="${escapeHtml(image.sizes)}"` : ''}
             loading="${prioritizeImage ? 'eager' : 'lazy'}"
             ${prioritizeImage ? 'fetchpriority="high"' : ''}
             decoding="async">
        <div class="blog-card-content">
          <div class="blog-card-category">${escapeHtml(post.category || '')}</div>
          <h3 itemprop="headline">${escapeHtml(post.title)}</h3>
          <p itemprop="description">${escapeHtml(post.excerpt || metaDescription(post))}</p>
          <div class="blog-card-meta">
            <span itemprop="author" itemscope itemtype="https://schema.org/Person">
              <span itemprop="name">${escapeHtml(post.author || 'MakeTrades Team')}</span>
            </span>
            <span>&bull;</span>
            <time itemprop="datePublished" datetime="${escapeHtml(post.created_at)}">
              ${escapeHtml(formatDate(post.created_at, language))}
            </time>
            <span>&bull;</span>
            <span>${escapeHtml(post.reading_time || 5)} ${escapeHtml(minLabel)}</span>
          </div>
        </div>
        <meta itemprop="url" content="${escapeHtml(articleUrl(post))}">
      </a>`;
}

function faqItem(item) {
  return `
      <div class="faq-item" data-faq-id="${escapeHtml(item.id)}" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <div class="faq-question" itemprop="name">
          <span>${escapeHtml(item.question)}</span>
          <span>+</span>
        </div>
        <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div itemprop="text">${escapeHtml(item.answer)}</div>
        </div>
      </div>`;
}

function formatDate(value, language) {
  const locales = {
    ru: 'ru-RU',
    en: 'en-US',
    de: 'de-DE',
    uk: 'uk-UA',
    zh: 'zh-CN',
  };

  return new Date(value).toLocaleDateString(locales[language] || 'en-US');
}

function articleHtml(template, post, posts, clusters, translationIndex) {
  const title = metaTitle(post);
  const description = metaDescription(post);
  const keywords = postKeywords(post);
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const related = relatedPostsFor(post, posts);
  const readTimeLabel = translate(translationIndex, post.language, 'blog_post.min_read', 'min');
  const tagsLabel = translate(translationIndex, post.language, 'blog_post.tags', 'Tags:');
  const internalLinks = internalLinksHtml(post, posts, translationIndex);
  const heroImage = postImageAttributes(post, 'hero');

  let html = template;
  html = replaceHtmlLang(html, post.language);
  html = replaceTitle(html, title);
  html = setAttributeById(html, 'page-description', 'content', description);
  html = setAttributeById(html, 'page-keywords', 'content', keywords);
  html = setAttributeById(html, 'page-robots', 'content', 'index, follow');
  html = setAttributeById(html, 'page-canonical', 'href', articleUrl(post));
  html = setAttributeById(html, 'og-url', 'content', articleUrl(post));
  html = setAttributeById(html, 'og-title', 'content', post.title);
  html = setAttributeById(html, 'og-description', 'content', description);
  html = setAttributeById(html, 'og-image', 'content', postImageAbsoluteUrl(post));
  html = setAttributeById(html, 'twitter-url', 'content', articleUrl(post));
  html = setAttributeById(html, 'twitter-title', 'content', post.title);
  html = setAttributeById(html, 'twitter-description', 'content', description);
  html = setAttributeById(html, 'twitter-image', 'content', postImageAbsoluteUrl(post));
  html = replaceAlternateLinks(html, articleAlternateLinks(post, clusters));
  html = replaceJsonLdById(html, 'structured-data', articleStructuredData(post));
  html = replaceJsonLdById(html, 'breadcrumb-data', breadcrumbData(post));
  html = replaceElementContentById(
    html,
    'loadingText',
    escapeHtml(translate(translationIndex, post.language, 'blog_post.loading', 'Loading article...'))
  );
  html = replaceElementContentById(
    html,
    'errorTitle',
    escapeHtml(translate(translationIndex, post.language, 'blog_post.not_found_title', 'Article not found'))
  );
  html = replaceElementContentById(
    html,
    'errorDesc',
    escapeHtml(translate(translationIndex, post.language, 'blog_post.not_found_desc', 'Unfortunately, the requested article was not found.'))
  );
  html = replaceElementContentById(
    html,
    'errorBackBtn',
    escapeHtml(translate(translationIndex, post.language, 'blog_post.back_to_blog', 'Back to blog'))
  );
  html = setAttributeById(html, 'errorBackBtn', 'href', blogIndexPath(post.language));
  html = replaceElementContentById(html, 'backBlogBtn', escapeHtml(translate(translationIndex, post.language, 'button.blog', 'Blog')));
  html = setAttributeById(html, 'backBlogBtn', 'href', blogIndexPath(post.language));
  html = replaceElementContentById(
    html,
    'authorRole',
    escapeHtml(translate(translationIndex, post.language, 'blog_post.author_role', 'MakeTrades Expert'))
  );
  html = replaceElementContentById(
    html,
    'postCtaTitle',
    escapeHtml(translate(translationIndex, post.language, 'blog_post.cta_title', 'Ready to launch your brokerage platform?'))
  );
  html = replaceElementContentById(
    html,
    'postCtaDesc',
    escapeHtml(translate(translationIndex, post.language, 'blog_post.cta_desc', 'MakeTrades provides all the tools you need for a successful start'))
  );
  html = replaceElementContentById(
    html,
    'postCtaBtn',
    escapeHtml(translate(translationIndex, post.language, 'blog_post.cta_button', 'Request demo'))
  );
  html = replaceElementContentById(
    html,
    'relatedTitle',
    escapeHtml(translate(translationIndex, post.language, 'blog_post.related', 'Related articles'))
  );
  html = replaceElementContentById(
    html,
    'postCopyright',
    escapeHtml(translate(translationIndex, post.language, 'footer.copyright', '© 2026 MakeTrades. All rights reserved.'))
  );

  html = html.replace(/<div id="loading" style="([^"]*)">/i, '<div id="loading" style="display: none; $1">');
  html = setAttributeById(html, 'post-content', 'style', 'display: block');
  html = replaceElementContentById(html, 'post-category', escapeHtml(post.category || ''));
  html = replaceElementContentById(html, 'post-date', escapeHtml(formatDate(post.created_at, post.language)));
  html = setAttributeById(html, 'post-date', 'datetime', post.created_at);
  html = replaceElementContentById(html, 'post-reading-time', `${escapeHtml(post.reading_time || 5)} ${escapeHtml(readTimeLabel)}`);
  html = replaceElementContentById(html, 'post-title', escapeHtml(post.title));
  html = replaceElementContentById(html, 'post-excerpt', escapeHtml(post.excerpt || description));
  html = replaceElementContentById(html, 'post-author', escapeHtml(post.author || 'MakeTrades Team'));
  html = setAttributeById(html, 'post-image', 'src', heroImage.src);
  html = setAttributeById(html, 'post-image', 'alt', post.title);
  html = setAttributeById(html, 'post-image', 'data-post-slug', post.slug);
  html = setAttributeById(html, 'post-image', 'data-image-kind', 'hero');
  html = setAttributeById(html, 'post-image', 'width', String(heroImage.width));
  html = setAttributeById(html, 'post-image', 'height', String(heroImage.height));
  if (heroImage.srcset) {
    html = setAttributeById(html, 'post-image', 'srcset', heroImage.srcset);
  }
  if (heroImage.sizes) {
    html = setAttributeById(html, 'post-image', 'sizes', heroImage.sizes);
  }
  html = replaceElementContentById(
    html,
    'post-text',
    `${sanitizeArticleHtmlImages(post.content || `<p>${escapeHtml(post.excerpt || description)}</p>`, post.slug)}${internalLinks}`
  );
  html = replaceElementContentById(
    html,
    'post-tags',
    tags.length > 0
      ? `<strong>${escapeHtml(tagsLabel)}</strong> ${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}`
      : ''
  );
  html = replaceElementContentById(
    html,
    'related-posts-grid',
    related.map(candidate => blogCard(candidate, candidate.language, translationIndex)).join('')
  );
  html = insertBeforeEntryScript(
    html,
    `<script>window.__MAKETRADES_PRERENDERED_POST__=${escapeScriptJson(prerenderedPostData(post, clusters))};</script>`
  );

  return html;
}

function redirectHtml(post) {
  const title = metaTitle(post);
  const targetUrl = articleUrl(post);
  const targetPath = articlePath(post);

  return `<!DOCTYPE html>
<html lang="${escapeHtml(post.language)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="robots" content="noindex, follow" />
    <meta http-equiv="refresh" content="0;url=${escapeHtml(targetUrl)}" />
    <link rel="canonical" href="${escapeHtml(targetUrl)}" />
    <script>
      (function () {
        var target = new URL(${JSON.stringify(targetPath)}, window.location.origin);
        if (window.location.search) target.search = window.location.search;
        if (window.location.hash) target.hash = window.location.hash;
        window.location.replace(target.toString());
      })();
    </script>
  </head>
  <body>
    <p>Moved to <a href="${escapeHtml(targetUrl)}">${escapeHtml(targetUrl)}</a></p>
  </body>
</html>
`;
}

function blogStructuredData(language, posts) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: blogIndexCopy[language]?.heading || 'MakeTrades Blog',
    url: blogIndexUrl(language),
    inLanguage: language,
    publisher: {
      '@type': 'Organization',
      name: 'MakeTrades',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/assets/logo.svg`,
      },
    },
    blogPost: posts.slice(0, 30).map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: articleUrl(post),
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
    })),
  };
}

function faqStructuredData(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function blogIndexHtml(template, language, posts, translationIndex) {
  const copy = blogIndexCopy[language] || blogIndexCopy.en;
  const visiblePosts = languagePosts(posts, language, { visibleOnly: true });
  const description = copy.subtitle;

  let html = template;
  html = replaceHtmlLang(html, language);
  html = replaceTitle(html, copy.title);
  html = setMetaName(html, 'description', description);
  html = setMetaProperty(html, 'og:url', blogIndexUrl(language));
  html = setMetaProperty(html, 'og:title', copy.title);
  html = setMetaProperty(html, 'og:description', description);
  html = setMetaName(html, 'twitter:url', blogIndexUrl(language));
  html = setMetaName(html, 'twitter:title', copy.title);
  html = setMetaName(html, 'twitter:description', description);
  html = setCanonical(html, blogIndexUrl(language));
  html = replaceAlternateLinks(html, pageAlternateLinks('blog'));
  html = replaceJsonLdByType(html, 'Blog', blogStructuredData(language, visiblePosts));
  html = replaceElementContentById(html, 'blogPageTitle', escapeHtml(copy.heading));
  html = replaceElementContentById(html, 'blogPageSubtitle', escapeHtml(copy.subtitle));
  html = replaceElementContentById(html, 'backHomeBtn', escapeHtml(translate(translationIndex, language, 'button.back_home', 'Home')));
  html = setAttributeById(html, 'backHomeBtn', 'href', homePath(language));
  html = replaceElementContentById(
    html,
    'blogCopyright',
    escapeHtml(translate(translationIndex, language, 'footer.copyright', '© 2026 MakeTrades. All rights reserved.'))
  );
  html = replaceElementContentById(
    html,
    'allBlogPosts',
    visiblePosts.map((post, index) => blogCard(post, language, translationIndex, { prioritizeImage: index === 0 })).join('')
  );
  return html;
}

function faqIndexHtml(template, language, faqItems, translationIndex) {
  const copy = faqIndexCopy[language] || faqIndexCopy.en;
  const items = faqItems.filter(item => item.language === language).sort((a, b) => Number(a.order) - Number(b.order));
  const description = copy.subtitle;

  let html = template;
  html = replaceHtmlLang(html, language);
  html = replaceTitle(html, copy.title);
  html = setMetaName(html, 'description', description);
  html = setMetaProperty(html, 'og:url', faqUrl(language));
  html = setMetaProperty(html, 'og:title', copy.title);
  html = setMetaProperty(html, 'og:description', description);
  html = setMetaName(html, 'twitter:url', faqUrl(language));
  html = setMetaName(html, 'twitter:title', copy.title);
  html = setMetaName(html, 'twitter:description', description);
  html = setCanonical(html, faqUrl(language));
  html = replaceAlternateLinks(html, pageAlternateLinks('faq'));
  html = replaceJsonLdById(html, 'faqSchema', faqStructuredData(items));
  html = replaceElementContentById(html, 'faqPageTitle', escapeHtml(copy.heading));
  html = replaceElementContentById(html, 'faqPageSubtitle', escapeHtml(copy.subtitle));
  html = replaceElementContentById(html, 'catAll', escapeHtml(translate(translationIndex, language, 'faq_page.cat_all', 'All questions')));
  html = replaceElementContentById(html, 'catPricing', escapeHtml(translate(translationIndex, language, 'faq_page.cat_pricing', 'Pricing')));
  html = replaceElementContentById(html, 'catFeatures', escapeHtml(translate(translationIndex, language, 'faq_page.cat_features', 'Features')));
  html = replaceElementContentById(html, 'catSupport', escapeHtml(translate(translationIndex, language, 'faq_page.cat_support', 'Support')));
  html = replaceElementContentById(html, 'backHomeBtn', escapeHtml(translate(translationIndex, language, 'button.back_home', 'Home')));
  html = setAttributeById(html, 'backHomeBtn', 'href', homePath(language));
  html = replaceElementContentById(
    html,
    'faqCopyright',
    escapeHtml(translate(translationIndex, language, 'footer.copyright', '© 2026 MakeTrades. All rights reserved.'))
  );
  html = replaceElementContentById(html, 'allFAQItems', items.map(faqItem).join(''));
  return html;
}

function replaceJsonLdByType(html, type, data) {
  const re = new RegExp(`(<script type="application\\/ld\\+json">\\s*\\{[\\s\\S]*?"@type"\\s*:\\s*"${type}"[\\s\\S]*?\\}\\s*<\\/script>)`, 'i');
  return html.replace(re, () => `<script type="application/ld+json">\n${escapeScriptJson(data)}\n    </script>`);
}

function optimizeHomeStylesheetLoading(html) {
  const nonCriticalStylesheetRe =
    /\s*<link rel="stylesheet" href="\/assets\/[^"]+\.css" media="print" onload="this\.media='all'" \/>\s*<noscript><\/noscript>/i;

  let nextHtml = html.replace(nonCriticalStylesheetRe, '');
  nextHtml = nextHtml.replace(
    /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/i,
    (_match, href) =>
      `<link rel="stylesheet" crossorigin href="${href}" media="print" onload="this.media='all'" />\n    <noscript><link rel="stylesheet" crossorigin href="${href}" /></noscript>`
  );

  return nextHtml;
}

function patchHomeHtml(template, posts, faqItems, translationIndex) {
  const visiblePosts = languagePosts(posts, 'ru', { visibleOnly: true }).slice(0, 3);
  const faq = faqItems.filter(item => item.language === 'ru').slice(0, 4);

  let html = optimizeHomeStylesheetLoading(template);
  html = html.replace(/href="\/blog\.html" class="btn btn-secondary" id="allArticlesBtn"/, 'href="/blog/ru/" class="btn btn-secondary" id="allArticlesBtn"');
  html = html.replace(/href="\/faq\.html" class="btn btn-secondary" id="allFaqBtn"/, 'href="/faq/ru/" class="btn btn-secondary" id="allFaqBtn"');
  html = replaceElementContentById(html, 'blogGrid', visiblePosts.map(post => blogCard(post, 'ru', translationIndex)).join(''));
  html = replaceElementContentById(html, 'faqList', faq.map(faqItem).join(''));
  return html;
}

function isoDate(value) {
  return String(value || new Date().toISOString()).split('T')[0];
}

function sitemapUrlEntry({ loc, lastmod, changefreq, priority, alternates = [] }) {
  const alternateXml = alternates
    .map(alternate => `    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.lang)}" href="${escapeXml(alternate.href)}" />`)
    .join('\n');

  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${escapeXml(changefreq)}</changefreq>
    <priority>${escapeXml(priority)}</priority>${alternateXml ? `\n${alternateXml}` : ''}
  </url>`;
}

function blogOrFaqAlternates(kind) {
  const urlFor = kind === 'faq' ? faqUrl : blogIndexUrl;
  return [
    ...LANGUAGES.map(language => ({ lang: language, href: urlFor(language) })),
    { lang: 'x-default', href: urlFor('ru') },
  ];
}

function articleAlternates(post, clusters) {
  const siblings = articleSiblings(post, clusters);
  const defaultPost = siblings.find(sibling => sibling.language === 'ru') || siblings[0] || post;
  return [
    ...siblings.map(sibling => ({ lang: sibling.language, href: articleUrl(sibling) })),
    { lang: 'x-default', href: articleUrl(defaultPost) },
  ];
}

function generateSitemap(posts, clusters) {
  const today = isoDate(new Date().toISOString());
  const newestPostDate = posts[0]?.updated_at ? isoDate(posts[0].updated_at) : today;
  const urls = [
    sitemapUrlEntry({
      loc: BASE_URL,
      lastmod: today,
      changefreq: 'weekly',
      priority: '1.0',
    }),
    ...LANGUAGES.map(language => sitemapUrlEntry({
      loc: blogIndexUrl(language),
      lastmod: newestPostDate,
      changefreq: 'daily',
      priority: language === 'ru' ? '0.9' : '0.8',
      alternates: blogOrFaqAlternates('blog'),
    })),
    ...LANGUAGES.map(language => sitemapUrlEntry({
      loc: faqUrl(language),
      lastmod: today,
      changefreq: 'weekly',
      priority: language === 'ru' ? '0.8' : '0.7',
      alternates: blogOrFaqAlternates('faq'),
    })),
    ...posts.map(post => sitemapUrlEntry({
      loc: articleUrl(post),
      lastmod: isoDate(post.updated_at || post.created_at),
      changefreq: 'monthly',
      priority: post.hidden_from_users ? '0.6' : '0.75',
      alternates: articleAlternates(post, clusters),
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
}

function redirectEntries(posts) {
  return posts
    .filter(post => (post.legacy_slug || post.slug) !== (post.canonical_slug || post.slug))
    .map(post => ({
      language: post.language,
      legacy_slug: post.legacy_slug || post.slug,
      canonical_slug: post.canonical_slug || post.slug,
      from_path: legacyArticlePath(post),
      from_url: legacyArticleUrl(post),
      to_path: articlePath(post),
      to_url: articleUrl(post),
      title: post.title,
    }));
}

function netlifyRedirects(entries) {
  return `${entries.flatMap(entry => [
    `${entry.from_path.slice(0, -1)} ${entry.to_path} 301!`,
    `${entry.from_path} ${entry.to_path} 301!`,
  ]).join('\n')}\n`;
}

async function writeTextFile(filePath, content) {
  await mkdir(join(filePath, '..'), { recursive: true }).catch(() => {});
  await writeFile(filePath, content, 'utf8');
}

async function writeIndexHtml(directoryPath, content) {
  await mkdir(directoryPath, { recursive: true });
  await writeFile(join(directoryPath, 'index.html'), content, 'utf8');
}

async function writeSitemap(xml) {
  if (sitemapOnly) {
    await writeFile(join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8');
  }

  try {
    await writeFile(join(DIST_DIR, 'sitemap.xml'), xml, 'utf8');
  } catch (error) {
    if (!sitemapOnly) throw error;
  }
}

async function writeRedirectArtifacts(entries) {
  const manifestJson = `${JSON.stringify(entries, null, 2)}\n`;

  if (sitemapOnly) {
    await writeFile(join(PUBLIC_DIR, 'blog-slug-redirects.json'), manifestJson, 'utf8');
  }

  try {
    await writeFile(join(DIST_DIR, 'blog-slug-redirects.json'), manifestJson, 'utf8');
    await writeFile(join(DIST_DIR, '_redirects'), netlifyRedirects(entries), 'utf8');
  } catch (error) {
    if (!sitemapOnly) throw error;
  }
}

async function generateSeoFiles(data) {
  const { posts, publishedCount, faqItems, translations } = data;
  const clusters = makeClusters(posts);
  const translationIndex = buildTranslationsIndex(translations);
  const sitemap = generateSitemap(posts, clusters);
  const redirects = redirectEntries(posts);
  await writeSitemap(sitemap);
  await writeRedirectArtifacts(redirects);

  if (sitemapOnly) {
    console.log(`[seo-build] Generated sitemap with ${publishedCount} published article URLs.`);
    console.log(`[seo-build] Generated ${redirects.length} legacy slug redirect mappings.`);
    return;
  }

  const articleTemplate = await readFile(join(DIST_DIR, 'blog-post.html'), 'utf8');
  const blogTemplate = await readFile(join(DIST_DIR, 'blog.html'), 'utf8');
  const faqTemplate = await readFile(join(DIST_DIR, 'faq.html'), 'utf8');
  const homeTemplate = await readFile(join(DIST_DIR, 'index.html'), 'utf8');
  const optimizedHomeTemplate = await inlineDeferredHomeBootstrap(homeTemplate);

  await writeFile(
    join(DIST_DIR, 'index.html'),
    patchHomeHtml(optimizedHomeTemplate, posts, faqItems, translationIndex),
    'utf8'
  );

  for (const language of LANGUAGES) {
    const blogHtml = blogIndexHtml(blogTemplate, language, posts, translationIndex);
    const faqHtml = faqIndexHtml(faqTemplate, language, faqItems, translationIndex);

    await writeIndexHtml(join(DIST_DIR, 'blog', language), blogHtml);
    await writeIndexHtml(join(DIST_DIR, 'faq', language), faqHtml);

    if (language === 'ru') {
      await writeFile(join(DIST_DIR, 'blog.html'), blogHtml, 'utf8');
      await writeFile(join(DIST_DIR, 'faq.html'), faqHtml, 'utf8');
    }
  }

  for (const post of posts) {
    const html = articleHtml(articleTemplate, post, posts, clusters, translationIndex);
    const outputPath = postFilePath(post);
    await mkdir(join(outputPath, '..'), { recursive: true }).catch(() => {});
    await writeFile(outputPath, html, 'utf8');

    if ((post.legacy_slug || post.slug) !== (post.canonical_slug || post.slug)) {
      const legacyOutputPath = legacyPostFilePath(post);
      await mkdir(join(legacyOutputPath, '..'), { recursive: true }).catch(() => {});
      await writeFile(legacyOutputPath, redirectHtml(post), 'utf8');
    }
  }

  console.log(`[seo-build] Generated ${publishedCount} SEO-ready article pages.`);
  console.log(`[seo-build] Generated blog and FAQ indexes for ${LANGUAGES.length} languages.`);
  console.log(`[seo-build] Generated sitemap with ${publishedCount} published article URLs.`);
  console.log(`[seo-build] Generated ${redirects.length} legacy slug redirects.`);
}

async function main() {
  const config = await readSupabasePublicConfig();
  const data = await fetchSeoData(config);

  await generateSeoFiles(data);
}

main().catch(error => {
  console.error('[seo-build] Failed:', error);
  process.exitCode = 1;
});
