import { FAQ_ACCORDION_OPEN_EVENT } from './faq-accordion';
import { loadTranslations } from './content-loader';
import { checkRecentSubmission, fetchFaqItems, fetchVisibleBlogPosts, insertPublicRow } from './public-api';
import { getPostImageAttributes, syncResolvedImageUrls } from './post-images';
import { articleHref, blogIndexHref, faqHref, getHomeLanguageFromPath, homePath } from './seo-urls';
import { supabaseAnonKey, supabaseUrl } from './supabase-config';

const initialDocumentLanguage = document.documentElement.lang || 'ru';
let currentLanguage = getHomeLanguageFromPath(window.location.pathname) || 'ru';
let translations: Record<string, string> = {};
let demoFormOpenedAt = 0;
let pageLoadedAt = Date.now();
let currentCaptchaAnswer = 0;
const isInitialServerLanguage = initialDocumentLanguage === currentLanguage;
let userActivity = {
  mouseMoved: false,
  scrolled: false,
  clicked: false
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    ym?: (...args: any[]) => void;
    __makeTradesAnalytics?: {
      yandexCounterId?: number;
    };
  }
}

let cachedYandexCounterId: number | null = null;

function resolveYandexCounterId(): number | null {
  const globalCounterId = window.__makeTradesAnalytics?.yandexCounterId;
  if (typeof globalCounterId === 'number' && Number.isFinite(globalCounterId) && globalCounterId > 0) {
    return globalCounterId;
  }

  if (cachedYandexCounterId !== null) {
    return cachedYandexCounterId;
  }

  const analyticsLoader = document.querySelector<HTMLScriptElement>('script[src="/analytics-loader.js"][data-ym-id]');
  const parsedCounterId = Number(analyticsLoader?.dataset.ymId || analyticsLoader?.getAttribute('data-ym-id') || '');

  cachedYandexCounterId = Number.isFinite(parsedCounterId) && parsedCounterId > 0 ? parsedCounterId : null;
  return cachedYandexCounterId;
}

function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }

  const yandexCounterId = resolveYandexCounterId();
  if (typeof window.ym === 'function' && yandexCounterId) {
    window.ym(yandexCounterId, 'reachGoal', eventName, eventParams);
  }
}

function hasStaticBlogPreview(): boolean {
  return Boolean(document.querySelector('#blogGrid .blog-card'));
}

function hasStaticFaqPreview(): boolean {
  return Boolean(document.querySelector('#faqList .faq-item'));
}

async function setLanguage(lang: string) {
  const targetPath = homePath(lang);
  if (currentLanguage === lang && window.location.pathname === targetPath) {
    return;
  }

  trackEvent('language_changed', { language: lang });
  window.location.assign(targetPath);
}

function t(key: string, fallback: string): string {
  return translations[key] || fallback;
}

function setText(selector: string, key: string, fallback: string) {
  const el = document.querySelector(selector);
  if (el) el.textContent = t(key, fallback);
}

function setById(id: string, key: string, fallback: string) {
  const el = document.getElementById(id);
  if (el) el.textContent = t(key, fallback);
}

function renderPreviewCardImage(post: {
  image_url?: string | null;
  slug: string;
  shared_image_seed?: string;
  title: string;
}): string {
  const imageSeed = post.shared_image_seed || post.slug;
  const image = getPostImageAttributes(post.image_url, imageSeed, 'card');

  return `<img src="${image.src}"
             alt="${post.title}"
             class="blog-card-image"
             data-post-slug="${imageSeed}"
             data-image-kind="card"
             width="${image.width}"
             height="${image.height}"
             ${image.srcset ? `srcset="${image.srcset}"` : ''}
             ${image.sizes ? `sizes="${image.sizes}"` : ''}
             loading="lazy"
             decoding="async">`;
}

function renderFaqPreviewItems(items: Array<{ id: string; question: string; answer: string }>): string {
  return items
    .map(
      item => `
      <div class="faq-item" data-faq-id="${item.id}">
        <div class="faq-question">
          <span>${item.question}</span>
          <span>+</span>
        </div>
        <div class="faq-answer">
          <div>${item.answer}</div>
        </div>
      </div>
    `
    )
    .join('');
}

