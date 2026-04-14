import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'

import AdminUserForm from './AdminUserForm.vue'

const validateMock = vi.hoisted(() => vi.fn())

const ElFormStub = defineComponent({
  name: 'ElForm',
  setup(_, { slots, expose }) {
    expose({
      validate: validateMock,
    })

    return () => h('form', slots.default?.())
  },
})

const ElFormItemStub = defineComponent({
  name: 'ElFormItem',
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
    type: {
      type: String,
      default: 'text',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, emit }) {
    return () =>
      h('input', {
        ...attrs,
        type: props.type,
        value: props.modelValue,
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

const ElSelectStub = defineComponent({
  name: 'ElSelect',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(
        'select',
        {
          value: String(props.modelValue),
          onChange: (event) => emit('update:modelValue', event.target.value),
        },
        []
      )
  },
})

const ElOptionStub = defineComponent({
  name: 'ElOption',
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
  },
  setup() {
    return () => null
  },
})

const ElButtonStub = defineComponent({
  name: 'ElButton',
  emits: ['click'],
  setup(_, { slots, emit }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          onClick: () => emit('click'),
        },
        slots.default?.()
      )
  },
})

describe('AdminUserForm', () => {
  beforeEach(() => {
    validateMock.mockReset()
    validateMock.mockResolvedValue(undefined)
  })

  it('applies cpf/phone mask UX settings and submits unmasked values in create mode', async () => {
    const wrapper = mount(AdminUserForm, {
      props: {
        submitLabel: 'Create user',
      },
      global: {
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
        stubs: {
          ElForm: ElFormStub,
          ElFormItem: ElFormItemStub,
          ElInput: ElInputStub,
          ElSelect: ElSelectStub,
          ElOption: ElOptionStub,
          ElButton: ElButtonStub,
        },
      },
    })

    const [nameInput, emailInput, cpfInput, phoneInput, passwordInput] = wrapper.findAll('input')

    expect(cpfInput.attributes('placeholder')).toBe('000.000.000-00')
    expect(cpfInput.attributes('maxlength')).toBe('14')
    expect(phoneInput.attributes('placeholder')).toBe('(00) 00000-0000')
    expect(phoneInput.attributes('maxlength')).toBe('15')

    await nameInput.setValue('New User')
    await emailInput.setValue('new@schoolmaster.test')
    await cpfInput.setValue('123.456.789-01')
    await phoneInput.setValue('(11) 99999-0000')
    await passwordInput.setValue('password123')

    const submitButton = wrapper.findAll('button').find((node) => node.text() === 'Create user')
    await submitButton.trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalledTimes(1)

    const submitEvents = wrapper.emitted('submit')
    expect(submitEvents).toBeTruthy()
    expect(submitEvents[0][0]).toEqual({
      name: 'New User',
      email: 'new@schoolmaster.test',
      cpf: '12345678901',
      phone: '11999990000',
      role: 'admin',
      status: 1,
      password: 'password123',
    })
  })

  it('does not include password in edit mode payload', async () => {
    const wrapper = mount(AdminUserForm, {
      props: {
        isEdit: true,
        submitLabel: 'Save changes',
        initialValues: {
          name: 'Existing User',
          email: 'existing@schoolmaster.test',
          cpf: '12345678901',
          phone: '11988887777',
          role: 'teacher',
          status: 1,
        },
      },
      global: {
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
        stubs: {
          ElForm: ElFormStub,
          ElFormItem: ElFormItemStub,
          ElInput: ElInputStub,
          ElSelect: ElSelectStub,
          ElOption: ElOptionStub,
          ElButton: ElButtonStub,
        },
      },
    })

    expect(wrapper.text()).not.toContain('Password')

    const [nameInput, emailInput, cpfInput, phoneInput] = wrapper.findAll('input')
    await nameInput.setValue('Existing User Edited')
    await emailInput.setValue('existing-edited@schoolmaster.test')
    await cpfInput.setValue('987.654.321-00')
    await phoneInput.setValue('(11) 97777-6666')

    const submitButton = wrapper.findAll('button').find((node) => node.text() === 'Save changes')
    await submitButton.trigger('click')
    await flushPromises()

    const submitEvents = wrapper.emitted('submit')
    expect(submitEvents).toBeTruthy()
    expect(submitEvents[0][0]).toEqual({
      name: 'Existing User Edited',
      email: 'existing-edited@schoolmaster.test',
      cpf: '98765432100',
      phone: '11977776666',
      role: 'teacher',
      status: 1,
    })
    expect(submitEvents[0][0].password).toBeUndefined()
  })
})
