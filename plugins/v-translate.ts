// plugins/v-translate.ts
import { defineNuxtPlugin } from '#app'
import { useNuxtApp } from '#app'
import { useLanguageToggle } from '~/composables/useLanguageToggle'

export default defineNuxtPlugin((nuxtApp) => {
  const { isEnglishToSpanish } = useLanguageToggle()

  nuxtApp.vueApp.directive('translate', {
    async mounted(el) {
      const { $translate } = useNuxtApp()
      const original = el.innerText.trim()
      if (!original) return

      const translated = await $translate(original)
      el.innerText = translated
    },

    async updated(el) {
      const { $translate } = useNuxtApp()
      const original = el.innerText.trim()
      if (!original) return

      const translated = await $translate(original)
      el.innerText = translated
    }
  })
})
