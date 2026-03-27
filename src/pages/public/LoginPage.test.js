import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import { createFormStubs } from '@/__tests__/pageTestUtils'
import { useAuthStore } from '@/stores/authStore'
import LoginPage from './LoginPage.vue'

const routerPush = vi.hoisted(() => vi.fn())
const messageSuccess = vi.hoisted(() => vi.fn())
const messageError = vi.hoisted(() => vi.fn())

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPush,
  }),
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: messageSuccess,
    error: messageError,
  },
}))

describe('LoginPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    routerPush.mockClear()
    messageSuccess.mockClear()
    messageError.mockClear()
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
    const authStore = useAuthStore()
    const loginMock = vi.spyOn(authStore, 'login').mockResolvedValue({
      token: 'token',
      user: {
        email: 'admin@schoolmaster.test',
        role: 'admin',
      },
    })
    const wrapper = mount(LoginPage, {
      global: {
        stubs,
      },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalled()
    expect(loginMock).toHaveBeenCalledTimes(1)
    expect(resetFieldsMock).toHaveBeenCalledTimes(1)
    expect(messageSuccess).toHaveBeenCalledWith('Welcome back!')
    expect(routerPush).toHaveBeenCalledWith('/admin')
  })

  it('does not show success when validation fails', async () => {
    const { stubs, validateMock, resetFieldsMock } = createFormStubs({
      validateResult: Promise.reject(new Error('invalid')),
    })
    const authStore = useAuthStore()
    const loginMock = vi.spyOn(authStore, 'login')
    const wrapper = mount(LoginPage, {
      global: {
        stubs,
      },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalled()
    expect(loginMock).not.toHaveBeenCalled()
    expect(resetFieldsMock).not.toHaveBeenCalled()
    expect(messageSuccess).not.toHaveBeenCalled()
    expect(routerPush).not.toHaveBeenCalled()
  })

  it('shows field errors when api validation fails', async () => {
    const { stubs } = createFormStubs()
    const authStore = useAuthStore()
    vi.spyOn(authStore, 'login').mockRejectedValue({
      status: 422,
      message: 'Validation failed.',
      data: {
        errors: {
          email: ['Invalid email.'],
          password: ['Required.'],
        },
      },
    })

    const wrapper = mount(LoginPage, {
      global: {
        stubs,
      },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(messageError).toHaveBeenCalledWith('Validation failed.')
    expect(wrapper.text()).toContain('Validation failed.')
  })

  it('shows a generic error message when login fails', async () => {
    const { stubs } = createFormStubs()
    const authStore = useAuthStore()
    vi.spyOn(authStore, 'login').mockRejectedValue(new Error('Login failed.'))

    const wrapper = mount(LoginPage, {
      global: {
        stubs,
      },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(messageError).toHaveBeenCalledWith('Login failed.')
    expect(wrapper.text()).toContain('Login failed.')
  })

})
