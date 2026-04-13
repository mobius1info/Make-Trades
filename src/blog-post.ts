import { getBlogLocale, renderBlogCard } from './blog-card';
import { getBlogArticleState } from './blog-article-groups';
import { loadTranslations } from './content-loader';
import {
  fetchPublishedBlogPost,
  fetchRelatedBlogPosts,
  fetchVisibleBlogPosts,
  incrementPostViews,
  insertPublicRow,
  type PublicBlogPost,
} from './public-api';
import {
  absoluteImageUrl,
  getPostImageAttributes,
  seoPostImageUrl,
  sanitizeArticleHtmlImages,
  syncResolvedImageUrls,
} from './post-images';
import {
  articleAbsoluteUrl,
  articleHref,
  articlePath,
  blogIndexAbsoluteUrl,
  blogIndexHref,
  getArticleSlugFromPath,
  getBlogLanguageFromPath,
  isProductionBuild,
  legacyArticlePath,
} from './seo-urls';
import { resolveLegacyArticleSlug, resolvePublicArticleSlug } from './article-slugs';
import { supabaseAnonKey, supabaseUrl } from './supabase-config';

const params = new URLSearchParams(window.location.search);
let currentLanguage = getBlogLanguageFromPath(window.location.pathname) || params.get('lang') || 'ru';
let translations: Record<string, string> = {};
let currentPost: BlogPost | null = null;
let translationsLoaded = false;

declare global {
  interface Window {
    __MAKETRADES_PRERENDERED_POST__?: BlogPost;
  }
}

interface BlogPost extends PublicBlogPost {
  views?: number;
  canonical_slug?: string;
  legacy_slug?: string;
  alternates?: Array<{
    language: string;
    slug: string;
    legacy_slug?: string;
  }>;
}

const OG_LOCALES: Record<string, string> = {
  ru: 'ru_RU',
  en: 'en_US',
  de: 'de_DE',
  uk: 'uk_UA',
  zh: 'zh_CN',
};

function t(key: string, fallback: string): string {
  return translations[key] || fallback;
}

function getLocale(): string {
  return getBlogLocale(currentLanguage);
}

function getOgLocale(language: string): string {
  return OG_LOCALES[language] || 'en_US';
}

function getSlugFromUrl(): string | null {
  return getArticleSlugFromPath(window.location.pathname) || new URLSearchParams(window.location.search).get('slug');
}

function getCanonicalTargetUrl(post: BlogPost): string {
  if (!post.canonical_target_slug || post.canonical_target_slug === post.slug) {
    return articleAbsoluteUrl(post, post.language || currentLanguage);
  }

  return articleAbsoluteUrl(
    {
      ...post,
      slug: post.canonical_target_slug,
      canonical_slug: post.canonical_target_slug,
      legacy_slug: post.canonical_target_slug,
    },
    post.language || currentLanguage
  );
}

function buildPostAlternates(post: BlogPost): Array<{ language: string; slug: string; legacy_slug?: string }> {
  if (post.alternates && post.alternates.length > 0) {
    return post.alternates;
  }

  const state = getBlogArticleState(post);
  return (state.alternates || []).map(alternate => ({
    language: alternate.language,
    slug: alternate.slug,
    legacy_slug: alternate.slug,
  }));
}

function normalizePost(post: BlogPost): BlogPost {
  const state = getBlogArticleState(post);

  return {
    ...post,
    ...state,
    alternates: buildPostAlternates(post),
  };
}

