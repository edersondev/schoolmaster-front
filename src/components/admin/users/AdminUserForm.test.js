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
  setup(props, { slots, emit }) {
    return () =>
      h(
        'select',
        {
          value: String(props.modelValue),
          onChange: (event) => emit('update:modelValue', event.target.value),
        },
        slots.default?.()
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
  setup(props) {
    return () => h('option', { value: String(props.value) }, props.label)
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

const CpfFieldStub = defineComponent({
  name: 'CpfField',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    unmasked: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '000.000.000-00',
    },
    maxlength: {
      type: [String, Number],
      default: 14,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    validate: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'update:unmasked'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        value: props.modelValue,
        placeholder: props.placeholder,
        maxlength: String(props.maxlength),
        readonly: props.readonly,
        'data-validate': String(props.validate),
        onInput: (event) => {
          const value = String(event.target.value || '')
          emit('update:modelValue', value)
          emit('update:unmasked', value.replace(/\D/g, ''))
        },
      })
  },
})

const defaultRoles = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'teacher' },
]

describe('AdminUserForm', () => {
  beforeEach(() => {
    validateMock.mockReset()
    validateMock.mockResolvedValue(undefined)
  })

  it('applies cpf/phone mask UX settings and submits unmasked values in create mode', async () => {
    const wrapper = mount(AdminUserForm, {
      props: {
        submitLabel: 'Create user',
        roles: defaultRoles,
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
          CpfField: CpfFieldStub,
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
      role_id: 1,
      status: 1,
      password: 'password123',
    })
  })

  it('renders role options from API data', () => {
    const wrapper = mount(AdminUserForm, {
      props: {
        submitLabel: 'Create user',
        roles: defaultRoles,
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
          CpfField: CpfFieldStub,
        },
      },
    })

    const options = wrapper.findAll('option').map((option) => option.text())
    expect(options).toContain('Admin')
    expect(options).toContain('Teacher')
  })

  it('does not include password in edit mode payload', async () => {
    const wrapper = mount(AdminUserForm, {
      props: {
        isEdit: true,
        submitLabel: 'Save changes',
        roles: defaultRoles,
        initialValues: {
          name: 'Existing User',
          email: 'existing@schoolmaster.test',
          cpf: '12345678901',
          phone: '11988887777',
          role_id: 2,
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
          CpfField: CpfFieldStub,
        },
      },
    })

    expect(wrapper.text()).not.toContain('Password')

    const [nameInput, emailInput, cpfInput, phoneInput] = wrapper.findAll('input')
    expect(cpfInput.attributes('readonly')).toBeDefined()
    expect(cpfInput.attributes('data-validate')).toBe('false')

    await nameInput.setValue('Existing User Edited')
    await emailInput.setValue('existing-edited@schoolmaster.test')
    await phoneInput.setValue('(11) 97777-6666')

    const submitButton = wrapper.findAll('button').find((node) => node.text() === 'Save changes')
    await submitButton.trigger('click')
    await flushPromises()

    const submitEvents = wrapper.emitted('submit')
    expect(submitEvents).toBeTruthy()
    expect(submitEvents[0][0]).toEqual({
      name: 'Existing User Edited',
      email: 'existing-edited@schoolmaster.test',
      phone: '11977776666',
      role_id: 2,
      status: 1,
    })
    expect(submitEvents[0][0].cpf).toBeUndefined()
    expect(submitEvents[0][0].password).toBeUndefined()
  })

  it('hydrates role from initialValues.role.id when role_id is missing', async () => {
    const wrapper = mount(AdminUserForm, {
      props: {
        isEdit: true,
        submitLabel: 'Save changes',
        roles: defaultRoles,
        initialValues: {
          name: 'Existing User',
          email: 'existing@schoolmaster.test',
          cpf: '12345678901',
          phone: '11988887777',
          role: { id: 2, name: 'teacher' },
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
          CpfField: CpfFieldStub,
        },
      },
    })

    const [nameInput] = wrapper.findAll('input')
    await nameInput.setValue('Existing User Edited')

    const submitButton = wrapper.findAll('button').find((node) => node.text() === 'Save changes')
    await submitButton.trigger('click')
    await flushPromises()

    expect(wrapper.emitted('submit')?.[0]?.[0]?.role_id).toBe(2)
  })

  it('does not emit submit when form validation fails', async () => {
    validateMock.mockRejectedValueOnce(new Error('invalid'))

    const wrapper = mount(AdminUserForm, {
      props: {
        submitLabel: 'Create user',
        roles: defaultRoles,
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
          CpfField: CpfFieldStub,
        },
      },
    })

    const submitButton = wrapper.findAll('button').find((node) => node.text() === 'Create user')
    await submitButton.trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  it('emits cancel when cancel button is clicked', async () => {
    const wrapper = mount(AdminUserForm, {
      props: {
        submitLabel: 'Create user',
        roles: defaultRoles,
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
          CpfField: CpfFieldStub,
        },
      },
    })

    const cancelButton = wrapper.findAll('button').find((node) => node.text() === 'Cancel')
    await cancelButton.trigger('click')

    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
