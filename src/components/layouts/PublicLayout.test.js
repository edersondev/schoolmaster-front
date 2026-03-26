import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import PublicLayout from './PublicLayout.vue'

describe('PublicLayout', () => {
  it('renders the header and slot content', () => {
    const wrapper = mount(PublicLayout, {
      slots: {
        default: '<div>Slot content</div>',
      },
    })

    expect(wrapper.text()).toContain('Schoolmaster')
    expect(wrapper.text()).toContain('Welcome')
    expect(wrapper.text()).toContain('Slot content')
  })
})