function replaceAlternateLinks(post: BlogPost, pageUrl: string) {
  document.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]').forEach(link => link.remove());

  const alternates = buildPostAlternates(post);
  const normalizedAlternates =
    alternates.length > 0
      ? alternates
      : [
          {
            language: post.language || currentLanguage,
            slug: resolvePublicArticleSlug(post),
          },
        ];

  const defaultAlternate =
    normalizedAlternates.find(alternate => alternate.language === 'ru') || normalizedAlternates[0] || null;

  const fragment = document.createDocumentFragment();

  normalizedAlternates.forEach(alternate => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = alternate.language;
    link.href = articleAbsoluteUrl(
      {
        ...post,
        language: alternate.language,
        slug: alternate.slug,
        canonical_slug: alternate.slug,
        legacy_slug: alternate.legacy_slug || alternate.slug,
      },
      alternate.language
    );
    fragment.appendChild(link);
  });

  const defaultLink = document.createElement('link');
  defaultLink.rel = 'alternate';
  defaultLink.hreflang = 'x-default';
  defaultLink.href = defaultAlternate
    ? articleAbsoluteUrl(
        {
          ...post,
          language: defaultAlternate.language,
          slug: defaultAlternate.slug,
          canonical_slug: defaultAlternate.slug,
          legacy_slug: defaultAlternate.legacy_slug || defaultAlternate.slug,
        },
        defaultAlternate.language
      )
    : pageUrl;
  fragment.appendChild(defaultLink);

  document.head.appendChild(fragment);
}

function applyHeroImageAttributes(imageEl: HTMLImageElement, post: BlogPost) {
  const image = getPostImageAttributes(post.image_url, post.slug, 'hero');

  imageEl.src = image.src;
  imageEl.alt = post.title;
  imageEl.dataset.postSlug = post.slug;
  imageEl.dataset.imageKind = 'hero';
  imageEl.loading = 'eager';
  imageEl.decoding = 'async';
  imageEl.fetchPriority = 'high';
  imageEl.width = image.width;
  imageEl.height = image.height;

  if (image.srcset) {
    imageEl.srcset = image.srcset;
  } else {
    imageEl.removeAttribute('srcset');
  }

  if (image.sizes) {
    imageEl.sizes = image.sizes;
  } else {
    imageEl.removeAttribute('sizes');
  }
}

function updatePageContent() {
  const setById = (id: string, key: string, fallback: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key, fallback);
  };

  setById('loadingText', 'blog_post.loading', 'Loading article...');
  setById('errorTitle', 'blog_post.not_found_title', 'Article not found');
  setById('errorDesc', 'blog_post.not_found_desc', 'Unfortunately, the requested article was not found.');
  setById('errorBackBtn', 'blog_post.back_to_blog', 'Back to blog');
  setById('backBlogBtn', 'button.blog', 'Blog');
  setById('authorRole', 'blog_post.author_role', 'MakeTrades Expert');
  setById('postCtaTitle', 'blog_post.cta_title', 'Ready to launch your brokerage platform?');
  setById('postCtaDesc', 'blog_post.cta_desc', 'MakeTrades provides all the tools you need for a successful start');
  setById('postCtaBtn', 'blog_post.cta_button', 'Request demo');
  setById('relatedTitle', 'blog_post.related', 'Related articles');
  setById('postCopyright', 'footer.copyright', '© 2026 MakeTrades. All rights reserved.');

  const backBlogLink = document.getElementById('backBlogBtn') as HTMLAnchorElement;
  if (backBlogLink) backBlogLink.href = blogIndexHref(currentLanguage);

  const errorBackLink = document.getElementById('errorBackBtn') as HTMLAnchorElement;
  if (errorBackLink) errorBackLink.href = blogIndexHref(currentLanguage);
}

async function setLanguage(lang: string) {
  const oldLang = currentLanguage;
  currentLanguage = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');

  const alternate = currentPost?.alternates?.find(item => item.language === lang);
  if (alternate) {
    const targetHref = articleHref(
      {
        slug: alternate.legacy_slug || alternate.slug,
        legacy_slug: alternate.legacy_slug,
        canonical_slug: alternate.slug,
        language: lang,
      },
      lang
    );

    window.location.assign(targetHref);
    return;
  }

  if (currentPost?.content_status && currentPost.content_status !== 'core') {
    window.location.assign(blogIndexHref(lang));
    return;
  }

  let slug = getSlugFromUrl();
  if (slug) {
    const newSlug = slug.replace(new RegExp(`-${oldLang}$`), `-${lang}`);
    slug = newSlug;
  }

  if (slug) {
    const nextPath = (getArticleSlugFromPath(window.location.pathname) || isProductionBuild())
      ? articlePath(slug, lang)
      : legacyArticlePath(slug, lang);
    window.history.replaceState({}, '', nextPath);
  }

  translations = await loadTranslations(lang);
  updatePageContent();
  updateDemoFormContent();

  if (slug) loadBlogPost(slug);
}

