import { loadTranslations } from './content-loader';
import { normalizePostImageUrl, setupImageFallbacks } from './image-fallbacks';
import {
  articleAbsoluteUrl,
  articleHref,
  blogIndexPath,
  getBlogLanguageFromPath,
  isProductionBuild,
  legacyBlogIndexPath,
} from './seo-urls';
import { supabase } from './supabase';

let currentLanguage =
  getBlogLanguageFromPath(window.location.pathname) ||
  new URLSearchParams(window.location.search).get('lang') ||
  'ru';
let translations: Record<string, string> = {};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  language: string;
  published: boolean;
  hidden_from_users: boolean;
  created_at: string;
  author: string;
  category: string;
  tags: string[];
  reading_time: number;
}

function t(key: string, fallback: string): string {
  return translations[key] || fallback;
}

async function setLanguage(lang: string) {
  currentLanguage = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');

  const url = new URL(window.location.href);
  if (getBlogLanguageFromPath(url.pathname) || isProductionBuild()) {
    window.history.replaceState({}, '', blogIndexPath(lang));
  } else {
    window.history.replaceState({}, '', legacyBlogIndexPath(lang));
  }

  translations = await loadTranslations(lang);
  updatePageContent();
  loadAllBlogPosts();
}

function updatePageContent() {
  const setById = (id: string, key: string, fallback: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key, fallback);
  };

  setById('blogPageTitle', 'blog_page.title', 'MakeTrades Blog');
  setById('blogPageSubtitle', 'blog_page.subtitle', 'Useful articles about creating a brokerage company, trading strategies and managing financial platforms');
  setById('blogCopyright', 'footer.copyright', '© 2026 MakeTrades. All rights reserved.');
  setById('backHomeBtn', 'button.back_home', 'Home');

  const backHomeLink = document.getElementById('backHomeBtn') as HTMLAnchorElement;
  if (backHomeLink) backHomeLink.href = currentLanguage === 'ru' ? '/' : `/?lang=${currentLanguage}`;
}

function getLocale(): string {
  const locales: Record<string, string> = {
    ru: 'ru-RU', en: 'en-US', de: 'de-DE', uk: 'uk-UA', zh: 'zh-CN'
  };
  return locales[currentLanguage] || 'en-US';
}

async function loadAllBlogPosts() {
  const blogGrid = document.getElementById('allBlogPosts');
  if (!blogGrid) return;

  blogGrid.innerHTML = `<p style="text-align: center;">${t('blog_page.loading', 'Loading articles...')}</p>`;

  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('language', currentLanguage)
      .eq('published', true)
      .eq('hidden_from_users', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!posts || posts.length === 0) {
      blogGrid.innerHTML = `<p style="text-align: center; color: var(--neutral-500);">${t('blog_page.empty', 'Articles coming soon')}</p>`;
      return;
    }

    const minLabel = t('blog_page.min_read', 'min');

    blogGrid.innerHTML = posts.map((post: BlogPost) => `
      <a href="${articleHref(post.slug, currentLanguage)}" class="blog-card fade-in" itemscope itemtype="https://schema.org/BlogPosting">
        <img src="${normalizePostImageUrl(post.image_url, post.slug)}"
             alt="${post.title}"
             class="blog-card-image"
             itemprop="image"
             data-fallback-image="${normalizePostImageUrl(null, post.slug)}"
             loading="lazy">
        <div class="blog-card-content">
          <div class="blog-card-category">${post.category || ''}</div>
          <h3 itemprop="headline">${post.title}</h3>
          <p itemprop="description">${post.excerpt}</p>
          <div class="blog-card-meta">
            <span itemprop="author" itemscope itemtype="https://schema.org/Person">
              <span itemprop="name">${post.author}</span>
            </span>
            <span>&bull;</span>
            <time itemprop="datePublished" datetime="${post.created_at}">
              ${new Date(post.created_at).toLocaleDateString(getLocale())}
            </time>
            <span>&bull;</span>
            <span>${post.reading_time || 5} ${minLabel}</span>
          </div>
        </div>
        <meta itemprop="url" content="${articleAbsoluteUrl(post.slug, currentLanguage)}">
      </a>
    `).join('');
    setupImageFallbacks(blogGrid);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    blogGrid.innerHTML = `<p style="text-align: center; color: var(--error-500);">${t('blog.error', 'Error loading articles')}</p>`;
  }
}

async function init() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang) setLanguage(lang);
    });
  });
  document.querySelector(`[data-lang="${currentLanguage}"]`)?.classList.add('active');

  translations = await loadTranslations(currentLanguage);
  updatePageContent();
  setupImageFallbacks();
  loadAllBlogPosts();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
