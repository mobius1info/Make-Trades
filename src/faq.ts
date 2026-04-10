import { loadTranslations } from './content-loader';
import { fetchFaqItems, type PublicFAQItem } from './public-api';
import { faqPath, getFaqLanguageFromPath, isProductionBuild, legacyFaqPath } from './seo-urls';

let currentLanguage =
  getFaqLanguageFromPath(window.location.pathname) ||
  new URLSearchParams(window.location.search).get('lang') ||
  'ru';
let currentCategory = 'all';
let translations: Record<string, string> = {};
let canReusePrerenderedFaqItems = true;

function t(key: string, fallback: string): string {
  return translations[key] || fallback;
}

function hasPrerenderedFaqItems(): boolean {
  return Boolean(document.querySelector('#allFAQItems .faq-item'));
}

async function setLanguage(lang: string) {
  if (getFaqLanguageFromPath(window.location.pathname) || isProductionBuild()) {
    window.location.assign(faqPath(lang));
    return;
  }

  currentLanguage = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');
  window.history.replaceState({}, '', legacyFaqPath(lang));

  translations = await loadTranslations(lang);
  updatePageContent();
  await loadAllFAQItems(true);
}

function updatePageContent() {
  const setById = (id: string, key: string, fallback: string) => {
    const element = document.getElementById(id);
    if (element) element.textContent = t(key, fallback);
  };

  setById('faqPageTitle', 'faq_page.title', 'Frequently Asked Questions');
  setById(
    'faqPageSubtitle',
    'faq_page.subtitle',
    'Find answers to the most popular questions about the MakeTrades platform'
  );
  setById('catAll', 'faq_page.cat_all', 'All questions');
  setById('catPricing', 'faq_page.cat_pricing', 'Pricing');
  setById('catFeatures', 'faq_page.cat_features', 'Features');
  setById('catSupport', 'faq_page.cat_support', 'Support');
  setById('faqCopyright', 'footer.copyright', '© 2026 MakeTrades. All rights reserved.');
  setById('backHomeBtn', 'button.back_home', 'Home');

  const backHomeLink = document.getElementById('backHomeBtn') as HTMLAnchorElement | null;
  if (backHomeLink) backHomeLink.href = currentLanguage === 'ru' ? '/' : `/?lang=${currentLanguage}`;
}

function setCategory(category: string) {
  currentCategory = category;
  document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-category="${category}"]`)?.classList.add('active');
  if (category !== 'all') {
    canReusePrerenderedFaqItems = false;
  }
  void loadAllFAQItems(category !== 'all' || !canReusePrerenderedFaqItems);
}

function renderFaqItems(faqList: HTMLElement, items: PublicFAQItem[]) {
  faqList.innerHTML = items
    .map(
      item => `
      <div class="faq-item" data-faq-id="${item.id}" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <div class="faq-question" itemprop="name">
          <span>${item.question}</span>
          <span>+</span>
        </div>
        <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div itemprop="text">${item.answer}</div>
        </div>
      </div>
    `
    )
    .join('');

  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
}

async function loadAllFAQItems(force: boolean = false) {
  const faqList = document.getElementById('allFAQItems');
  if (!faqList) return;

  if (!force && currentCategory === 'all' && canReusePrerenderedFaqItems && hasPrerenderedFaqItems()) {
    return;
  }

  faqList.innerHTML = `<p style="text-align: center;">${t('faq_page.loading', 'Loading questions...')}</p>`;

  try {
    const items = await fetchFaqItems(currentLanguage, currentCategory);

    if (!items || items.length === 0) {
      faqList.innerHTML = `<p style="text-align: center; color: var(--neutral-500);">${t(
        'faq_page.empty',
        'Questions coming soon'
      )}</p>`;
      updateFAQSchema([]);
      return;
    }

    renderFaqItems(faqList, items);
    updateFAQSchema(items);
    canReusePrerenderedFaqItems = false;
  } catch (error) {
    console.error('Error loading FAQ items:', error);
    faqList.innerHTML = `<p style="text-align: center; color: var(--error-500);">${t(
      'faq.error',
      'Error loading FAQ'
    )}</p>`;
    updateFAQSchema([]);
    canReusePrerenderedFaqItems = false;
  }
}

function updateFAQSchema(items: PublicFAQItem[]) {
  const schemaScript = document.getElementById('faqSchema');
  if (!schemaScript) return;

  const schema = {
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

  schemaScript.textContent = JSON.stringify(schema, null, 2);
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

  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      if (category) setCategory(category);
    });
  });

  translations = await loadTranslations(currentLanguage);
  updatePageContent();
  await loadAllFAQItems();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    void init();
  });
} else {
  void init();
}
