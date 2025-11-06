// composables/useLanguageToggle.ts
import { ref } from 'vue'

const isEnglishToSpanish = ref(true)

export function useLanguageToggle() {
  return { isEnglishToSpanish }
}
