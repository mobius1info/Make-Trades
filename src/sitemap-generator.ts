import { supabase } from './supabase';
import { articleAbsoluteUrl, homeAbsoluteUrl } from './seo-urls';
import { enrichBlogArticle, isIndexableBlogArticle } from './blog-article-groups';

interface BlogPost {
  title: string;
  slug: string;
  language: string;
  updated_at: string;
  created_at: string;
  hidden_from_users?: boolean;
}

export async function generateSitemap(): Promise<string> {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('title, slug, language, updated_at, created_at, hidden_from_users')
    .eq('published', true)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts for sitemap:', error);
    return '';
  }

  const today = new Date().toISOString().split('T')[0];
  const baseUrl = 'https://maketrades.info';
  const indexablePosts = (posts || []).map(post => enrichBlogArticle(post)).filter(isIndexableBlogArticle);
  const homeLanguages = ['ru', 'en', 'de', 'uk', 'zh'] as const;
  const homeAlternates = [
    `    <xhtml:link rel="alternate" hreflang="ru" href="${homeAbsoluteUrl('ru')}" />`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${homeAbsoluteUrl('en')}" />`,
    `    <xhtml:link rel="alternate" hreflang="de" href="${homeAbsoluteUrl('de')}" />`,
    `    <xhtml:link rel="alternate" hreflang="uk" href="${homeAbsoluteUrl('uk')}" />`,
    `    <xhtml:link rel="alternate" hreflang="zh" href="${homeAbsoluteUrl('zh')}" />`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${homeAbsoluteUrl('ru')}" />`,
  ].join('\n');
  const homeUrls = homeLanguages
    .map((language, index) => `  <url>
    <loc>${homeAbsoluteUrl(language)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${index === 0 ? '1.0' : '0.9'}</priority>
${homeAlternates}
  </url>`)
    .join('\n\n');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

${homeUrls}

  <url>
    <loc>${baseUrl}/blog/ru/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/blog/ru/" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/blog/en/" />
    <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}/blog/de/" />
    <xhtml:link rel="alternate" hreflang="uk" href="${baseUrl}/blog/uk/" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/blog/zh/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/blog/ru/" />
  </url>

  <url>
    <loc>${baseUrl}/faq/ru/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/faq/ru/" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/faq/en/" />
    <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}/faq/de/" />
    <xhtml:link rel="alternate" hreflang="uk" href="${baseUrl}/faq/uk/" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/faq/zh/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/faq/ru/" />
  </url>

`;

  indexablePosts.forEach((post: BlogPost & { alternates?: Array<{ language: string; slug: string }> }) => {
    const lastmod = (post.updated_at || post.created_at).split('T')[0];
    const url = articleAbsoluteUrl(post);
    const alternates = (post.alternates || [])
      .map(alternate => `    <xhtml:link rel="alternate" hreflang="${alternate.language}" href="${articleAbsoluteUrl({ ...post, language: alternate.language, slug: alternate.slug, canonical_slug: alternate.slug }, alternate.language)}" />`)
      .join('\n');
    const defaultAlternate = post.alternates?.find(alternate => alternate.language === 'ru') || post.alternates?.[0];
    const xDefault = defaultAlternate
      ? `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${articleAbsoluteUrl({ ...post, language: defaultAlternate.language, slug: defaultAlternate.slug, canonical_slug: defaultAlternate.slug }, defaultAlternate.language)}" />`
      : '';

    xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
${alternates ? `${alternates}` : ''}${xDefault}
  </url>
`;
  });

  xml += `
</urlset>`;

  return xml;
}

export async function downloadSitemap() {
  const xml = await generateSitemap();
  if (!xml) return;

  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
