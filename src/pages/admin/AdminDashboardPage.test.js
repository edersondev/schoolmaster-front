import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AdminDashboardPage from './AdminDashboardPage.vue'

describe('AdminDashboardPage', () => {
  it('renders the admin dashboard heading', () => {
    const wrapper = mount(AdminDashboardPage)

    expect(wrapper.text()).toContain('Admin Dashboard')
  })
})
