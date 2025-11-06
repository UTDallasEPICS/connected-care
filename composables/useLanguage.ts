// composables/useLanguage.ts
import { ref, watchEffect } from 'vue'
import { translate } from '~/server/utils/translate'
// import { useLanguage } from '~/composables/useLanguage'

export function useTranslate() {
  const { currentLang } = useLanguage()

  function t(key: string, params: Record<string, any> = {}) {
    const result = ref(key) // fallback to original text
    watchEffect(async () => {
      result.value = await translate(key, params)
    })
    return result
  }

  return { t }
}


const currentLang = ref('en')
const availableLangs = ['en', 'es']

export function useLanguage() {
  function setLanguage(lang: string) {
    if (availableLangs.includes(lang)) {
      currentLang.value = lang
      if (import.meta.client) localStorage.setItem('userLanguage', lang)
    }
  }

  if (import.meta.client) {
    const saved = localStorage.getItem('userLanguage')
    if (saved && availableLangs.includes(saved)) currentLang.value = saved
  }

  return { currentLang, availableLangs, setLanguage }
}
