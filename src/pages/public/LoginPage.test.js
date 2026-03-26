import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import { createFormStubs } from '@/__tests__/pageTestUtils'
import LoginPage from './LoginPage.vue'

describe('LoginPage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the login messaging', () => {
    const { stubs } = createFormStubs()
    const wrapper = mount(LoginPage, {
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Sign in to Schoolmaster')
    expect(wrapper.text()).toContain('Use your email and password to continue.')
  })

  it('shows a success message after a valid submission', async () => {
    const { stubs, validateMock, resetFieldsMock } = createFormStubs()
    const wrapper = mount(LoginPage, {
      global: {
        stubs,
      },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(400)
    await flushPromises()

    expect(wrapper.text()).toContain('You are signed in. Welcome back!')
    expect(resetFieldsMock).toHaveBeenCalledTimes(1)
  })

  it('does not show success when validation fails', async () => {
    const { stubs, validateMock, resetFieldsMock } = createFormStubs({
      validateResult: Promise.reject(new Error('invalid')),
    })
    const wrapper = mount(LoginPage, {
      global: {
        stubs,
      },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalled()
    expect(wrapper.text()).not.toContain('You are signed in. Welcome back!')
    expect(resetFieldsMock).not.toHaveBeenCalled()
  })

})
