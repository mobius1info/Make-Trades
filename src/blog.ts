import { renderBlogCard } from './blog-card';
import { loadTranslations } from './content-loader';
import { fetchVisibleBlogPosts, type PublicBlogPost } from './public-api';
import { syncResolvedImageUrls } from './post-images';
import {
  blogIndexPath,
  getBlogLanguageFromPath,
  isProductionBuild,
  legacyBlogIndexPath,
} from './seo-urls';

let currentLanguage =
  getBlogLanguageFromPath(window.location.pathname) ||
  new URLSearchParams(window.location.search).get('lang') ||
  'ru';
let translations: Record<string, string> = {};
let translationsLoaded = false;

function t(key: string, fallback: string): string {
  return translations[key] || fallback;
}

function hasPrerenderedPosts(): boolean {
  return Boolean(document.querySelector('#allBlogPosts .blog-card'));
}

function canReusePrerenderedShell(): boolean {
  return Boolean(getBlogLanguageFromPath(window.location.pathname)) && hasPrerenderedPosts();
}

async function ensureTranslationsLoaded() {
  if (translationsLoaded) return;

  translations = await loadTranslations(currentLanguage);
  translationsLoaded = true;
  updatePageContent();
}

async function setLanguage(lang: string) {
  if (getBlogLanguageFromPath(window.location.pathname) || isProductionBuild()) {
    window.location.assign(blogIndexPath(lang));
    return;
  }

  currentLanguage = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');
  window.history.replaceState({}, '', legacyBlogIndexPath(lang));

  translations = await loadTranslations(lang);
  updatePageContent();
  await loadAllBlogPosts(true);
}

function updatePageContent() {
  const setById = (id: string, key: string, fallback: string) => {
    const element = document.getElementById(id);
    if (element) element.textContent = t(key, fallback);
  };

  setById('blogPageTitle', 'blog_page.title', 'MakeTrades Blog');
  setById(
    'blogPageSubtitle',
    'blog_page.subtitle',
    'Useful articles about creating a brokerage company, trading strategies and managing financial platforms'
  );
  setById('blogCopyright', 'footer.copyright', '© 2026 MakeTrades. All rights reserved.');
  setById('backHomeBtn', 'button.back_home', 'Home');

  const backHomeLink = document.getElementById('backHomeBtn') as HTMLAnchorElement | null;
  if (backHomeLink) backHomeLink.href = currentLanguage === 'ru' ? '/' : `/?lang=${currentLanguage}`;
}

function renderBlogPosts(blogGrid: HTMLElement, posts: PublicBlogPost[]) {
  const minLabel = t('blog_page.min_read', 'min');

  blogGrid.innerHTML = posts
    .map(
      (post, index) =>
        renderBlogCard(post, currentLanguage, {
          minReadLabel: minLabel,
          prioritizeImage: index === 0,
        })
    )
    .join('');

  syncResolvedImageUrls(blogGrid);
}

async function loadAllBlogPosts(force: boolean = false) {
  const blogGrid = document.getElementById('allBlogPosts');
  if (!blogGrid) return;

  if (!force && hasPrerenderedPosts()) {
    syncResolvedImageUrls(blogGrid);
    return;
  }

  blogGrid.innerHTML = `<p style="text-align: center;">${t('blog_page.loading', 'Loading articles...')}</p>`;

  try {
    const posts = await fetchVisibleBlogPosts(currentLanguage);

    if (!posts || posts.length === 0) {
      blogGrid.innerHTML = `<p style="text-align: center; color: var(--neutral-500);">${t(
        'blog_page.empty',
        'Articles coming soon'
      )}</p>`;
      return;
    }

    renderBlogPosts(blogGrid, posts);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    blogGrid.innerHTML = `<p style="text-align: center; color: var(--error-500);">${t(
      'blog.error',
      'Error loading articles'
    )}</p>`;
  }
}

async function init() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang) {
        void setLanguage(lang);
      }
    });
  });
  document.querySelector(`[data-lang="${currentLanguage}"]`)?.classList.add('active');

  if (!canReusePrerenderedShell()) {
    await ensureTranslationsLoaded();
  }

  const prerenderedGrid = document.getElementById('allBlogPosts');
  if (prerenderedGrid && hasPrerenderedPosts()) {
    syncResolvedImageUrls(prerenderedGrid);
  }

  await loadAllBlogPosts();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    void init();
  });
} else {
  void init();
}
