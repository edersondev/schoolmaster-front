import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import { createFormStubs } from '@/__tests__/pageTestUtils'
import RegisterPage from './RegisterPage.vue'

const registerMock = vi.hoisted(() => vi.fn())
const checkCpfAvailabilityMock = vi.hoisted(() => vi.fn())
const routerPush = vi.hoisted(() => vi.fn())

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPush,
  }),
}))

vi.mock('@/services/authService', () => ({
  default: {
    register: registerMock,
    checkCpfAvailability: checkCpfAvailabilityMock,
  },
}))

describe('RegisterPage', () => {
  beforeEach(() => {
    registerMock.mockReset()
    checkCpfAvailabilityMock.mockReset()
    routerPush.mockReset()
    checkCpfAvailabilityMock.mockResolvedValue({
      available: true,
      message: 'CPF can be registered.',
    })
  })

  it('renders the registration messaging', () => {
    const { stubs, directives } = createFormStubs()
    const wrapper = mount(RegisterPage, {
      global: {
        stubs,
        directives,
      },
    })

    expect(wrapper.text()).toContain('Create your account')
    expect(wrapper.text()).toContain('Set up your profile in a minute.')
    expect(wrapper.findAll('input')).toHaveLength(6)
  })

  it('shows cpf error feedback when backend returns validation error', async () => {
    const { stubs, directives, validateMock } = createFormStubs()
    registerMock.mockRejectedValue({
      status: 422,
      message: 'Validation failed.',
      data: {
        errors: {
          cpf: ['CPF is already registered.'],
        },
      },
    })

    const wrapper = mount(RegisterPage, {
      global: {
        stubs,
        directives,
      },
    })

    const [nameInput, emailInput, cpfInput, phoneInput, passwordInput, confirmPasswordInput] = wrapper.findAll('input')
    await nameInput.setValue('Jane Doe')
    await emailInput.setValue('jane@schoolmaster.test')
    await cpfInput.setValue('12345678901')
    await phoneInput.setValue('11999990000')
    await passwordInput.setValue('password123')
    await confirmPasswordInput.setValue('password123')

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalled()
    expect(registerMock).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('CPF is already registered.')
  })

  it('submits unmasked cpf and phone and redirects on success', async () => {
    const { stubs, directives, validateMock, resetFieldsMock } = createFormStubs()
    registerMock.mockResolvedValue({
      message: 'Account created successfully.',
      user: { id: 6 },
    })

    const wrapper = mount(RegisterPage, {
      global: {
        stubs,
        directives,
      },
    })

    const [nameInput, emailInput, cpfInput, phoneInput, passwordInput, confirmPasswordInput] = wrapper.findAll('input')
    await nameInput.setValue('Jane Doe')
    await emailInput.setValue('jane@schoolmaster.test')
    await cpfInput.setValue('12345678901')
    await phoneInput.setValue('11999990000')
    await passwordInput.setValue('password123')
    await confirmPasswordInput.setValue('password123')

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalled()
    expect(registerMock).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@schoolmaster.test',
      password: 'password123',
      confirm_password: 'password123',
      cpf: '12345678901',
      phone: '11999990000',
    })
    expect(routerPush).toHaveBeenCalledWith('/register/pending')
    expect(resetFieldsMock).toHaveBeenCalledTimes(1)
  })

  it('does not submit when validation fails', async () => {
    const { stubs, directives, validateMock, resetFieldsMock } = createFormStubs({
      validateResult: Promise.reject(new Error('invalid')),
    })
    const wrapper = mount(RegisterPage, {
      global: {
        stubs,
        directives,
      },
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalled()
    expect(registerMock).not.toHaveBeenCalled()
    expect(resetFieldsMock).not.toHaveBeenCalled()
  })
})
