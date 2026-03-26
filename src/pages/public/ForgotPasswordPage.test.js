import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import ForgotPasswordPage from './ForgotPasswordPage.vue'

const PublicLayoutStub = defineComponent({
  name: 'PublicLayout',
  setup(_, { slots }) {
    return () => h('div', { 'data-testid': 'public-layout' }, slots.default?.())
  },
})

const ElFormItemStub = defineComponent({
  name: 'ElFormItem',
  setup(_, { slots }) {
    return () => h('div', { 'data-testid': 'form-item' }, slots.default?.())
  },
})

const ElInputStub = defineComponent({
  name: 'ElInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        value: props.modelValue,
        onInput: (event) => emit('update:modelValue', event.target.value),
      })
  },
})

const ElButtonStub = defineComponent({
  name: 'ElButton',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          'data-loading': String(props.loading),
          onClick: () => emit('click'),
        },
        slots.default?.()
      )
  },
})

const RouterLinkStub = defineComponent({
  name: 'RouterLink',
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => h('a', { href: props.to }, slots.default?.())
  },
})

const createWrapper = ({ validateResult } = {}) => {
  const validateMock = vi.fn().mockImplementation(() => validateResult ?? Promise.resolve())
  const resetFieldsMock = vi.fn()

  const ElFormStub = defineComponent({
    name: 'ElForm',
    setup(_, { slots, expose }) {
      expose({
        validate: validateMock,
        resetFields: resetFieldsMock,
      })

      return () => h('form', { 'data-testid': 'form' }, slots.default?.())
    },
  })

  const wrapper = mount(ForgotPasswordPage, {
    global: {
      stubs: {
        PublicLayout: PublicLayoutStub,
        ElForm: ElFormStub,
        ElFormItem: ElFormItemStub,
        ElInput: ElInputStub,
        ElButton: ElButtonStub,
        RouterLink: RouterLinkStub,
      },
    },
  })

  return { wrapper, validateMock, resetFieldsMock }
}

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the reset password messaging', () => {
    const { wrapper } = createWrapper()

    expect(wrapper.text()).toContain('Forgot your password?')
    expect(wrapper.text()).toContain('We will send a reset link to your email.')
    expect(wrapper.text()).toContain('Back to sign in')
  })

  it('shows a success message after a valid submission', async () => {
    const { wrapper, validateMock, resetFieldsMock } = createWrapper()

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalled()
    expect(wrapper.text()).not.toContain('Reset instructions sent.')

    await vi.advanceTimersByTimeAsync(400)
    await flushPromises()

    expect(wrapper.text()).toContain('Reset instructions sent.')
    expect(resetFieldsMock).toHaveBeenCalledTimes(1)
  })

  it('does not show success when validation fails', async () => {
    const { wrapper, validateMock, resetFieldsMock } = createWrapper({
      validateResult: Promise.reject(new Error('invalid')),
    })

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalled()
    expect(wrapper.text()).not.toContain('Reset instructions sent.')
    expect(resetFieldsMock).not.toHaveBeenCalled()
  })

})
