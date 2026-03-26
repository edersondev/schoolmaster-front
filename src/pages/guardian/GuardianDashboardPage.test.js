import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import GuardianDashboardPage from './GuardianDashboardPage.vue'

describe('GuardianDashboardPage', () => {
  it('renders the guardian dashboard heading', () => {
    const wrapper = mount(GuardianDashboardPage)

    expect(wrapper.text()).toContain('Guardian Dashboard')
  })
})
