import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import AccountSettingsPage from './AccountSettingsPage.vue'

describe('AccountSettingsPage', () => {
  it('renders the account settings heading', () => {
    const wrapper = mount(AccountSettingsPage)

    expect(wrapper.text()).toContain('Account Settings')
  })
})
