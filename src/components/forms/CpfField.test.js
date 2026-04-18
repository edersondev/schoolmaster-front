import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'

import CpfField from './CpfField.vue'

const checkCpfAvailabilityMock = vi.hoisted(() => vi.fn())

vi.mock('@/services/authService', () => ({
  default: {
    checkCpfAvailability: checkCpfAvailabilityMock,
  },
}))

const ElFormItemStub = defineComponent({
  name: 'ElFormItem',
  props: {
    label: {
      type: String,
      default: '',
    },
    prop: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
  setup(_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const ElInputStub = defineComponent({
  name: 'ElInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    maxlength: {
      type: [String, Number],
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        value: props.modelValue,
        disabled: props.disabled,
        readonly: props.readonly,
        placeholder: props.placeholder,
        maxlength: String(props.maxlength || ''),
        onInput: (event) => {
          const value = String(event.target.value || '')
          emit('update:modelValue', value)

          if (typeof event.target.__maskaOnMaska === 'function') {
            const unmasked = value.replace(/\D/g, '')
            event.target.__maskaOnMaska({
              masked: value,
              unmasked,
              completed: unmasked.length === 11,
            })
          }
        },
      })
  },
})

const mountCpfField = (props = {}) =>
  mount(CpfField, {
    props,
    global: {
      stubs: {
        ElFormItem: ElFormItemStub,
        ElInput: ElInputStub,
      },
      directives: {
        maska: {
          mounted(el, binding) {
            el.__maskaOnMaska = binding.value?.onMaska
          },
          updated(el, binding) {
            el.__maskaOnMaska = binding.value?.onMaska
          },
        },
      },
    },
  })

describe('CpfField', () => {
  beforeEach(() => {
    checkCpfAvailabilityMock.mockReset()
    checkCpfAvailabilityMock.mockResolvedValue({
      available: true,
      message: 'CPF can be registered.',
    })
  })

  it('emits masked and unmasked values on input', async () => {
    const wrapper = mountCpfField()
    const cpfInput = wrapper.find('input')

    expect(cpfInput.attributes('placeholder')).toBe('000.000.000-00')
    expect(cpfInput.attributes('maxlength')).toBe('14')

    await cpfInput.setValue('123.456.789-01')

    const modelEvents = wrapper.emitted('update:modelValue')
    const unmaskedEvents = wrapper.emitted('update:unmasked')

    expect(modelEvents.at(-1)).toEqual(['123.456.789-01'])
    expect(unmaskedEvents.at(-1)).toEqual(['12345678901'])
  })

  it('validates required and cpf length before availability check', async () => {
    const wrapper = mountCpfField()
    const validator = wrapper.findComponent(ElFormItemStub).props('rules')[0].validator

    const requiredCallback = vi.fn()
    await validator({}, '', requiredCallback)
    expect(requiredCallback).toHaveBeenCalledWith(expect.any(Error))
    expect(requiredCallback.mock.calls[0][0].message).toBe('CPF is required.')

    const lengthCallback = vi.fn()
    await validator({}, '123.456.789-0', lengthCallback)
    expect(lengthCallback).toHaveBeenCalledWith(expect.any(Error))
    expect(lengthCallback.mock.calls[0][0].message).toBe('CPF must have 11 digits.')

    expect(checkCpfAvailabilityMock).not.toHaveBeenCalled()
  })

  it('checks availability and toggles disabled state during async validation', async () => {
    let resolveValidation
    checkCpfAvailabilityMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveValidation = resolve
        })
    )

    const wrapper = mountCpfField({
      modelValue: '123.456.789-01',
      unmasked: '12345678901',
    })

    const validator = wrapper.findComponent(ElFormItemStub).props('rules')[0].validator
    const callback = vi.fn()

    const pendingValidation = validator({}, '123.456.789-01', callback)
    await nextTick()

    expect(wrapper.find('input').attributes('disabled')).toBeDefined()

    resolveValidation({ available: true })
    await pendingValidation
    await nextTick()

    expect(checkCpfAvailabilityMock).toHaveBeenCalledWith('12345678901')
    expect(callback).toHaveBeenCalledWith(undefined)
    expect(wrapper.find('input').attributes('disabled')).toBeUndefined()
  })

  it('returns backend cpf validation error from availability check', async () => {
    checkCpfAvailabilityMock.mockRejectedValue({
      data: {
        errors: {
          cpf: ['CPF is already registered.'],
        },
      },
    })

    const wrapper = mountCpfField({
      modelValue: '123.456.789-01',
      unmasked: '12345678901',
    })
    const validator = wrapper.findComponent(ElFormItemStub).props('rules')[0].validator
    const callback = vi.fn()

    await validator({}, '123.456.789-01', callback)

    expect(callback).toHaveBeenCalledWith(expect.any(Error))
    expect(callback.mock.calls[0][0].message).toBe('CPF is already registered.')
  })

  it('uses default validation message when cpf availability error has no details', async () => {
    checkCpfAvailabilityMock.mockRejectedValue({})

    const wrapper = mountCpfField({
      modelValue: '123.456.789-01',
      unmasked: '12345678901',
    })
    const validator = wrapper.findComponent(ElFormItemStub).props('rules')[0].validator
    const callback = vi.fn()

    await validator({}, '123.456.789-01', callback)

    expect(callback).toHaveBeenCalledWith(expect.any(Error))
    expect(callback.mock.calls[0][0].message).toBe('Unable to validate CPF.')
  })

  it('does not attach validation rules when validate is false', () => {
    const wrapper = mountCpfField({
      validate: false,
    })

    expect(wrapper.findComponent(ElFormItemStub).props('rules')).toEqual([])
  })
})