function updateMetaTags(post: BlogPost) {
  const postUrl = articleAbsoluteUrl(post, post.language || currentLanguage);
  const canonicalUrl = getCanonicalTargetUrl(post);

  document.title = post.meta_title || `${post.title} | MakeTrades`;

  const metaDescription = document.getElementById('page-description') as HTMLMetaElement;
  if (metaDescription) metaDescription.content = post.meta_description || post.excerpt || '';

  const metaKeywords = document.getElementById('page-keywords') as HTMLMetaElement;
  if (metaKeywords && post.tags) metaKeywords.content = post.tags.join(', ');

  const canonical = document.getElementById('page-canonical') as HTMLLinkElement;
  if (canonical) canonical.href = canonicalUrl;

  const robots = document.getElementById('page-robots') as HTMLMetaElement | null;
  if (robots) {
    robots.content = post.indexable ? 'index, follow' : 'noindex, follow';
  }

  const ogTitle = document.getElementById('og-title') as HTMLMetaElement;
  if (ogTitle) ogTitle.content = post.title;

  const ogDescription = document.getElementById('og-description') as HTMLMetaElement;
  if (ogDescription) ogDescription.content = post.excerpt || '';

  const ogImage = document.getElementById('og-image') as HTMLMetaElement;
  const postImageUrl = seoPostImageUrl(post.image_url, post.slug);
  const postImageAbsoluteUrl = absoluteImageUrl(postImageUrl);

  if (ogImage) ogImage.content = postImageAbsoluteUrl;

  const ogUrl = document.getElementById('og-url') as HTMLMetaElement;
  if (ogUrl) ogUrl.content = postUrl;

  const ogLocale = document.querySelector('meta[property="og:locale"]') as HTMLMetaElement | null;
  if (ogLocale) ogLocale.content = getOgLocale(post.language || currentLanguage);

  const twitterUrl = document.getElementById('twitter-url') as HTMLMetaElement;
  if (twitterUrl) twitterUrl.content = postUrl;

  const twitterTitle = document.getElementById('twitter-title') as HTMLMetaElement;
  if (twitterTitle) twitterTitle.content = post.title;

  const twitterDescription = document.getElementById('twitter-description') as HTMLMetaElement;
  if (twitterDescription) twitterDescription.content = post.excerpt || '';

  const twitterImage = document.getElementById('twitter-image') as HTMLMetaElement;
  if (twitterImage) twitterImage.content = postImageAbsoluteUrl;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || '',
    "image": postImageAbsoluteUrl,
    "author": { "@type": "Person", "name": post.author || 'MakeTrades Team' },
    "publisher": {
      "@type": "Organization",
      "name": "MakeTrades",
      "logo": { "@type": "ImageObject", "url": "https://maketrades.info/assets/logo.svg" }
    },
    "datePublished": post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  const scriptTag = document.getElementById('structured-data');
  if (scriptTag) scriptTag.textContent = JSON.stringify(structuredData);

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "MakeTrades", "item": "https://maketrades.info" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": blogIndexAbsoluteUrl(post.language || currentLanguage) },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": canonicalUrl }
    ]
  };
  const breadcrumbTag = document.getElementById('breadcrumb-data');
  if (breadcrumbTag) breadcrumbTag.textContent = JSON.stringify(breadcrumbData);

  document.getElementById('faq-data')?.remove();
  replaceAlternateLinks(post, postUrl);
}

