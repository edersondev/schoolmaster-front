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
  props: {
    error: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { 'data-testid': 'form-item' }, [
        slots.default?.(),
        props.error ? h('p', { 'data-testid': 'form-item-error' }, props.error) : null,
      ])
  },
})

export const ElInputStub = defineComponent({
  name: 'ElInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'input', 'blur', 'maska'],
  setup(props, { attrs, emit }) {
    return () =>
      h('input', {
        ...attrs,
        value: props.modelValue,
        readonly: props.readonly,
        onInput: (event) => {
          const unmasked = String(event.target.value || '').replace(/\D/g, '')
          emit('update:modelValue', event.target.value)
          emit('input', event.target.value)
          emit('maska', {
            masked: event.target.value,
            unmasked,
            completed: unmasked.length === 11,
          })
        },
        onBlur: () => emit('blur'),
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
    directives: {
      maska: {
        mounted(el, binding) {
          const updateTarget = (value) => {
            if (!binding.arg || !binding.instance) return

            const unmasked = String(value || '').replace(/\D/g, '')
            const resolvedValue = binding.modifiers.unmasked
              ? unmasked
              : binding.modifiers.completed
                ? unmasked.length === 11
                : String(value || '')

            binding.instance[binding.arg] = resolvedValue
          }

          updateTarget(el.value)
          el.addEventListener('input', (event) => updateTarget(event.target.value))
        },
      },
    },
    validateMock,
    resetFieldsMock,
  }
}
