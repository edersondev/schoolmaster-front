import { defineComponent, h } from 'vue'
import { vi } from 'vitest'

export const PublicLayoutStub = defineComponent({
  name: 'PublicLayout',
  setup(_, { slots }) {
    return () => h('div', { 'data-testid': 'public-layout' }, slots.default?.())
  },
})

export const ElFormItemStub = defineComponent({
  name: 'ElFormItem',
  setup(_, { slots }) {
    return () => h('div', { 'data-testid': 'form-item' }, slots.default?.())
  },
})

export const ElInputStub = defineComponent({
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

export const ElButtonStub = defineComponent({
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

export const RouterLinkStub = defineComponent({
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

export const baseStubs = {
  PublicLayout: PublicLayoutStub,
  ElFormItem: ElFormItemStub,
  ElInput: ElInputStub,
  ElButton: ElButtonStub,
  RouterLink: RouterLinkStub,
}

export const createFormStubs = ({ validateResult } = {}) => {
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

  return {
    stubs: {
      ...baseStubs,
      ElForm: ElFormStub,
    },
    validateMock,
    resetFieldsMock,
  }
}