function hasPrerenderedRelatedPosts(): boolean {
  return Boolean(document.querySelector('#related-posts-grid .blog-card'));
}

function hasInternalLinks(): boolean {
  return Boolean(document.querySelector('.internal-links'));
}

function runWhenIdle(task: () => void) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => task(), { timeout: 2500 });
    return;
  }

  setTimeout(task, 300);
}

function canReusePrerenderedShell(): boolean {
  return Boolean(getBlogLanguageFromPath(window.location.pathname)) && Boolean(window.__MAKETRADES_PRERENDERED_POST__);
}

async function ensureTranslationsLoaded() {
  if (translationsLoaded) return;

  translations = await loadTranslations(currentLanguage);
  translationsLoaded = true;
  updatePageContent();
  updateDemoFormContent();
}

function schedulePostView(postId: string) {
  runWhenIdle(() => {
    void recordPostView(postId);
  });
}

async function recordPostView(postId: string) {
  try {
    await incrementPostViews(postId);
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

function hydratePrerenderedPost(post: BlogPost) {
  const normalizedPost = normalizePost(post);
  currentPost = normalizedPost;
  currentLanguage = normalizedPost.language || currentLanguage;
  document.documentElement.lang = currentLanguage;
  updateMetaTags(normalizedPost);

  const imageEl = document.getElementById('post-image') as HTMLImageElement | null;
  if (imageEl) {
    applyHeroImageAttributes(imageEl, normalizedPost);
  }

  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const contentEl = document.getElementById('post-content');
  if (loadingEl) loadingEl.style.display = 'none';
  if (errorEl) errorEl.style.display = 'none';
  if (contentEl) contentEl.style.display = 'block';

  syncResolvedImageUrls(contentEl || document);

  runWhenIdle(() => {
    if (!hasPrerenderedRelatedPosts() && normalizedPost.category) {
      void loadRelatedPosts(normalizedPost.category, normalizedPost.id);
    }

    if (!hasInternalLinks()) {
      void addInternalLinks(normalizedPost.tags || []);
    }
  });
}

function renderBlogPost(post: BlogPost) {
  const normalizedPost = normalizePost(post);
  currentPost = normalizedPost;
  currentLanguage = normalizedPost.language || currentLanguage;
  document.documentElement.lang = currentLanguage;
  updateMetaTags(normalizedPost);

  const titleEl = document.getElementById('post-title');
  if (titleEl) titleEl.textContent = normalizedPost.title;

  const excerptEl = document.getElementById('post-excerpt');
  if (excerptEl) excerptEl.textContent = normalizedPost.excerpt || '';

  const categoryEl = document.getElementById('post-category');
  if (categoryEl) categoryEl.textContent = normalizedPost.category || '';

  const dateEl = document.getElementById('post-date');
  if (dateEl) {
    dateEl.textContent = new Date(normalizedPost.created_at).toLocaleDateString(
      getLocale(), { year: 'numeric', month: 'long', day: 'numeric' }
    );
    dateEl.setAttribute('datetime', normalizedPost.created_at);
  }

  const readingTimeEl = document.getElementById('post-reading-time');
  if (readingTimeEl) {
    readingTimeEl.textContent = `${normalizedPost.reading_time || 5} ${t('blog_post.min_read', 'min read')}`;
  }

  const authorEl = document.getElementById('post-author');
  if (authorEl) authorEl.textContent = normalizedPost.author || 'MakeTrades Team';

  const imageEl = document.getElementById('post-image') as HTMLImageElement;
  if (imageEl) {
    applyHeroImageAttributes(imageEl, normalizedPost);
  }

  const textEl = document.getElementById('post-text');
  if (textEl) textEl.innerHTML = sanitizeArticleHtmlImages(normalizedPost.content || '', normalizedPost.slug);

  const tagsEl = document.getElementById('post-tags');
  if (tagsEl && normalizedPost.tags && normalizedPost.tags.length > 0) {
    tagsEl.innerHTML = `<strong>${t('blog_post.tags', 'Tags:')}</strong> ` + normalizedPost.tags.map(tag =>
      `<span class="tag">${tag}</span>`
    ).join('');
  }

  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const contentEl = document.getElementById('post-content');
  if (loadingEl) loadingEl.style.display = 'none';
  if (errorEl) errorEl.style.display = 'none';
  if (contentEl) contentEl.style.display = 'block';

  syncResolvedImageUrls(contentEl || document);

  runWhenIdle(() => {
    if (!hasPrerenderedRelatedPosts()) {
      if (normalizedPost.category) {
        void loadRelatedPosts(normalizedPost.category, normalizedPost.id);
      }
    }

    if (!hasInternalLinks()) {
      void addInternalLinks(normalizedPost.tags || []);
    }
  });
}

async function loadBlogPost(slug: string) {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const contentEl = document.getElementById('post-content');

  if (loadingEl) loadingEl.style.display = 'block';
  if (errorEl) errorEl.style.display = 'none';
  if (contentEl) contentEl.style.display = 'none';

  try {
    const post = await fetchPublishedBlogPost(slug, currentLanguage);

    if (!post) {
      if (loadingEl) loadingEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'block';
      return;
    }

    renderBlogPost(post as BlogPost);
    schedulePostView(post.id);

  } catch (error) {
    console.error('Error loading blog post:', error);
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'block';
  }
}

async function addInternalLinks(tags: string[]) {
  if (!tags || tags.length === 0 || hasInternalLinks()) return;

  const linksContainer = document.createElement('div');
  linksContainer.className = 'internal-links';
  linksContainer.innerHTML = `<h3>${t('blog_post.related_topics', 'Related topics:')}</h3>`;

  try {
    const posts = await fetchVisibleBlogPosts(currentLanguage, 50);
    if (!posts) return;

    const relatedByTags = posts
      .filter(post => post.tags && post.tags.some((tag: string) => tags.includes(tag)))
      .filter(post => post.id !== currentPost?.id)
      .slice(0, 5);

    if (relatedByTags.length > 0) {
      const linksList = document.createElement('ul');
      relatedByTags.forEach(post => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${articleHref(post, currentLanguage)}">${post.title}</a>`;
        linksList.appendChild(li);
      });
      linksContainer.appendChild(linksList);

      const textEl = document.getElementById('post-text');
      if (textEl && textEl.parentNode) {
        textEl.parentNode.insertBefore(linksContainer, textEl.nextSibling);
      }
    }
  } catch (error) {
    console.error('Error adding internal links:', error);
  }
}

async function loadRelatedPosts(category: string, currentPostId: string) {
  const gridEl = document.getElementById('related-posts-grid');
  if (!gridEl) return;

  try {
    const posts = await fetchRelatedBlogPosts(currentLanguage, category, currentPostId, 3);

    if (!posts || posts.length === 0) {
      const relatedSection = document.querySelector('.related-posts') as HTMLElement;
      if (relatedSection) relatedSection.style.display = 'none';
      return;
    }

    gridEl.innerHTML = posts
      .map(post =>
        renderBlogCard(post, currentLanguage, {
          minReadLabel: t('blog_page.min_read', 'min'),
        })
      )
      .join('');
    syncResolvedImageUrls(gridEl);
  } catch (error) {
    console.error('Error loading related posts:', error);
  }
}

function openModal(modal: HTMLElement) {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal: HTMLElement) {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

function showFieldError(input: HTMLInputElement, message: string) {
  const field = input.closest('.form-field');
  if (!field) return;
  input.classList.add('input-error');
  const errorEl = document.createElement('div');
  errorEl.className = 'field-error';
  errorEl.textContent = message;
  field.appendChild(errorEl);
  requestAnimationFrame(() => errorEl.classList.add('visible'));
}

function clearFieldError(input: HTMLInputElement) {
  const field = input.closest('.form-field');
  if (!field) return;
  input.classList.remove('input-error');
  field.querySelector('.field-error')?.remove();
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showBonusModal() {
  const demoModal = document.getElementById('demoModal');
  if (demoModal) closeModal(demoModal);
  const bonusModal = document.getElementById('bonusModal');
  if (bonusModal) {
    openModal(bonusModal);
    const closeBtn = bonusModal.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => closeModal(bonusModal), { once: true });
    bonusModal.addEventListener('click', (e) => {
      if (e.target === bonusModal) closeModal(bonusModal);
    }, { once: true });
  }
}

async function handleDemoRequest(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  form.querySelectorAll('.field-error').forEach(el => el.remove());
  form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

  const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]')!;
  const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]')!;
  const brokerRadio = form.querySelector<HTMLInputElement>('input[name="broker_experience"]:checked');
  const radioGroup = form.querySelector<HTMLElement>('.radio-group');
  const checkbox = form.querySelector<HTMLInputElement>('input[name="not_robot"]');
  const checkboxField = checkbox?.closest('.checkbox-field');
  const existingError = checkboxField?.parentElement?.querySelector('.checkbox-error');

  let hasError = false;

  if (!nameInput.value.trim()) {
    showFieldError(nameInput, t('error.name_required', 'Please enter your name'));
    hasError = true;
  }

  if (!emailInput.value.trim()) {
    showFieldError(emailInput, t('error.email_required', 'Please enter your email'));
    hasError = true;
  } else if (!validateEmail(emailInput.value.trim())) {
    showFieldError(emailInput, t('error.email_invalid', 'Please enter a valid email address'));
    hasError = true;
  }

  if (!brokerRadio) {
    const existingRadioError = radioGroup?.querySelector('.radio-error');
    if (!existingRadioError) {
      const errorEl = document.createElement('div');
      errorEl.className = 'radio-error';
      errorEl.textContent = t('error.broker_experience_required', 'Please select an option');
      radioGroup?.appendChild(errorEl);
      requestAnimationFrame(() => errorEl.classList.add('visible'));
    }
    radioGroup?.classList.add('has-error');
    hasError = true;
  } else {
    const existingRadioError = radioGroup?.querySelector('.radio-error');
    if (existingRadioError) existingRadioError.remove();
    radioGroup?.classList.remove('has-error');
  }

  if (checkbox && !checkbox.checked) {
    if (!existingError) {
      const errorEl = document.createElement('div');
      errorEl.className = 'checkbox-error';
      errorEl.textContent = t('error.robot_check', 'Please confirm you are not a robot');
      checkboxField?.after(errorEl);
      requestAnimationFrame(() => errorEl.classList.add('visible'));
    }
    checkboxField?.classList.add('has-error');
    hasError = true;
  } else {
    if (existingError) existingError.remove();
    checkboxField?.classList.remove('has-error');
  }

  if (hasError) return;

  if (existingError) existingError.remove();
  checkboxField?.classList.remove('has-error');

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = '...';

  const formData = new FormData(form);
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    telegram: (formData.get('telegram') as string) || null,
    broker_experience: formData.get('broker_experience') === 'yes',
  };

  const headers = {
    'Content-Type': 'application/json',
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Prefer': 'return=minimal',
  };

  try {
    await insertPublicRow('demo_requests', data);

    fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        telegram: data.telegram,
        broker_experience: data.broker_experience,
        source: 'blog',
        language: currentLanguage,
      }),
    }).catch(() => {});
  } catch {
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }

  form.reset();
  showBonusModal();
}