function updateHomeFAQSchema(items: Array<{ question: string; answer: string }>) {
  const schemaScript = document.getElementById('homeFaqSchema');
  if (!schemaScript) return;

  schemaScript.textContent = JSON.stringify(
    {
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
    },
    null,
    2
  );
}

async function updateContent() {
  setText('.hero-title', 'hero.title', 'Best solution for creating a broker');
  setText('.hero-subtitle', 'hero.subtitle', 'Turnkey creation of brokers, crypto exchanges and dealing centers with MakeTrades');

  document.querySelectorAll('#requestDemoBtn, #ctaRequestDemoBtn').forEach(btn => {
    btn.textContent = t('button.request_demo', 'Request Demo Account');
  });

  document.querySelectorAll('.feature-badge span').forEach((badge, index) => {
    const key = `hero.badge_${index + 1}`;
    if (translations[key]) badge.textContent = translations[key];
  });

  setById('loginBtnText', 'button.login', 'Personal Account');
  setById('priceFrom', 'pricing.from', 'From');
  setById('pricePeriod', 'pricing.period', 'per month');

  requestAnimationFrame(() => updateContentDeferred());
}

function updateContentDeferred() {
  setText('.features-grid .section-title', 'section.features_title', 'Full functionality for your broker');
  setText('.blog-preview .section-title', 'section.blog_title', 'Useful articles');
  setText('.faq-section .section-title', 'section.faq_title', 'Frequently asked questions');
  setText('.cta-content h2', 'cta.title', 'Ready to start?');
  setText('.cta-content p', 'cta.description', 'Get a demo account and test all platform features for free');

  setById('allArticlesBtn', 'button.all_articles', 'All articles');
  setById('allFaqBtn', 'button.all_questions', 'All questions');
  setById('copyrightText', 'footer.copyright', '© 2026 MakeTrades. All rights reserved.');
  setById('footerAddressLabel', 'footer.address', 'Address');
  setById('footerPhoneLabel', 'footer.phone', 'Phone');
  setById('footerEmailLabel', 'footer.email_label', 'Email');

  document.querySelectorAll('[data-feature]').forEach(card => {
    const feature = card.getAttribute('data-feature');
    const h3 = card.querySelector('h3');
    const p = card.querySelector('p');
    if (h3) h3.textContent = t(`feature.${feature}.title`, h3.textContent || '');
    if (p) p.textContent = t(`feature.${feature}.desc`, p.textContent || '');
  });

  document.querySelectorAll('[data-detail]').forEach(section => {
    const num = section.getAttribute('data-detail');
    const h2 = section.querySelector('h2');
    const p = section.querySelector('.feature-detail-content > p');
    if (h2) h2.textContent = t(`detail${num}.title`, h2.textContent || '');
    if (p) p.textContent = t(`detail${num}.desc`, p.textContent || '');
    section.querySelectorAll('.feature-list li').forEach((li, i) => {
      const span = li.querySelector('span');
      if (span) span.textContent = t(`detail${num}.item${i + 1}`, span.textContent || '');
    });
  });

  const htmlTranslateKeys = new Set(['form.promo_text']);
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (key && translations[key]) {
      if (htmlTranslateKeys.has(key)) {
        el.innerHTML = translations[key];
      } else {
        el.textContent = translations[key];
      }
    }
  });

  requestAnimationFrame(() => updateModalsAndForms());
}

