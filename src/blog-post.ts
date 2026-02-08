import { createClient } from '@supabase/supabase-js';
import { loadTranslations } from './content-loader';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const params = new URLSearchParams(window.location.search);
let currentLanguage = params.get('lang') || 'ru';
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
  updated_at: string;
  author: string;
  category: string;
  tags: string[];
  reading_time: number;
  meta_title: string;
  meta_description: string;
  views: number;
}

function t(key: string, fallback: string): string {
  return translations[key] || fallback;
}

function getLocale(): string {
  const locales: Record<string, string> = {
    ru: 'ru-RU', en: 'en-US', de: 'de-DE', uk: 'uk-UA', zh: 'zh-CN'
  };
  return locales[currentLanguage] || 'en-US';
}

function getSlugFromUrl(): string | null {
  return params.get('slug');
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
  if (backBlogLink) backBlogLink.href = `/blog.html?lang=${currentLanguage}`;

  const errorBackLink = document.getElementById('errorBackBtn') as HTMLAnchorElement;
  if (errorBackLink) errorBackLink.href = `/blog.html?lang=${currentLanguage}`;
}

async function setLanguage(lang: string) {
  const oldLang = currentLanguage;
  currentLanguage = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');

  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);

  let slug = getSlugFromUrl();
  if (slug) {
    const newSlug = slug.replace(new RegExp(`-${oldLang}$`), `-${lang}`);
    url.searchParams.set('slug', newSlug);
    slug = newSlug;
  }

  window.history.replaceState({}, '', url.toString());

  translations = await loadTranslations(lang);
  updatePageContent();
  updateDemoFormContent();

  if (slug) loadBlogPost(slug);
}

function updateMetaTags(post: BlogPost) {
  document.title = post.meta_title || `${post.title} | MakeTrades`;

  const metaDescription = document.getElementById('page-description') as HTMLMetaElement;
  if (metaDescription) metaDescription.content = post.meta_description || post.excerpt;

  const metaKeywords = document.getElementById('page-keywords') as HTMLMetaElement;
  if (metaKeywords && post.tags) metaKeywords.content = post.tags.join(', ');

  const canonical = document.getElementById('page-canonical') as HTMLLinkElement;
  if (canonical) canonical.href = `https://maketrades.space/blog-post.html?slug=${post.slug}`;

  const ogTitle = document.getElementById('og-title') as HTMLMetaElement;
  if (ogTitle) ogTitle.content = post.title;

  const ogDescription = document.getElementById('og-description') as HTMLMetaElement;
  if (ogDescription) ogDescription.content = post.excerpt;

  const ogImage = document.getElementById('og-image') as HTMLMetaElement;
  if (ogImage) ogImage.content = post.image_url || 'https://maketrades.space/og-image.jpg';

  const ogUrl = document.getElementById('og-url') as HTMLMetaElement;
  if (ogUrl) ogUrl.content = `https://maketrades.space/blog-post.html?slug=${post.slug}`;

  const twitterTitle = document.getElementById('twitter-title') as HTMLMetaElement;
  if (twitterTitle) twitterTitle.content = post.title;

  const twitterDescription = document.getElementById('twitter-description') as HTMLMetaElement;
  if (twitterDescription) twitterDescription.content = post.excerpt;

  const twitterImage = document.getElementById('twitter-image') as HTMLMetaElement;
  if (twitterImage) twitterImage.content = post.image_url || 'https://maketrades.space/twitter-image.jpg';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image_url,
    "author": { "@type": "Person", "name": post.author },
    "publisher": {
      "@type": "Organization",
      "name": "MakeTrades",
      "logo": { "@type": "ImageObject", "url": "https://maketrades.space/logo.svg" }
    },
    "datePublished": post.created_at,
    "dateModified": post.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://maketrades.space/blog-post.html?slug=${post.slug}`
    }
  };

  const scriptTag = document.getElementById('structured-data');
  if (scriptTag) scriptTag.textContent = JSON.stringify(structuredData);

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "MakeTrades", "item": "https://maketrades.space" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://maketrades.space/blog.html" },
      { "@type": "ListItem", "position": 3, "name": post.title }
    ]
  };
  const breadcrumbTag = document.getElementById('breadcrumb-data');
  if (breadcrumbTag) breadcrumbTag.textContent = JSON.stringify(breadcrumbData);
}