function setupModal() {
  const demoModal = document.getElementById('demoModal');
  const ctaBtn = document.getElementById('postCtaBtn');

  const openDemoRequestModal = async () => {
    if (canReusePrerenderedShell() && !translationsLoaded) {
      await ensureTranslationsLoaded();
    }

    if (demoModal) openModal(demoModal);
  };

  ctaBtn?.addEventListener('click', () => {
    void openDemoRequestModal();
  });

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal') as HTMLElement;
      if (modal) closeModal(modal);
    });
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal as HTMLElement);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active').forEach(modal => {
        closeModal(modal as HTMLElement);
      });
    }
  });

  const demoForm = document.getElementById('demoForm');
  demoForm?.addEventListener('submit', handleDemoRequest);

  demoForm?.querySelectorAll<HTMLInputElement>('input').forEach(input => {
    input.addEventListener('input', () => clearFieldError(input));
  });

  const robotCheckbox = demoForm?.querySelector<HTMLInputElement>('input[name="not_robot"]');
  robotCheckbox?.addEventListener('change', () => {
    const field = robotCheckbox.closest('.checkbox-field');
    const error = field?.parentElement?.querySelector('.checkbox-error');
    if (robotCheckbox.checked) {
      error?.classList.remove('visible');
      setTimeout(() => error?.remove(), 200);
      field?.classList.remove('has-error');
    }
  });

  demoForm?.querySelectorAll<HTMLInputElement>('input[name="broker_experience"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const group = radio.closest('.radio-group');
      const error = group?.querySelector('.radio-error');
      if (error) {
        error.classList.remove('visible');
        setTimeout(() => error.remove(), 200);
      }
      group?.classList.remove('has-error');
    });
  });
}

