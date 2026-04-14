import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import { baseAdminStubs } from '@/__tests__/adminTestUtils'

vi.mock('vue-router', () => ({
  useRoute: () => ({ path: '/admin/classes' }),
}))

import AdminSidebar from './AdminSidebar.vue'

describe('AdminSidebar', () => {
  it('renders the main navigation labels', () => {
    const wrapper = mount(AdminSidebar, {
      props: {
        collapsed: false,
      },
      global: {
        stubs: baseAdminStubs,
      },
    })

    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Users')
    expect(wrapper.text()).toContain('Classes')
    expect(wrapper.text()).toContain('Programs')
    expect(wrapper.text()).toContain('Assignments')
  })

  it('hides quick notes when collapsed', () => {
    const wrapper = mount(AdminSidebar, {
      props: {
        collapsed: true,
      },
      global: {
        stubs: baseAdminStubs,
      },
    })

    expect(wrapper.text()).not.toContain('Quick Notes')
  })
})
