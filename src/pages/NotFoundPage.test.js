import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import { baseStubs } from '@/__tests__/pageTestUtils'

const backMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ back: backMock }),
}))

import NotFoundPage from './NotFoundPage.vue'

describe('NotFoundPage', () => {
  it('renders the not found messaging', () => {
    const wrapper = mount(NotFoundPage, {
      global: {
        stubs: baseStubs,
      },
    })

    expect(wrapper.text()).toContain('Page Not Found')
    expect(wrapper.text()).toContain('hide-and-seek')
  })

  it('calls router.back when clicking go back', async () => {
    const wrapper = mount(NotFoundPage, {
      global: {
        stubs: baseStubs,
      },
    })

    await wrapper.find('button').trigger('click')

    expect(backMock).toHaveBeenCalledTimes(1)
  })
})
