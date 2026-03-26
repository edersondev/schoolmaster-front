import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import { baseAdminStubs } from '@/__tests__/adminTestUtils'
import AdminTopbar from './AdminTopbar.vue'

const StubItem = (name) =>
  defineComponent({
    name,
    setup() {
      return () => h('div', { 'data-testid': name })
    },
  })

describe('AdminTopbar', () => {
  it('emits toggle events from the action buttons', async () => {
    const wrapper = mount(AdminTopbar, {
      props: {
        isSidebarCollapsed: false,
      },
      global: {
        stubs: {
          ...baseAdminStubs,
          AdminUserMenu: StubItem('AdminUserMenu'),
          AdminUserNotification: StubItem('AdminUserNotification'),
          AdminThemeToggle: StubItem('AdminThemeToggle'),
        },
      },
    })

    const buttons = wrapper.findAll('button')

    await buttons[0].trigger('click')
    await buttons[1].trigger('click')

    expect(wrapper.emitted('toggleDesktopSidebar')).toHaveLength(1)
    expect(wrapper.emitted('toggleMobileSidebar')).toHaveLength(1)
  })

  it('updates the search query via v-model', async () => {
    const wrapper = mount(AdminTopbar, {
      props: {
        isSidebarCollapsed: true,
      },
      global: {
        stubs: {
          ...baseAdminStubs,
          AdminUserMenu: StubItem('AdminUserMenu'),
          AdminUserNotification: StubItem('AdminUserNotification'),
          AdminThemeToggle: StubItem('AdminThemeToggle'),
        },
      },
    })

    const input = wrapper.find('input')

    await input.setValue('new search')

    expect(input.element.value).toBe('new search')
  })
})