function updateDemoFormContent() {
  const demoForm = document.getElementById('demoForm');
  if (!demoForm) return;

  const setById = (id: string, key: string, fallback: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key, fallback);
  };

  setById('demoModalTitle', 'modal.demo_title', 'Request Demo Account');

  const nameInput = demoForm.querySelector<HTMLInputElement>('input[name="name"]');
  const emailInput = demoForm.querySelector<HTMLInputElement>('input[name="email"]');
  const telegramInput = demoForm.querySelector<HTMLInputElement>('input[name="telegram"]');
  if (nameInput) nameInput.placeholder = t('form.name', 'Your name');
  if (emailInput) emailInput.placeholder = t('form.email', 'Email');
  if (telegramInput) telegramInput.placeholder = t('form.telegram', 'Telegram (optional)');

  demoForm.querySelectorAll('[data-translate="form.broker_experience"]').forEach(el => {
    el.textContent = t('form.broker_experience', 'Have you had experience working as a broker?');
  });
  demoForm.querySelectorAll('[data-translate="form.yes"]').forEach(el => {
    el.textContent = t('form.yes', 'Yes');
  });
  demoForm.querySelectorAll('[data-translate="form.no"]').forEach(el => {
    el.textContent = t('form.no', 'No');
  });

  demoForm.querySelectorAll('[data-translate="form.not_robot"]').forEach(label => {
    label.textContent = t('form.not_robot', 'I am not a robot');
  });

  const submitBtn = demoForm.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (submitBtn) submitBtn.textContent = t('form.request', 'Request');
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

  if (!canReusePrerenderedShell()) {
    await ensureTranslationsLoaded();
  }

  setupModal();

  const prerenderedPost = window.__MAKETRADES_PRERENDERED_POST__;
  const slug = getSlugFromUrl();
  const prerenderedPublicSlug = prerenderedPost ? resolvePublicArticleSlug(prerenderedPost) : null;
  const prerenderedLegacySlug = prerenderedPost ? resolveLegacyArticleSlug(prerenderedPost) : null;
  if (prerenderedPost && (!slug || slug === prerenderedPublicSlug || slug === prerenderedLegacySlug)) {
    hydratePrerenderedPost(prerenderedPost);
    schedulePostView(prerenderedPost.id);
  } else if (slug) {
    void loadBlogPost(slug);
  } else {
    const errorEl = document.getElementById('error');
    const loadingEl = document.getElementById('loading');
    if (errorEl) errorEl.style.display = 'block';
    if (loadingEl) loadingEl.style.display = 'none';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
