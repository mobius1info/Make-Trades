import { getFaqPageCopy, normalizeFaqCategory } from './faq-content';
import { fetchFaqItems, type PublicFAQItem } from './public-api';
import {
  faqPath,
  getFaqLanguageFromPath,
  homePath,
  isProductionBuild,
  legacyFaqPath,
  normalizeLanguage,
} from './seo-urls';

let currentLanguage = normalizeLanguage(
  getFaqLanguageFromPath(window.location.pathname) || new URLSearchParams(window.location.search).get('lang') || 'ru'
);
let currentCategory = 'all';
let canReusePrerenderedFaqItems = true;

function pageCopy() {
  return getFaqPageCopy(currentLanguage);
}

function hasPrerenderedFaqItems(): boolean {
  return Boolean(document.querySelector('#allFAQItems .faq-item'));
}

function canReusePrerenderedShell(): boolean {
  return Boolean(getFaqLanguageFromPath(window.location.pathname)) && hasPrerenderedFaqItems();
}

async function setLanguage(lang: string) {
  const normalizedLanguage = normalizeLanguage(lang);

  if (getFaqLanguageFromPath(window.location.pathname) || isProductionBuild()) {
    window.location.assign(faqPath(normalizedLanguage));
    return;
  }

  currentLanguage = normalizedLanguage;
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-lang="${currentLanguage}"]`)?.classList.add('active');
  window.history.replaceState({}, '', legacyFaqPath(currentLanguage));

  updatePageContent();
  await loadAllFAQItems(true);
}

function updatePageContent() {
  const copy = pageCopy();
  const setById = (id: string, value: string) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };

  setById('faqPageTitle', copy.heading);
  setById('faqPageSubtitle', copy.subtitle);
  setById('catAll', copy.categories.all);
  setById('catPricing', copy.categories.launch);
  setById('catFeatures', copy.categories.platform);
  setById('catSupport', copy.categories.operations);
  setById('faqCopyright', copy.copyright);
  setById('backHomeBtn', copy.backHome);

  const backHomeLink = document.getElementById('backHomeBtn') as HTMLAnchorElement | null;
  if (backHomeLink) backHomeLink.href = homePath(currentLanguage);
}

async function setCategory(category: string) {
  currentCategory = normalizeFaqCategory(category);
  document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-category="${currentCategory}"]`)?.classList.add('active');

  if (currentCategory !== 'all') {
    canReusePrerenderedFaqItems = false;
  }

  await loadAllFAQItems(currentCategory !== 'all' || !canReusePrerenderedFaqItems);
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
        <div class="faq-answer">
          <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
            <div itemprop="text">${item.answer}</div>
          </div>
        </div>
      </div>
      `
    )
    .join('');
}

async function loadAllFAQItems(force: boolean = false) {
  const faqList = document.getElementById('allFAQItems');
  if (!faqList) return;

  if (!force && currentCategory === 'all' && canReusePrerenderedFaqItems && hasPrerenderedFaqItems()) {
    return;
  }

  const copy = pageCopy();
  faqList.innerHTML = `<p style="text-align: center;">${copy.loading}</p>`;

  try {
    const items = await fetchFaqItems(currentLanguage, currentCategory);

    if (!items || items.length === 0) {
      faqList.innerHTML = `<p style="text-align: center; color: var(--neutral-500);">${copy.empty}</p>`;
      updateFAQSchema([]);
      return;
    }

    renderFaqItems(faqList, items);
    updateFAQSchema(items);
    canReusePrerenderedFaqItems = false;
  } catch (error) {
    console.error('Error loading FAQ items:', error);
    faqList.innerHTML = `<p style="text-align: center; color: var(--error-500);">${copy.error}</p>`;
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
      if (category) void setCategory(category);
    });
  });

  updatePageContent();

  if (!canReusePrerenderedShell()) {
    await loadAllFAQItems(true);
    return;
  }

  updateFAQSchema(await fetchFaqItems(currentLanguage, 'all'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    void init();
  });
} else {
  void init();
}