async function incrementViews(postId: string) {
  try {
    await supabase.rpc('increment_post_views', { post_id: postId });
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

async function loadBlogPost(slug: string) {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const contentEl = document.getElementById('post-content');

  if (loadingEl) loadingEl.style.display = 'block';
  if (errorEl) errorEl.style.display = 'none';
  if (contentEl) contentEl.style.display = 'none';

  try {
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('language', currentLanguage)
      .eq('published', true)
      .maybeSingle();

    if (error) throw error;

    if (!post) {
      if (loadingEl) loadingEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'block';
      return;
    }

    updateMetaTags(post);
    incrementViews(post.id);

    const titleEl = document.getElementById('post-title');
    if (titleEl) titleEl.textContent = post.title;

    const excerptEl = document.getElementById('post-excerpt');
    if (excerptEl) excerptEl.textContent = post.excerpt;

    const categoryEl = document.getElementById('post-category');
    if (categoryEl) categoryEl.textContent = post.category || '';

    const dateEl = document.getElementById('post-date');
    if (dateEl) {
      dateEl.textContent = new Date(post.created_at).toLocaleDateString(
        getLocale(), { year: 'numeric', month: 'long', day: 'numeric' }
      );
      dateEl.setAttribute('datetime', post.created_at);
    }

    const readingTimeEl = document.getElementById('post-reading-time');
    if (readingTimeEl) {
      readingTimeEl.textContent = `${post.reading_time || 5} ${t('blog_post.min_read', 'min read')}`;
    }

    const authorEl = document.getElementById('post-author');
    if (authorEl) authorEl.textContent = post.author;

    const imageEl = document.getElementById('post-image') as HTMLImageElement;
    if (imageEl) {
      imageEl.src = post.image_url || 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800';
      imageEl.alt = post.title;
    }

    const textEl = document.getElementById('post-text');
    if (textEl) textEl.innerHTML = post.content;

    const tagsEl = document.getElementById('post-tags');
    if (tagsEl && post.tags && post.tags.length > 0) {
      tagsEl.innerHTML = `<strong>${t('blog_post.tags', 'Tags:')}</strong> ` + post.tags.map(tag =>
        `<span class="tag">${tag}</span>`
      ).join('');
    }

    loadRelatedPosts(post.category, post.id);

    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';

  } catch (error) {
    console.error('Error loading blog post:', error);
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'block';
  }
}

async function loadRelatedPosts(category: string, currentPostId: string) {
  const gridEl = document.getElementById('related-posts-grid');
  if (!gridEl) return;

  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('language', currentLanguage)
      .eq('published', true)
      .eq('hidden_from_users', false)
      .eq('category', category)
      .neq('id', currentPostId)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) throw error;

    if (!posts || posts.length === 0) {
      const relatedSection = document.querySelector('.related-posts') as HTMLElement;
      if (relatedSection) relatedSection.style.display = 'none';
      return;
    }

    gridEl.innerHTML = posts.map((post: BlogPost) => `
      <a href="/blog-post.html?slug=${post.slug}&lang=${currentLanguage}" class="blog-card fade-in">
        <img src="${post.image_url || 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400'}"
             alt="${post.title}"
             class="blog-card-image"
             loading="lazy">
        <div class="blog-card-content">
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="blog-card-meta">
            <span>${post.author}</span>
            <span>&bull;</span>
            <time datetime="${post.created_at}">
              ${new Date(post.created_at).toLocaleDateString(getLocale())}
            </time>
          </div>
        </div>
      </a>
    `).join('');
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

function showFormMessage(form: HTMLFormElement, text: string, type: 'success' | 'error') {
  form.querySelectorAll('.form-message').forEach(el => el.remove());
  const el = document.createElement('div');
  el.className = `form-message form-message--${type}`;
  const icon = type === 'success'
    ? '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15"/><path d="M6 10.5l2.5 2.5 5.5-5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    : '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15"/><path d="M10 6v5M10 13.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  el.innerHTML = `${icon}<span>${text}</span>`;
  form.appendChild(el);
  requestAnimationFrame(() => el.classList.add('visible'));

  if (type === 'success') {
    setTimeout(() => {
      el.classList.remove('visible');
      setTimeout(() => {
        el.remove();
        form.closest('.modal')?.classList.remove('active');
      }, 300);
    }, 3000);
  } else {
    setTimeout(() => {
      el.classList.remove('visible');
      setTimeout(() => el.remove(), 300);
    }, 5000);
  }
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleDemoRequest(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  form.querySelectorAll('.field-error').forEach(el => el.remove());
  form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

  const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]')!;
  const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]')!;
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

  const formData = new FormData(form);
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    telegram: formData.get('telegram') as string || null,
  };

  try {
    const { error } = await supabase.from('demo_requests').insert([data]);
    if (error) throw error;
    showFormMessage(form, t('success.demo_submitted', 'Thank you! We will contact you shortly.'), 'success');
    form.reset();
  } catch (error) {
    console.error('Error submitting demo request:', error);
    showFormMessage(form, t('error.submit_failed', 'An error occurred. Please try again later.'), 'error');
  }
}

function setupModal() {
  const demoModal = document.getElementById('demoModal');
  const ctaBtn = document.getElementById('postCtaBtn');

  ctaBtn?.addEventListener('click', () => {
    if (demoModal) openModal(demoModal);
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

  translations = await loadTranslations(currentLanguage);
  updatePageContent();
  updateDemoFormContent();
  setupModal();

  const slug = getSlugFromUrl();
  if (slug) {
    loadBlogPost(slug);
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