function updateModalsAndForms() {
  setById('demoModalTitle', 'modal.demo_title', 'Request Demo Account');

  const demoFormButton = document.querySelector('#demoForm button[type="submit"]');
  if (demoFormButton) demoFormButton.textContent = t('form.request', 'Request');

  const contactFormButton = document.querySelector('#contactForm button[type="submit"]');
  if (contactFormButton) contactFormButton.textContent = t('form.submit', 'Submit');

  const demoForm = document.getElementById('demoForm');
  if (demoForm) {
    const nameInput = demoForm.querySelector<HTMLInputElement>('input[name="name"]');
    const emailInput = demoForm.querySelector<HTMLInputElement>('input[name="email"]');
    const telegramInput = demoForm.querySelector<HTMLInputElement>('input[name="telegram"]');
    if (nameInput) nameInput.placeholder = t('form.name', 'Your name');
    if (emailInput) emailInput.placeholder = t('form.email', 'Email');
    if (telegramInput) telegramInput.placeholder = t('form.telegram', 'Telegram (optional)');
  }

  setById('loginModalTitle', 'login.title', 'Sign In');
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const emailInput = loginForm.querySelector<HTMLInputElement>('input[name="email"]');
    const passwordInput = loginForm.querySelector<HTMLInputElement>('input[name="password"]');
    if (emailInput) emailInput.placeholder = t('login.email', 'Email');
    if (passwordInput) passwordInput.placeholder = t('login.password', 'Password');
  }
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
  if (loginSubmitBtn) loginSubmitBtn.textContent = t('login.button', 'Log In');

  updatePageLinks();
}

function updatePageLinks() {
  const allArticlesLink = document.getElementById('allArticlesBtn') as HTMLAnchorElement;
  if (allArticlesLink) allArticlesLink.href = blogIndexHref(currentLanguage);

  const allFaqLink = document.getElementById('allFaqBtn') as HTMLAnchorElement;
  if (allFaqLink) allFaqLink.href = faqHref(currentLanguage);
}

async function loadBlogPosts(limit: number = 3, force: boolean = false) {
  const blogGrid = document.getElementById('blogGrid');
  if (!blogGrid) return;

  if (!force && hasStaticBlogPreview()) {
    syncResolvedImageUrls(blogGrid);
    return;
  }

  try {
    const posts = await fetchVisibleBlogPosts(currentLanguage, limit);

    if (!posts || posts.length === 0) {
      blogGrid.innerHTML = `<p style="text-align: center; color: var(--neutral-500);">${t('blog.empty', 'Articles coming soon')}</p>`;
      return;
    }

    blogGrid.innerHTML = posts.map(post => `
      <a href="${articleHref(post, currentLanguage)}" class="blog-card">
        ${renderPreviewCardImage(post)}
        <div class="blog-card-content">
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="blog-card-meta">
            <span>${post.author}</span>
            <span>•</span>
            <span>${new Date(post.created_at).toLocaleDateString(
              currentLanguage === 'ru' ? 'ru-RU' :
              currentLanguage === 'en' ? 'en-US' :
              currentLanguage === 'de' ? 'de-DE' :
              currentLanguage === 'uk' ? 'uk-UA' :
              currentLanguage === 'zh' ? 'zh-CN' : 'en-US'
            )}</span>
          </div>
        </div>
      </a>
    `).join('');
    syncResolvedImageUrls(blogGrid);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    blogGrid.innerHTML = `<p style="text-align: center; color: var(--error-500);">${t('blog.error', 'Error loading articles')}</p>`;
  }
}

