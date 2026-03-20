import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  const isDark = useDark()
  const toggleDark = useToggle(isDark)
  const theme = computed(() => (isDark.value ? 'dark' : 'light'))

  return {
    theme,
    isDark,
    toggleDark,
  }
})
