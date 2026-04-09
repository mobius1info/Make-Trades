import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT_DIR = process.cwd();
const DIST_DIR = join(ROOT_DIR, 'dist');
const PUBLIC_DIR = join(ROOT_DIR, 'public');
const BASE_URL = 'https://maketrades.info';
const LANGUAGES = ['ru', 'en', 'de', 'uk', 'zh'];
const DEFAULT_ARTICLE_IMAGE = 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800';
const DEFAULT_CARD_IMAGE = 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400';
const sitemapOnly = process.argv.includes('--sitemap-only');

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

async function readSupabasePublicConfig() {
  const source = await readFile(join(ROOT_DIR, 'src', 'supabase.ts'), 'utf8');
  const defaultUrl = source.match(/supabaseUrl[^\n]*\|\| '([^']+)'/)?.[1];
  const defaultAnonKey = source.match(/supabaseAnonKey[^\n]*\|\| '([^']+)'/)?.[1];

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

  return { posts, publishedCount, faqItems };
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
  return `/blog/${encodeURIComponent(post.language)}/${encodeURIComponent(post.slug)}/`;
}

function articleUrl(post) {
  return `${BASE_URL}${articlePath(post)}`;
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
  if (post.slug.includes('/') || post.slug.includes('\\') || post.language.includes('/') || post.language.includes('\\')) {
    throw new Error(`Unsafe blog post path: ${post.language}/${post.slug}`);
  }

  return join(DIST_DIR, 'blog', post.language, post.slug, 'index.html');
}

function languagePosts(posts, language, { visibleOnly = false } = {}) {
  return posts
    .filter(post => post.language === language && (!visibleOnly || !post.hidden_from_users))
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
}

function clusterKey(post) {
  const match = post.slug.match(/^(.+)-(ru|en|de|uk|zh)$/);
  return match ? `suffix:${match[1]}` : `single:${post.language}:${post.slug}`;
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
    const attrRe = new RegExp(`\\s${attribute}="[^"]*"`, 'i');
    const nextAttr = ` ${attribute}="${escapeHtml(value)}"`;
    const nextAttrs = attrRe.test(attrs)
      ? attrs.replace(attrRe, nextAttr)
      : `${attrs}${nextAttr}`;
    return `<${tagName}${nextAttrs}>`;
  });
}

function setMetaName(html, name, content) {
  const re = new RegExp(`(<meta\\s+name="${name}"[^>]*\\scontent=")[^"]*("[^>]*>)`, 'i');
  return html.replace(re, `$1${escapeHtml(content)}$2`);
}

function setMetaProperty(html, property, content) {
  const re = new RegExp(`(<meta\\s+property="${property}"[^>]*\\scontent=")[^"]*("[^>]*>)`, 'i');
  return html.replace(re, `$1${escapeHtml(content)}$2`);
}