async function loadFAQItems(limit: number = 4, force: boolean = false) {
  const faqList = document.getElementById('faqList');
  if (!faqList) return;

  if (!force && hasStaticFaqPreview()) {
    return;
  }

  try {
    const items = await fetchFaqItems(currentLanguage, 'all', limit);

    if (!items || items.length === 0) {
      faqList.innerHTML = `<p style="text-align: center; color: var(--neutral-500);">${t('faq.empty', 'FAQ coming soon')}</p>`;
      updateHomeFAQSchema([]);
      return;
    }

    faqList.innerHTML = renderFaqPreviewItems(items);
    updateHomeFAQSchema(items);
  } catch (error) {
    console.error('Error loading FAQ items:', error);
    faqList.innerHTML = `<p style="text-align: center; color: var(--error-500);">${t('faq.error', 'Error loading FAQ')}</p>`;
    updateHomeFAQSchema([]);
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

function setupModal() {
  const demoModal = document.getElementById('demoModal');
  const loginModal = document.getElementById('loginModal');
  const requestDemoBtn = document.getElementById('requestDemoBtn');
  const ctaRequestDemoBtn = document.getElementById('ctaRequestDemoBtn');
  const loginButton = document.querySelector('a[href="#login"]');

  requestDemoBtn?.addEventListener('click', () => {
    if (demoModal) {
      demoFormOpenedAt = Date.now();
      generateCaptcha();
      openModal(demoModal);
      trackEvent('demo_modal_opened', { language: currentLanguage });
    }
  });
  ctaRequestDemoBtn?.addEventListener('click', () => {
    if (demoModal) {
      demoFormOpenedAt = Date.now();
      generateCaptcha();
      openModal(demoModal);
      trackEvent('demo_modal_opened', { language: currentLanguage });
    }
  });

  loginButton?.addEventListener('click', (e) => {
    e.preventDefault();
    if (loginModal) {
      openModal(loginModal);
      trackEvent('login_modal_opened', { language: currentLanguage });
    }
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

function showFieldError(input: HTMLInputElement | HTMLTextAreaElement, message: string) {
  const field = input.closest('.form-field');
  if (!field) return;
  clearFieldError(input);
  input.classList.add('input-error');
  const errorEl = document.createElement('div');
  errorEl.className = 'field-error';
  errorEl.textContent = message;
  field.appendChild(errorEl);
  requestAnimationFrame(() => errorEl.classList.add('visible'));
}

function clearFieldError(input: HTMLInputElement | HTMLTextAreaElement) {
  const field = input.closest('.form-field');
  if (!field) return;
  input.classList.remove('input-error');
  field.querySelector('.field-error')?.remove();
}

function clearAllFieldErrors(form: HTMLFormElement) {
  form.querySelectorAll('.field-error').forEach(el => el.remove());
  form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
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

function generateCaptcha() {
  const ops = [
    () => { const a = 2 + Math.floor(Math.random() * 18); const b = 1 + Math.floor(Math.random() * a); return { q: `${a} − ${b}`, a: a - b }; },
    () => { const a = 1 + Math.floor(Math.random() * 12); const b = 1 + Math.floor(Math.random() * 12); return { q: `${a} + ${b}`, a: a + b }; },
    () => { const a = 2 + Math.floor(Math.random() * 9); const b = 2 + Math.floor(Math.random() * 5); return { q: `${a} × ${b}`, a: a * b }; },
  ];
  const op = ops[Math.floor(Math.random() * ops.length)]();
  currentCaptchaAnswer = op.a;
  const el = document.getElementById('captchaQuestion');
  if (el) el.textContent = op.q + ' =';
}

async function handleLogin(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  clearAllFieldErrors(form);
  form.querySelectorAll('.form-message').forEach(el => el.remove());

  const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]')!;
  const passwordInput = form.querySelector<HTMLInputElement>('input[name="password"]')!;

  let hasError = false;

  if (!emailInput.value.trim()) {
    showFieldError(emailInput, t('error.login_email_required', 'Please enter your email'));
    hasError = true;
  } else if (!validateEmail(emailInput.value.trim())) {
    showFieldError(emailInput, t('error.login_email_invalid', 'Please enter a valid email address'));
    hasError = true;
  }

  if (!passwordInput.value) {
    showFieldError(passwordInput, t('error.login_password_required', 'Please enter your password'));
    hasError = true;
  }

  if (hasError) return;

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = '...';

  try {
    const { supabase } = await import('./supabase');
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: emailInput.value.trim(),
      password: passwordInput.value,
    });

    if (error) {
      showFormMessage(form, t('error.login_invalid', 'Invalid email or password'), 'error');
      trackEvent('login_failed', { language: currentLanguage });
      return;
    }

    const { data: adminCheck } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', signInData.user.id)
      .maybeSingle();

    if (adminCheck) {
      await supabase.auth.signOut();
      showFormMessage(form, t('error.login_invalid', 'Invalid email or password'), 'error');
      return;
    }

    trackEvent('login_success', { language: currentLanguage });
    const loginModal = document.getElementById('loginModal');
    if (loginModal) closeModal(loginModal);
    form.reset();
    showFormMessage(form, t('login.success', 'You have successfully logged in'), 'success');
  } catch (err) {
    showFormMessage(form, t('error.login_invalid', 'Invalid email or password'), 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

function initCustomSelects(container: HTMLElement | null) {
  if (!container) return;
  container.querySelectorAll<HTMLElement>('.custom-select').forEach(select => {
    const trigger = select.querySelector<HTMLElement>('.custom-select-trigger')!;
    const options = select.querySelectorAll<HTMLElement>('.custom-select-option');
    const hidden = select.closest('.custom-select-group')?.querySelector<HTMLInputElement>('input[type="hidden"]');
    const valueSpan = select.querySelector<HTMLElement>('.custom-select-value')!;

    trigger.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const wasOpen = select.classList.contains('open');
      document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
      if (!wasOpen) select.classList.add('open');
    });

    options.forEach(opt => {
      opt.addEventListener('click', (ev) => {
        ev.stopPropagation();
        options.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        if (hidden) hidden.value = opt.dataset.value || '';
        valueSpan.textContent = opt.textContent || '';
        select.classList.add('selected');
        select.classList.remove('open', 'has-error');
        const group = select.closest('.custom-select-group');
        const error = group?.querySelector('.select-error');
        if (error) {
          error.classList.remove('visible');
          setTimeout(() => error.remove(), 200);
        }
      });
    });

    select.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        trigger.click();
      } else if (ev.key === 'Escape') {
        select.classList.remove('open');
      }
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
  });
}

function resetCustomSelects(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>('.custom-select').forEach(select => {
    select.classList.remove('selected', 'open', 'has-error');
    const valueSpan = select.querySelector<HTMLElement>('.custom-select-value');
    const placeholder = valueSpan?.getAttribute('data-translate');
    if (valueSpan && placeholder) {
      valueSpan.textContent = translations[placeholder] || valueSpan.textContent;
    }
    select.querySelectorAll('.custom-select-option.active').forEach(o => o.classList.remove('active'));
  });
  container.querySelectorAll<HTMLInputElement>('.custom-select-group input[type="hidden"]').forEach(h => {
    h.value = '';
  });
}

async function handleDemoRequest(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  clearAllFieldErrors(form);

  const nameInput = form.querySelector<HTMLInputElement>('input[name="name"]')!;
  const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]')!;
  const referralHidden = form.querySelector<HTMLInputElement>('input[name="referral_source"]')!;
  const customSelect = form.querySelector<HTMLElement>('.custom-select');
  const selectGroup = form.querySelector<HTMLElement>('.custom-select-group');
  const brokerRadio = form.querySelector<HTMLInputElement>('input[name="broker_experience"]:checked');
  const radioGroup = form.querySelector<HTMLElement>('.radio-group');
  const captchaInput = form.querySelector<HTMLInputElement>('#captchaAnswer');
  const captchaField = form.querySelector<HTMLElement>('#captchaField');

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

  if (!referralHidden.value) {
    const existingSelectError = selectGroup?.querySelector('.select-error');
    if (!existingSelectError) {
      const errorEl = document.createElement('div');
      errorEl.className = 'select-error';
      errorEl.textContent = t('error.referral_required', 'Please select how you heard about us');
      selectGroup?.appendChild(errorEl);
      requestAnimationFrame(() => errorEl.classList.add('visible'));
    }
    customSelect?.classList.add('has-error');
    hasError = true;
  } else {
    const existingSelectError = selectGroup?.querySelector('.select-error');
    if (existingSelectError) existingSelectError.remove();
    customSelect?.classList.remove('has-error');
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

  if (captchaInput && captchaField) {
    const userAnswer = parseInt(captchaInput.value.trim(), 10);
    const existingCaptchaError = captchaField.querySelector('.captcha-error');
    if (isNaN(userAnswer) || userAnswer !== currentCaptchaAnswer) {
      if (!existingCaptchaError) {
        const errorEl = document.createElement('div');
        errorEl.className = 'captcha-error';
        errorEl.textContent = t('error.captcha_wrong', 'Wrong answer, try again');
        captchaField.appendChild(errorEl);
        requestAnimationFrame(() => errorEl.classList.add('visible'));
      }
      captchaField.classList.add('has-error');
      generateCaptcha();
      captchaInput.value = '';
      hasError = true;
    } else {
      if (existingCaptchaError) existingCaptchaError.remove();
      captchaField.classList.remove('has-error');
    }
  }

  if (hasError) return;

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = '...';

  const honeypot = form.querySelector<HTMLInputElement>('input[name="website"]');
  if (honeypot && honeypot.value) {
    form.reset();
    resetCustomSelects(form);
    showBonusModal();
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
    return;
  }

  if (demoFormOpenedAt && Date.now() - demoFormOpenedAt < 3000) {
    form.reset();
    resetCustomSelects(form);
    showBonusModal();
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
    return;
  }

  const formData = new FormData(form);
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    telegram: (formData.get('telegram') as string) || null,
    broker_experience: formData.get('broker_experience') === 'yes',
    referral_source: formData.get('referral_source') as string,
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
        referral_source: data.referral_source,
        source: 'demo',
        language: currentLanguage,
      }),
    }).catch(() => {});
  } catch {
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }

  form.reset();
  resetCustomSelects(form);
  showBonusModal();
}

