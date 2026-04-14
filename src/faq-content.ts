import faqContent from './faq-content.json';
import { normalizeLanguage, type SupportedLanguage } from './seo-urls';

export const FAQ_CATEGORIES = ['launch', 'platform', 'operations'] as const;

export type FAQCategory = (typeof FAQ_CATEGORIES)[number];
export type FAQFilterCategory = FAQCategory | 'all';

interface FAQTranslationEntry {
  question: string;
  answer: string;
}

interface FAQPageCopy {
  title: string;
  description: string;
  heading: string;
  subtitle: string;
  keywords: string;
  categories: Record<FAQFilterCategory, string>;
  loading: string;
  empty: string;
  error: string;
  backHome: string;
  copyright: string;
}

interface FAQContentEntry {
  id: string;
  order: number;
  category: FAQCategory;
  translations: Record<SupportedLanguage, FAQTranslationEntry>;
}

export interface UnifiedFAQItem {
  id: string;
  question: string;
  answer: string;
  language: SupportedLanguage;
  order: number;
  category: FAQCategory;
}

const content = faqContent as {
  pageCopy: Record<SupportedLanguage, FAQPageCopy>;
  items: FAQContentEntry[];
};

export function isFaqCategory(value: string | null | undefined): value is FAQCategory {
  return !!value && FAQ_CATEGORIES.includes(value as FAQCategory);
}

export function normalizeFaqCategory(value: string | null | undefined): FAQFilterCategory {
  return isFaqCategory(value) ? value : 'all';
}

export function getFaqPageCopy(language: string): FAQPageCopy {
  const normalizedLanguage = normalizeLanguage(language);
  return content.pageCopy[normalizedLanguage] || content.pageCopy.en;
}

export function getUnifiedFaqItems(
  language: string,
  category: FAQFilterCategory = 'all',
  limit?: number
): UnifiedFAQItem[] {
  const normalizedLanguage = normalizeLanguage(language);
  const normalizedCategory = normalizeFaqCategory(category);

  const items = content.items
    .filter(item => normalizedCategory === 'all' || item.category === normalizedCategory)
    .sort((left, right) => left.order - right.order)
    .map(item => {
      const translation = item.translations[normalizedLanguage];
      return {
        id: item.id,
        question: translation.question,
        answer: translation.answer,
        language: normalizedLanguage,
        order: item.order,
        category: item.category,
      };
    });

  return typeof limit === 'number' ? items.slice(0, limit) : items;
}
