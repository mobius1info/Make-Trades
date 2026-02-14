import { loadTranslations, loadImages } from './content-loader';
import { supabase, supabaseUrl, supabaseAnonKey } from './supabase';

const params = new URLSearchParams(window.location.search);
let currentLanguage = params.get('lang') || 'ru';
let translations: Record<string, string> = {};
let images: any = {};
let demoFormOpenedAt = 0;
let pageLoadedAt = Date.now();
let userActivity = {
  mouseMoved: false,
  scrolled: false,
  clicked: false
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    ym?: (...args: any[]) => void;
  }
}

function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }

  if (typeof window.ym === 'function') {
    window.ym(parseInt('XXXXXXXX'), 'reachGoal', eventName, eventParams);
  }
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  language: string;
  published: boolean;
  created_at: string;
  author: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  language: string;
  order: number;
  category: string;
}

async function setLanguage(lang: string) {
  currentLanguage = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');

  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url.toString());

  trackEvent('language_changed', { language: lang });

  translations = await loadTranslations(lang);
  await updateContent();
  loadBlogPosts();
  loadFAQItems();
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

async function updateContent() {
  setText('.hero-title', 'hero.title', 'Best solution for creating a broker');
  setText('.hero-subtitle', 'hero.subtitle', 'Turnkey creation of brokers, crypto exchanges and dealing centers with MakeTrades');
  setText('.features-grid .section-title', 'section.features_title', 'Full functionality for your broker');
  setText('.blog-preview .section-title', 'section.blog_title', 'Useful articles');
  setText('.faq-section .section-title', 'section.faq_title', 'Frequently asked questions');
  setText('.cta-content h2', 'cta.title', 'Ready to start?');
  setText('.cta-content p', 'cta.description', 'Get a demo account and test all platform features for free');

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
  setById('allArticlesBtn', 'button.all_articles', 'All articles');
  setById('allFaqBtn', 'button.all_questions', 'All questions');
  setById('demoModalTitle', 'modal.demo_title', 'Request Demo Account');
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

  document.querySelectorAll('[data-translate="form.not_robot"]').forEach(label => {
    label.textContent = t('form.not_robot', 'I am not a robot');
  });

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
    if (telegramInput) telegramInput.placeholder = t('form.telegram_required', 'Telegram');
  }

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

  document.querySelectorAll('[data-translate="form.broker_experience"]').forEach(el => {
    el.textContent = t('form.broker_experience', 'Have you had experience working as a broker?');
  });
  document.querySelectorAll('[data-translate="form.yes"]').forEach(el => {
    el.textContent = t('form.yes', 'Yes');
  });
  document.querySelectorAll('[data-translate="form.no"]').forEach(el => {
    el.textContent = t('form.no', 'No');
  });

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

  const allArticlesLink = document.getElementById('allArticlesBtn') as HTMLAnchorElement;
  if (allArticlesLink) allArticlesLink.href = `/blog.html?lang=${currentLanguage}`;

  const allFaqLink = document.getElementById('allFaqBtn') as HTMLAnchorElement;
  if (allFaqLink) allFaqLink.href = `/faq.html?lang=${currentLanguage}`;
}

