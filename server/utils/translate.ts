// server/utils/translate.ts
import axios from 'axios';

// Default to the public LibreTranslate instance
const LIBRETRANSLATE_API = process.env.LIBRETRANSLATE_API || 'https://libretranslate.com';
// const API_KEY = process.env.LIBRETRANSLATE_API_KEY;

// Language state
let currentLang = 'es';
const availableLangs = ['en', 'es'];

/*
export function setLanguage(lang: string) {
  if (availableLangs.includes(lang)) {
    currentLang = lang;
    if (process.client) {
      localStorage.setItem('userLanguage', lang);
    }
  }
}

// Load saved language
if (process.client) {
  const savedLang = localStorage.getItem('userLanguage');
  if (savedLang && availableLangs.includes(savedLang)) {
    currentLang = savedLang;
  }
}
*/

export async function translateText(
  text: string, 
  targetLang: string = currentLang, 
  sourceLang: string = 'en'
): Promise<string> {
  if (!text.trim() || targetLang === sourceLang) return text;

  console.log("Text to translate: ",  text)

  try {
    const payload = {
      q: text,
      source: sourceLang,
      target: targetLang
      // ...(API_KEY && { api_key: API_KEY })
    };
    console.log("Sending payload: ", payload)
    
    console.log("LibreTranslate API: ",  LIBRETRANSLATE_API)
    const response = await axios.post(
      `/api/translate`,
      {
        q: text,
        source: sourceLang,
        target: targetLang
        // ...(API_KEY && { api_key: API_KEY })
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    
    
    console.log('LibreTranslate response:', response.data)
    return response.data.translatedText || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

// Cache for translations
const translationCache = new Map<string, string>();

export async function translate(
  key: string, 
  params: Record<string, any> = {}
): Promise<string> {
  const cacheKey = `${key}:${currentLang}`;
  
  if (translationCache.has(cacheKey)) {
    return formatString(translationCache.get(cacheKey)!, params);
  }

  try {
    const translated = await translateText(key);
    translationCache.set(cacheKey, translated);
    return formatString(translated, params);
  } catch (error) {
    console.error('Translation failed:', error);
    return formatString(key, params);
  }
}

function formatString(str: string, params: Record<string, any>): string {
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, 'g'), value),
    str
  );
}

// Export the language state
/*
export const languageState = {
  currentLang,
  availableLangs,
  setLanguage
};
*/