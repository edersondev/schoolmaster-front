import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import SchoolAdminDashboardPage from './SchoolAdminDashboardPage.vue'

describe('SchoolAdminDashboardPage', () => {
  it('renders the school admin dashboard heading', () => {
    const wrapper = mount(SchoolAdminDashboardPage)

    expect(wrapper.text()).toContain('School Admin Dashboard')
  })
})
