import { shallowRef, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'ui-theme'

export const useThemeStore = defineStore('theme', () => {
  const theme = shallowRef('light')

  const isDark = computed(() => theme.value === 'dark')

  function applyTheme(nextTheme) {
    const root = document.documentElement
    root.classList.toggle('dark', nextTheme === 'dark')
  }

  function setTheme(nextTheme) {
    theme.value = nextTheme
    localStorage.setItem(STORAGE_KEY, nextTheme)
    applyTheme(nextTheme)
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY)

    if (savedTheme === 'light' || savedTheme === 'dark') {
      theme.value = savedTheme
      applyTheme(savedTheme)
      return
    }

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    const nextTheme = prefersDark ? 'dark' : 'light'

    theme.value = nextTheme
    applyTheme(nextTheme)
  }

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    initTheme,
  }
})
