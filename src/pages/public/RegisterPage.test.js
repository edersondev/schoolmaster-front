import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import { createFormStubs } from '@/__tests__/pageTestUtils'
import RegisterPage from './RegisterPage.vue'

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the registration messaging', () => {
    const { stubs } = createFormStubs()
    const wrapper = mount(RegisterPage, {
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Create your account')
    expect(wrapper.text()).toContain('Set up your profile in a minute.')
  })

  it('shows a success message after a valid submission', async () => {
    const { stubs, validateMock, resetFieldsMock } = createFormStubs()
    const wrapper = mount(RegisterPage, {
      global: {
        stubs,
      },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(400)
    await flushPromises()

    expect(wrapper.text()).toContain('Account created successfully. You can sign in now.')
    expect(resetFieldsMock).toHaveBeenCalledTimes(1)
  })

  it('does not show success when validation fails', async () => {
    const { stubs, validateMock, resetFieldsMock } = createFormStubs({
      validateResult: Promise.reject(new Error('invalid')),
    })
    const wrapper = mount(RegisterPage, {
      global: {
        stubs,
      },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalled()
    expect(wrapper.text()).not.toContain('Account created successfully. You can sign in now.')
    expect(resetFieldsMock).not.toHaveBeenCalled()
  })

})
