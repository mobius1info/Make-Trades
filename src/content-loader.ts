import { supabase } from './supabase';

interface Translation {
  key: string;
  language: string;
  value: string;
  category: string;
}

interface SiteImage {
  key: string;
  url: string;
  alt_text: string;
  category: string;
}

const translationsCache: Record<string, Translation[]> = {};
const imagesCache: Record<string, SiteImage> = {};

export async function loadTranslations(language: string): Promise<Record<string, string>> {
  if (translationsCache[language]) {
    return translationsToObject(translationsCache[language]);
  }

  const { data, error } = await supabase
    .from('translations')
    .select('*')
    .eq('language', language);

  if (error) {
    console.error('Error loading translations:', error);
    return {};
  }

  translationsCache[language] = data || [];
  return translationsToObject(data || []);
}

function translationsToObject(translations: Translation[]): Record<string, string> {
  const result: Record<string, string> = {};
  translations.forEach(t => {
    result[t.key] = t.value;
  });
  return result;
}

export async function loadImages(): Promise<Record<string, SiteImage>> {
  if (Object.keys(imagesCache).length > 0) {
    return imagesCache;
  }

  const { data, error } = await supabase
    .from('site_images')
    .select('*');

  if (error) {
    console.error('Error loading images:', error);
    return {};
  }

  (data || []).forEach(img => {
    imagesCache[img.key] = img;
  });

  return imagesCache;
}

export async function getTranslation(key: string, language: string): Promise<string> {
  const translations = await loadTranslations(language);
  return translations[key] || key;
}

export async function getImage(key: string): Promise<SiteImage | null> {
  const images = await loadImages();
  return images[key] || null;
}