function setCanonical(html, url) {
  return html.replace(/(<link\s+rel="canonical"[^>]*\shref=")[^"]*("[^>]*>)/i, `$1${escapeHtml(url)}$2`);
}

function replaceElementContentById(html, id, content) {
  const re = new RegExp(`(<([a-z0-9]+)\\b[^>]*\\bid="${id}"[^>]*>)[\\s\\S]*?(<\\/\\2>)`, 'i');
  return html.replace(re, `$1${content}$3`);
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
    image: post.image_url || `${BASE_URL}/og-image.jpg`,
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
        url: `${BASE_URL}/logo.svg`,
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
    .filter(candidate => candidate.language === post.language && candidate.slug !== post.slug)
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

function blogCard(post, language = post.language) {
  return `
      <a href="${articlePath(post)}" class="blog-card fade-in" itemscope itemtype="https://schema.org/BlogPosting">
        <img src="${escapeHtml(post.image_url || DEFAULT_CARD_IMAGE)}"
             alt="${escapeHtml(post.title)}"
             class="blog-card-image"
             itemprop="image"
             loading="lazy">
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
            <span>${escapeHtml(post.reading_time || 5)} min</span>
          </div>
        </div>
        <meta itemprop="url" content="${escapeHtml(articleUrl(post))}">
      </a>`;
}

function faqItem(item) {
  return `
      <div class="faq-item fade-in" data-faq-id="${escapeHtml(item.id)}" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
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

function articleHtml(template, post, posts, clusters) {
  const title = metaTitle(post);
  const description = metaDescription(post);
  const keywords = postKeywords(post);
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const related = relatedPostsFor(post, posts);

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
  html = setAttributeById(html, 'og-image', 'content', post.image_url || `${BASE_URL}/og-image.jpg`);
  html = setAttributeById(html, 'twitter-url', 'content', articleUrl(post));
  html = setAttributeById(html, 'twitter-title', 'content', post.title);
  html = setAttributeById(html, 'twitter-description', 'content', description);
  html = setAttributeById(html, 'twitter-image', 'content', post.image_url || `${BASE_URL}/twitter-image.jpg`);
  html = replaceAlternateLinks(html, articleAlternateLinks(post, clusters));
  html = replaceJsonLdById(html, 'structured-data', articleStructuredData(post));
  html = replaceJsonLdById(html, 'breadcrumb-data', breadcrumbData(post));

  html = html.replace(/<div id="loading" style="([^"]*)">/i, '<div id="loading" style="display: none; $1">');
  html = setAttributeById(html, 'post-content', 'style', 'display: block');
  html = replaceElementContentById(html, 'post-category', escapeHtml(post.category || ''));
  html = replaceElementContentById(html, 'post-date', escapeHtml(formatDate(post.created_at, post.language)));
  html = setAttributeById(html, 'post-date', 'datetime', post.created_at);
  html = replaceElementContentById(html, 'post-reading-time', `${escapeHtml(post.reading_time || 5)} min`);
  html = replaceElementContentById(html, 'post-title', escapeHtml(post.title));
  html = replaceElementContentById(html, 'post-excerpt', escapeHtml(post.excerpt || description));
  html = replaceElementContentById(html, 'post-author', escapeHtml(post.author || 'MakeTrades Team'));
  html = setAttributeById(html, 'post-image', 'src', post.image_url || DEFAULT_ARTICLE_IMAGE);
  html = setAttributeById(html, 'post-image', 'alt', post.title);
  html = replaceElementContentById(html, 'post-text', post.content || `<p>${escapeHtml(post.excerpt || description)}</p>`);
  html = replaceElementContentById(
    html,
    'post-tags',
    tags.length > 0
      ? `<strong>Tags:</strong> ${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}`
      : ''
  );
  html = replaceElementContentById(html, 'related-posts-grid', related.map(post => blogCard(post)).join(''));
  html = insertBeforeEntryScript(
    html,
    `<script>window.__MAKETRADES_PRERENDERED_POST__=${escapeScriptJson(post)};</script>`
  );

  return html;
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
        url: `${BASE_URL}/logo.svg`,
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

function blogIndexHtml(template, language, posts) {
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
  html = replaceElementContentById(html, 'allBlogPosts', visiblePosts.map(post => blogCard(post, language)).join(''));
  return html;
}

function faqIndexHtml(template, language, faqItems) {
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
  html = replaceElementContentById(html, 'allFAQItems', items.map(faqItem).join(''));
  return html;
}

function replaceJsonLdByType(html, type, data) {
  const re = new RegExp(`(<script type="application\\/ld\\+json">\\s*\\{[\\s\\S]*?"@type"\\s*:\\s*"${type}"[\\s\\S]*?\\}\\s*<\\/script>)`, 'i');
  return html.replace(re, `<script type="application/ld+json">\n${escapeScriptJson(data)}\n    </script>`);
}

function patchHomeHtml(template, posts, faqItems) {
  const visiblePosts = languagePosts(posts, 'ru', { visibleOnly: true }).slice(0, 3);
  const faq = faqItems.filter(item => item.language === 'ru').slice(0, 4);

  let html = template;
  html = html.replace(/href="\/blog\.html" class="btn btn-secondary" id="allArticlesBtn"/, 'href="/blog/ru/" class="btn btn-secondary" id="allArticlesBtn"');
  html = html.replace(/href="\/faq\.html" class="btn btn-secondary" id="allFaqBtn"/, 'href="/faq/ru/" class="btn btn-secondary" id="allFaqBtn"');
  html = replaceElementContentById(html, 'blogGrid', visiblePosts.map(post => blogCard(post, 'ru')).join(''));
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

async function generateSeoFiles(data) {
  const { posts, publishedCount, faqItems } = data;
  const clusters = makeClusters(posts);
  const sitemap = generateSitemap(posts, clusters);
  await writeSitemap(sitemap);

  if (sitemapOnly) {
    console.log(`[seo-build] Generated sitemap with ${publishedCount} published article URLs.`);
    return;
  }

  const articleTemplate = await readFile(join(DIST_DIR, 'blog-post.html'), 'utf8');
  const blogTemplate = await readFile(join(DIST_DIR, 'blog.html'), 'utf8');
  const faqTemplate = await readFile(join(DIST_DIR, 'faq.html'), 'utf8');
  const homeTemplate = await readFile(join(DIST_DIR, 'index.html'), 'utf8');

  await writeFile(join(DIST_DIR, 'index.html'), patchHomeHtml(homeTemplate, posts, faqItems), 'utf8');

  for (const language of LANGUAGES) {
    const blogHtml = blogIndexHtml(blogTemplate, language, posts);
    const faqHtml = faqIndexHtml(faqTemplate, language, faqItems);

    await writeIndexHtml(join(DIST_DIR, 'blog', language), blogHtml);
    await writeIndexHtml(join(DIST_DIR, 'faq', language), faqHtml);

    if (language === 'ru') {
      await writeFile(join(DIST_DIR, 'blog.html'), blogHtml, 'utf8');
      await writeFile(join(DIST_DIR, 'faq.html'), faqHtml, 'utf8');
    }
  }

  for (const post of posts) {
    const html = articleHtml(articleTemplate, post, posts, clusters);
    const outputPath = postFilePath(post);
    await mkdir(join(outputPath, '..'), { recursive: true }).catch(() => {});
    await writeFile(outputPath, html, 'utf8');
  }

  console.log(`[seo-build] Generated ${publishedCount} SEO-ready article pages.`);
  console.log(`[seo-build] Generated blog and FAQ indexes for ${LANGUAGES.length} languages.`);
  console.log(`[seo-build] Generated sitemap with ${publishedCount} published article URLs.`);
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
