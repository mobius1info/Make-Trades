import { supabase } from './supabase';

interface BlogPost {
  slug: string;
  language: string;
  updated_at: string;
}

export async function generateSitemap(): Promise<string> {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, language, updated_at')
    .eq('published', true)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts for sitemap:', error);
    return '';
  }

  const today = new Date().toISOString().split('T')[0];
  const baseUrl = 'https://maketrades.info';

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}?lang=en" />
    <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}?lang=de" />
    <xhtml:link rel="alternate" hreflang="uk" href="${baseUrl}?lang=uk" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}?lang=zh" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}" />
  </url>

  <url>
    <loc>${baseUrl}/blog.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/blog.html" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/blog.html?lang=en" />
    <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}/blog.html?lang=de" />
    <xhtml:link rel="alternate" hreflang="uk" href="${baseUrl}/blog.html?lang=uk" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/blog.html?lang=zh" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/blog.html" />
  </url>

  <url>
    <loc>${baseUrl}/faq.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="ru" href="${baseUrl}/faq.html" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/faq.html?lang=en" />
    <xhtml:link rel="alternate" hreflang="de" href="${baseUrl}/faq.html?lang=de" />
    <xhtml:link rel="alternate" hreflang="uk" href="${baseUrl}/faq.html?lang=uk" />
    <xhtml:link rel="alternate" hreflang="zh" href="${baseUrl}/faq.html?lang=zh" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/faq.html" />
  </url>

`;

  posts?.forEach((post: BlogPost) => {
    const lastmod = post.updated_at.split('T')[0];
    const langParam = post.language === 'ru' ? '' : `&lang=${post.language}`;
    const url = `${baseUrl}/blog-post.html?slug=${post.slug}${langParam}`;

    xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
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