async function loadBlogPosts(limit: number = 3) {
  const blogGrid = document.getElementById('blogGrid');
  if (!blogGrid) return;

  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('language', currentLanguage)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    if (!posts || posts.length === 0) {
      blogGrid.innerHTML = `<p style="text-align: center; color: var(--neutral-500);">${t('blog.empty', 'Articles coming soon')}</p>`;
      return;
    }

    blogGrid.innerHTML = posts.map((post: BlogPost) => `
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
  } catch (error) {
    console.error('Error loading blog posts:', error);
    blogGrid.innerHTML = `<p style="text-align: center; color: var(--error-500);">${t('blog.error', 'Error loading articles')}</p>`;
  }
}

async function loadFAQItems(limit: number = 4) {
  const faqList = document.getElementById('faqList');
  if (!faqList) return;

  try {
    const { data: items, error } = await supabase
      .from('faq_items')
      .select('*')
      .eq('language', currentLanguage)
      .order('order', { ascending: true })
      .limit(limit);

    if (error) throw error;

    if (!items || items.length === 0) {
      faqList.innerHTML = `<p style="text-align: center; color: var(--neutral-500);">${t('faq.empty', 'FAQ coming soon')}</p>`;
      return;
    }

    faqList.innerHTML = items.map((item: FAQItem) => `
      <div class="faq-item fade-in" data-faq-id="${item.id}">
        <div class="faq-question">
          <span>${item.question}</span>
          <span>+</span>
        </div>
        <div class="faq-answer">${item.answer}</div>
      </div>
    `).join('');

    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('click', () => {
        const wasActive = item.classList.contains('active');
        item.classList.toggle('active');

        if (!wasActive) {
          const faqId = item.getAttribute('data-faq-id');
          trackEvent('faq_item_opened', { faq_id: faqId, language: currentLanguage });
        }
      });
    });
  } catch (error) {
    console.error('Error loading FAQ items:', error);
    faqList.innerHTML = `<p style="text-align: center; color: var(--error-500);">${t('faq.error', 'Error loading FAQ')}</p>`;
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
      openModal(demoModal);
      trackEvent('demo_modal_opened', { language: currentLanguage });
    }
  });
  ctaRequestDemoBtn?.addEventListener('click', () => {
    if (demoModal) {
      demoFormOpenedAt = Date.now();
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
  const telegramInput = form.querySelector<HTMLInputElement>('input[name="telegram"]')!;
  const referralHidden = form.querySelector<HTMLInputElement>('input[name="referral_source"]')!;
  const customSelect = form.querySelector<HTMLElement>('.custom-select');
  const selectGroup = form.querySelector<HTMLElement>('.custom-select-group');
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

  if (!telegramInput.value.trim()) {
    showFieldError(telegramInput, t('error.telegram_required', 'Please enter your Telegram'));
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

  const honeypot = form.querySelector<HTMLInputElement>('input[name="website"]');
  if (honeypot && honeypot.value) {
    const successMsg = translations['success.demo_submitted'] || 'Thank you! We will contact you shortly.';
    showFormMessage(form, successMsg, 'success');
    form.reset();
    return;
  }

  if (demoFormOpenedAt && Date.now() - demoFormOpenedAt < 3000) {
    const successMsg = translations['success.demo_submitted'] || 'Thank you! We will contact you shortly.';
    showFormMessage(form, successMsg, 'success');
    form.reset();
    return;
  }

  const formData = new FormData(form);

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    telegram: formData.get('telegram') as string,
    broker_experience: formData.get('broker_experience') === 'yes',
    referral_source: formData.get('referral_source') as string,
  };

  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = '...';

  const restUrl = `${supabaseUrl}/rest/v1/demo_requests`;
  const headers = {
    'Content-Type': 'application/json',
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Prefer': 'return=minimal',
  };

  try {
    const { data: dupCheck } = await supabase.rpc('check_recent_submission', {
      p_email: data.email,
      p_telegram: data.telegram,
    });

    if (dupCheck?.is_duplicate) {
      showFormMessage(form, t('error.duplicate_submission', 'You have already submitted a request. Please wait 24 hours before submitting again.'), 'error');
      return;
    }

    const res = await fetch(restUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`${res.status} ${res.statusText}: ${text} [URL: ${restUrl}]`);
    }

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

    trackEvent('demo_request_submitted', {
      language: currentLanguage,
      broker_experience: data.broker_experience
    });

    const successMsg = translations['success.demo_submitted'] || 'Thank you! We will contact you shortly.';
    showFormMessage(form, successMsg, 'success');
    form.reset();
    resetCustomSelects(form);
  } catch (error: any) {
    console.error('Error submitting demo request:', error);
    showFormMessage(form, `Error: ${error?.message || 'Unknown error'}`, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
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

  const restUrl = `${supabaseUrl}/rest/v1/contact_submissions`;
  const headers = {
    'Content-Type': 'application/json',
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Prefer': 'return=minimal',
  };

  try {
    const { data: dupCheck } = await supabase.rpc('check_recent_submission', {
      p_email: data.email,
      p_telegram: data.telegram,
    });

    if (dupCheck?.is_duplicate) {
      showFormMessage(form, t('error.duplicate_submission', 'You have already submitted a request. Please wait 24 hours before submitting again.'), 'error');
      return;
    }

    const res = await fetch(restUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || err.error || `HTTP ${res.status}`);
    }

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
  setupModal();

  const demoForm = document.getElementById('demoForm');
  const contactForm = document.getElementById('contactForm');

  demoForm?.addEventListener('submit', handleDemoRequest);
  contactForm?.addEventListener('submit', handleContactSubmission);

  [demoForm, contactForm].forEach(form => {
    form?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea').forEach(input => {
      input.addEventListener('input', () => clearFieldError(input));
    });
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
    translations = await loadTranslations(currentLanguage);
    images = await loadImages();
    await updateContent();
    loadBlogPosts();
    loadFAQItems();
  } catch (e) {
    console.error('Failed to load content:', e);
  }
}

function setupScrollAnimations() {
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
