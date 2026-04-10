import { fetchTranslations } from './public-api';

interface Translation {
  key: string;
  value: string;
}

const translationsCache: Record<string, Translation[]> = {};

function translationsToObject(translations: Translation[]): Record<string, string> {
  const result: Record<string, string> = {};
  translations.forEach(translation => {
    result[translation.key] = translation.value;
  });
  return result;
}

export async function loadTranslations(language: string): Promise<Record<string, string>> {
  if (translationsCache[language]) {
    return translationsToObject(translationsCache[language]);
  }

  try {
    const data = await fetchTranslations(language);
    translationsCache[language] = data || [];
    return translationsToObject(translationsCache[language]);
  } catch (error) {
    console.error('Error loading translations:', error);
    return {};
  }
}

export async function getTranslation(key: string, language: string): Promise<string> {
  const translations = await loadTranslations(language);
  return translations[key] || key;
}
