import { createClient } from '@supabase/supabase-js';
import { loadTranslations } from './content-loader';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

let currentLanguage = new URLSearchParams(window.location.search).get('lang') || 'ru';
let currentCategory = 'all';
let translations: Record<string, string> = {};

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  language: string;
  order: number;
  category: string;
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
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url.toString());

  translations = await loadTranslations(lang);
  updatePageContent();
  loadAllFAQItems();
}

function updatePageContent() {
  const setById = (id: string, key: string, fallback: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t(key, fallback);
  };

  setById('faqPageTitle', 'faq_page.title', 'Frequently Asked Questions');
  setById('faqPageSubtitle', 'faq_page.subtitle', 'Find answers to the most popular questions about the MakeTrades platform');
  setById('catAll', 'faq_page.cat_all', 'All questions');
  setById('catPricing', 'faq_page.cat_pricing', 'Pricing');
  setById('catFeatures', 'faq_page.cat_features', 'Features');
  setById('catSupport', 'faq_page.cat_support', 'Support');
  setById('faqCtaTitle', 'faq_page.cta_title', 'Didn\'t find an answer?');
  setById('faqCtaDesc', 'faq_page.cta_desc', 'Contact us and we will be happy to answer all your questions');
  setById('faqCtaBtn', 'faq_page.cta_button', 'Contact us');
  setById('faqCopyright', 'footer.copyright', '© 2026 MakeTrades. All rights reserved.');
  setById('backHomeBtn', 'button.back_home', 'Home');

  const backHomeLink = document.getElementById('backHomeBtn') as HTMLAnchorElement;
  if (backHomeLink) backHomeLink.href = `/?lang=${currentLanguage}`;
}

function setCategory(category: string) {
  currentCategory = category;
  document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-category="${category}"]`)?.classList.add('active');
  loadAllFAQItems();
}

async function loadAllFAQItems() {
  const faqList = document.getElementById('allFAQItems');
  if (!faqList) return;

  faqList.innerHTML = `<p style="text-align: center;">${t('faq_page.loading', 'Loading questions...')}</p>`;

  try {
    let query = supabase
      .from('faq_items')
      .select('*')
      .eq('language', currentLanguage)
      .order('order', { ascending: true });

    if (currentCategory !== 'all') {
      query = query.eq('category', currentCategory);
    }

    const { data: items, error } = await query;

    if (error) throw error;

    if (!items || items.length === 0) {
      faqList.innerHTML = `<p style="text-align: center; color: var(--neutral-500);">${t('faq_page.empty', 'Questions coming soon')}</p>`;
      updateFAQSchema([]);
      return;
    }

    faqList.innerHTML = items.map((item: FAQItem) => `
      <div class="faq-item fade-in" data-faq-id="${item.id}" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <div class="faq-question" itemprop="name">
          <span>${item.question}</span>
          <span>+</span>
        </div>
        <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          <div itemprop="text">${item.answer}</div>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('active');
      });
    });

    updateFAQSchema(items);
  } catch (error) {
    console.error('Error loading FAQ items:', error);
    faqList.innerHTML = `<p style="text-align: center; color: var(--error-500);">${t('faq.error', 'Error loading FAQ')}</p>`;
    updateFAQSchema([]);
  }
}

function updateFAQSchema(items: FAQItem[]) {
  const schemaScript = document.getElementById('faqSchema');
  if (!schemaScript) return;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  schemaScript.textContent = JSON.stringify(schema, null, 2);
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

  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      if (category) setCategory(category);
    });
  });

  translations = await loadTranslations(currentLanguage);
  updatePageContent();
  loadAllFAQItems();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
