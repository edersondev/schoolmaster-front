import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import EditProfilePage from './EditProfilePage.vue'

describe('EditProfilePage', () => {
  it('renders the edit profile heading', () => {
    const wrapper = mount(EditProfilePage)

    expect(wrapper.text()).toContain('Edit Profile')
  })
})
