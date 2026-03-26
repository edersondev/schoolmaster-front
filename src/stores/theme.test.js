import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'

let darkRef
let toggleDarkMock

const setupStore = async () => {
  darkRef = ref(false)
  toggleDarkMock = vi.fn(() => {
    darkRef.value = !darkRef.value
  })

  vi.doMock('@vueuse/core', () => ({
    useDark: () => darkRef,
    useToggle: () => toggleDarkMock,
  }))

  const { useThemeStore } = await import('./theme')

  return useThemeStore
}

describe('useThemeStore', () => {
  beforeEach(() => {
    vi.resetModules()
    setActivePinia(createPinia())
  })

  it('defaults to light mode', async () => {
    const useThemeStore = await setupStore()
    const store = useThemeStore()

    expect(store.isDark).toBe(false)
    expect(store.theme).toBe('light')
  })

  it('toggles dark mode', async () => {
    const useThemeStore = await setupStore()
    const store = useThemeStore()

    store.toggleDark()

    expect(toggleDarkMock).toHaveBeenCalledTimes(1)
    expect(store.isDark).toBe(true)
    expect(store.theme).toBe('dark')
  })
})
