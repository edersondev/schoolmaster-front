import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import TeacherDashboardPage from './TeacherDashboardPage.vue'

describe('TeacherDashboardPage', () => {
  it('renders the teacher dashboard heading', () => {
    const wrapper = mount(TeacherDashboardPage)

    expect(wrapper.text()).toContain('Teacher Dashboard')
  })
})