async function handleContactSubmission(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
    telegram: formData.get('telegram') as string || null,
  };

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = '...';

  const headers = {
    'Content-Type': 'application/json',
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Prefer': 'return=minimal',
  };

  try {
    const dupCheck = await checkRecentSubmission(data.email, data.telegram);

    if (dupCheck?.is_duplicate) {
      showFormMessage(form, t('error.duplicate_submission', 'You have already submitted a request. Please wait 24 hours before submitting again.'), 'error');
      return;
    }

    await insertPublicRow('contact_submissions', data);

    fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        telegram: data.telegram,
        message: data.message,
        source: 'contact',
        language: currentLanguage,
      }),
    }).catch(() => {});

    trackEvent('contact_form_submitted', {
      language: currentLanguage,
      has_telegram: !!data.telegram
    });

    const successMsg = translations['success.contact_submitted'] || 'Thank you for your message! We will contact you shortly.';
    showFormMessage(form, successMsg, 'success');
    form.reset();
  } catch (error: any) {
    console.error('Error submitting contact form:', error);
    showFormMessage(form, `Error: ${error?.message || 'Unknown error'}`, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

function setupLanguageSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang) {
        setLanguage(lang);
      }
    });
  });
}

function setupFaqOpenTracking() {
  document.addEventListener(FAQ_ACCORDION_OPEN_EVENT, event => {
    const detail = (event as CustomEvent<{ faqId: string | null }>).detail;

    trackEvent('faq_item_opened', {
      faq_id: detail?.faqId || undefined,
      language: currentLanguage,
    });
  });
}

