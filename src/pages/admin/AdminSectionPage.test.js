import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const routeMeta = { title: 'Programs' }

vi.mock('vue-router', () => ({
  useRoute: () => ({ meta: routeMeta }),
}))

import AdminSectionPage from './AdminSectionPage.vue'

describe('AdminSectionPage', () => {
  it('renders the title from the route meta', () => {
    const wrapper = mount(AdminSectionPage)

    expect(wrapper.text()).toContain('Programs')
    expect(wrapper.text()).toContain('Admin section placeholder.')
  })

  it('falls back to the default title when meta is missing', async () => {
    routeMeta.title = undefined

    const wrapper = mount(AdminSectionPage)

    expect(wrapper.text()).toContain('Admin Section')
  })
})
