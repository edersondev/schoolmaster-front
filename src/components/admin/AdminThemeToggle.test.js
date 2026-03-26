import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

import { baseAdminStubs } from '@/__tests__/adminTestUtils'

const setupThemeToggle = async ({ isDarkInitial } = {}) => {
  const isDark = ref(isDarkInitial ?? false)
  const toggleDarkMock = vi.fn(() => {
    isDark.value = !isDark.value
  })

  vi.doMock('@/stores/theme', () => ({
    useThemeStore: () => ({
      isDark,
      toggleDark: toggleDarkMock,
    }),
  }))

  const { default: AdminThemeToggle } = await import('./AdminThemeToggle.vue')

  return { AdminThemeToggle, isDark, toggleDarkMock }
}

describe('AdminThemeToggle', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('renders the light mode label and toggles on click', async () => {
    const { AdminThemeToggle, toggleDarkMock } = await setupThemeToggle({ isDarkInitial: false })

    const wrapper = mount(AdminThemeToggle, {
      global: {
        stubs: baseAdminStubs,
      },
    })

    expect(wrapper.text()).toContain('Switch to dark mode')

    await wrapper.find('button').trigger('click')

    expect(toggleDarkMock).toHaveBeenCalledTimes(1)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Switch to light mode')
  })

  it('shows the light-mode label when dark mode is active', async () => {
    const { AdminThemeToggle, isDark } = await setupThemeToggle({ isDarkInitial: true })

    const wrapper = mount(AdminThemeToggle, {
      global: {
        stubs: baseAdminStubs,
      },
    })

    expect(wrapper.text()).toContain('Switch to light mode')

    isDark.value = false
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Switch to dark mode')
  })
})
