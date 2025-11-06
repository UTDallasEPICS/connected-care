// plugins/translator.client.ts
import { defineNuxtPlugin } from '#app'
import { useLanguageToggle } from '~/composables/useLanguageToggle'

export default defineNuxtPlugin(() => {
  const { isEnglishToSpanish } = useLanguageToggle()

  const translate = async (text: string) => {
    if (!text || !text.trim()) return text
    const source = isEnglishToSpanish.value ? 'en' : 'es'
    const target = isEnglishToSpanish.value ? 'es' : 'en'

    const data  = await $fetch('/api/translate', {
      method: 'POST',
      body: { text, source, target }
    })

    return data?.translatedText || text
  }

  return {
    provide: {
      translate
    }
  }
})