function handleTelegramClick() {
  const timeOnPage = Date.now() - pageLoadedAt;
  const hasActivity = userActivity.mouseMoved || userActivity.scrolled;

  if (timeOnPage < 2000 || !hasActivity) {
    openVerifyModal();
  } else {
    proceedToTelegram();
  }
}

function proceedToTelegram() {
  const link = document.querySelector('#telegram-button a');
  const url = link?.getAttribute('data-telegram-link');
  if (url) {
    trackEvent('telegram_button_clicked', { language: currentLanguage, verified: true });
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

function openVerifyModal() {
  const modal = document.getElementById('verifyModal');
  const confirmBtn = document.getElementById('confirmVerify');
  const timerSpan = document.getElementById('verifyTimer');

  if (!modal || !confirmBtn || !timerSpan) return;

  let countdown = 3;
  timerSpan.textContent = countdown.toString();
  confirmBtn.setAttribute('disabled', 'true');

  const interval = setInterval(() => {
    countdown--;
    timerSpan.textContent = countdown.toString();

    if (countdown <= 0) {
      clearInterval(interval);
      confirmBtn.removeAttribute('disabled');
      timerSpan.parentElement!.textContent = t('button.confirm', 'Подтвердить');
    }
  }, 1000);

  openModal(modal);
}

function setupVerifyModal() {
  const modal = document.getElementById('verifyModal');
  const confirmBtn = document.getElementById('confirmVerify');
  const cancelBtn = document.getElementById('cancelVerify');

  confirmBtn?.addEventListener('click', () => {
    if (modal) closeModal(modal);
    proceedToTelegram();
  });

  cancelBtn?.addEventListener('click', () => {
    if (modal) closeModal(modal);
  });
}

function trackUserActivity() {
  let mouseMoveTimeout: number;

  document.addEventListener('mousemove', () => {
    clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = window.setTimeout(() => {
      userActivity.mouseMoved = true;
    }, 100);
  }, { once: true });

  document.addEventListener('scroll', () => {
    userActivity.scrolled = true;
  }, { once: true });

  document.addEventListener('click', () => {
    userActivity.clicked = true;
  }, { once: true });
}

async function init() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-lang="${currentLanguage}"]`)?.classList.add('active');

  trackUserActivity();
  setupLanguageSwitcher();
  setupFaqOpenTracking();
  setupModal();
  const prerenderedBlogGrid = document.getElementById('blogGrid');
  if (prerenderedBlogGrid) {
    syncResolvedImageUrls(prerenderedBlogGrid);
  }

  const demoForm = document.getElementById('demoForm');
  const contactForm = document.getElementById('contactForm');

  demoForm?.addEventListener('submit', handleDemoRequest);
  contactForm?.addEventListener('submit', handleContactSubmission);

  [demoForm, contactForm].forEach(form => {
    form?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea').forEach(input => {
      input.addEventListener('input', () => clearFieldError(input));
    });
  });

  const captchaInput = demoForm?.querySelector<HTMLInputElement>('#captchaAnswer');
  captchaInput?.addEventListener('input', () => {
    const captchaField = document.getElementById('captchaField');
    const error = captchaField?.querySelector('.captcha-error');
    if (error) {
      error.classList.remove('visible');
      setTimeout(() => error.remove(), 200);
    }
    captchaField?.classList.remove('has-error');
  });

  initCustomSelects(demoForm);

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

  const telegramButton = document.querySelector('#telegram-button a');
  telegramButton?.addEventListener('click', (e) => {
    e.preventDefault();
    handleTelegramClick();
  });

  setupVerifyModal();

  const loginForm = document.getElementById('loginForm');
  loginForm?.addEventListener('submit', handleLogin);

  loginForm?.querySelectorAll<HTMLInputElement>('input').forEach(input => {
    input.addEventListener('input', () => clearFieldError(input));
  });

  try {
    if (!isInitialServerLanguage) {
      translations = await loadTranslations(currentLanguage);
      await updateContent();
    } else {
      updatePageLinks();
    }

    setupLazyContentLoading();
  } catch (e) {
    console.error('Failed to load content:', e);
  }
}

function setupLazyContentLoading() {
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        if (id === 'blogGrid') loadBlogPosts(3, true);
        if (id === 'faqList') loadFAQItems(4, true);
        lazyObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px 0px' });

  const blogGrid = document.getElementById('blogGrid');
  const faqList = document.getElementById('faqList');
  if (blogGrid && !hasStaticBlogPreview()) lazyObserver.observe(blogGrid);
  if (faqList && !hasStaticFaqPreview()) lazyObserver.observe(faqList);
}

function setupScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce), (hover: none) and (pointer: coarse)').matches) {
    document.querySelectorAll<HTMLElement>('.reveal, .reveal-left, .reveal-right').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

function setupHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init();
    setupScrollAnimations();
    setupHeaderScroll();
  });
} else {
  init();
  setupScrollAnimations();
  setupHeaderScroll();
}
