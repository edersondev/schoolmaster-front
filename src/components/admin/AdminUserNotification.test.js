import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { baseAdminStubs } from '@/__tests__/adminTestUtils'
import AdminUserNotification from './AdminUserNotification.vue'

describe('AdminUserNotification', () => {
  it('renders notification summary and items', () => {
    const wrapper = mount(AdminUserNotification, {
      global: {
        stubs: baseAdminStubs,
      },
    })

    expect(wrapper.text()).toContain('Notification')
    expect(wrapper.text()).toContain('Alicia Stone')
    expect(wrapper.text()).toContain('Project Nganter')
  })
})
