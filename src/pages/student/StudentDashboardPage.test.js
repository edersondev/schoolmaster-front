import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import StudentDashboardPage from './StudentDashboardPage.vue'

describe('StudentDashboardPage', () => {
  it('renders the student dashboard heading', () => {
    const wrapper = mount(StudentDashboardPage)

    expect(wrapper.text()).toContain('Student Dashboard')
  })
})
