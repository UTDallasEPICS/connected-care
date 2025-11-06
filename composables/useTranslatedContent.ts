// composables/useTranslatedContent.ts
import { ref, watchEffect } from 'vue'
import { useNuxtApp } from '#app'
import { useLanguageToggle } from '~/composables/useLanguageToggle'

export function useTranslatedContent(initial: string | string[]) {
  const { $translate } = useNuxtApp()
  const { isEnglishToSpanish } = useLanguageToggle()

  const raw = ref(initial)
  const translated = ref<typeof initial>(Array.isArray(initial) ? [] : '')

  // Re-run translation whenever toggle flips or raw changes
  watchEffect(async () => {
    if (!raw.value) return

    if (Array.isArray(raw.value)) {
      translated.value = await Promise.all(raw.value.map((t) => $translate(t)))
    } else {
      translated.value = await $translate(raw.value)
    }
  })

  return { raw, translated }
}
