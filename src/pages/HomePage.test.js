import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import HomePage from './HomePage.vue'

describe('HomePage', () => {
  it('renders the home heading', () => {
    const wrapper = mount(HomePage)

    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('shared home placeholder')
  })
})
