import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'

import AdminSchoolForm from './AdminSchoolForm.vue'

const validateMock = vi.hoisted(() => vi.fn())

vi.mock('element-plus', () => ({
  ElMessage: {
    error: vi.fn(),
  },
}))

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
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('input', {
      type: props.type,
      value: String(props.modelValue ?? ''),
      onInput: (event) => emit('update:modelValue', event.target.value),
    })
  },
})

const ElSelectStub = defineComponent({
  name: 'ElSelect',
  props: {
    modelValue: {
      type: [String, Number, Array],
      default: '',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    return () => h(
      'select',
      {
        multiple: props.multiple,
        value: props.multiple ? undefined : String(props.modelValue ?? ''),
        onChange: (event) => {
          if (props.multiple) {
            const values = Array.from(event.target.selectedOptions).map((option) => option.value)
            emit('update:modelValue', values)
            return
          }

          emit('update:modelValue', event.target.value)
        },
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
    return () => h('button', { type: 'button', onClick: () => emit('click') }, slots.default?.())
  },
})

const CnpjFieldStub = defineComponent({
  name: 'CnpjField',
  props: {
    modelValue: {
      type: String,
      default: '',
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
    return () => h('input', {
      value: props.modelValue,
      'data-testid': 'cnpj-field',
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

const PhoneFieldStub = defineComponent({
  name: 'PhoneField',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'update:unmasked'],
  setup(props, { emit }) {
    return () => h('input', {
      value: props.modelValue,
      'data-testid': 'phone-field',
      onInput: (event) => {
        const value = String(event.target.value || '')
        emit('update:modelValue', value)
        emit('update:unmasked', value.replace(/\D/g, ''))
      },
    })
  },
})

const ElColorPickerStub = defineComponent({
  name: 'ElColorPicker',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('input', {
      value: props.modelValue,
      'data-testid': 'color-picker',
      onInput: (event) => emit('update:modelValue', event.target.value),
    })
  },
})

describe('AdminSchoolForm', () => {
  beforeEach(() => {
    validateMock.mockReset()
    validateMock.mockResolvedValue(undefined)
  })

  it('hydrates school + address values and submits normalized payload', async () => {
    const wrapper = mount(AdminSchoolForm, {
      props: {
        submitLabel: 'Create school',
        referenceData: {
          administrativeTypes: [{ id: 1, label: 'Public' }],
          legalNatures: [{ id: 2, label: 'Non Profit' }],
          managementTypes: [{ id: 3, label: 'Community' }],
          pedagogicalApproaches: [{ id: 4, name: 'Constructivist' }],
          educationLevels: [{ id: 5, name: 'Elementary School' }],
          modalities: [{ id: 6, name: 'On-site' }],
        },
        initialValues: {
          inep_code: '35000001',
          name: 'Escola X',
          trade_name: 'X',
          legal_name: 'Escola X Ltda',
          document: '12345678000101',
          email: 'contato@x.com',
          phone: '5511999999999',
          website: 'https://x.com',
          description: 'desc',
          administrative_type_id: 1,
          legal_nature_id: 2,
          management_type_id: 3,
          pedagogical_approach_id: 4,
          status: 1,
          timezone: 'America/Sao_Paulo',
          language: 'pt-BR',
          education_level_ids: [5],
          modality_ids: [6],
          address: {
            street: 'Rua A',
            number: '10',
            neighborhood: 'Centro',
            city: 'Campinas',
            state: 'SP',
            zip_code: '13010-000',
            country: 'Brazil',
          },
        },
      },
      global: {
        stubs: {
          ElForm: ElFormStub,
          ElFormItem: ElFormItemStub,
          ElInput: ElInputStub,
          ElSelect: ElSelectStub,
          ElOption: ElOptionStub,
          ElButton: ElButtonStub,
          CnpjField: CnpjFieldStub,
          PhoneField: PhoneFieldStub,
          ElColorPicker: ElColorPickerStub,
        },
      },
    })

    const cnpjInput = wrapper.find('[data-testid="cnpj-field"]')
    const phoneInput = wrapper.find('[data-testid="phone-field"]')
    expect(cnpjInput.attributes('data-validate')).toBe('true')
    expect(cnpjInput.attributes('readonly')).toBeUndefined()

    await cnpjInput.setValue('12.345.678/0001-90')
    await phoneInput.setValue('(11) 99999-8888')

    const submitButton = wrapper.findAll('button').find((node) => node.text() === 'Create school')
    await submitButton.trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalledTimes(1)

    const submitEvents = wrapper.emitted('submit')
    expect(submitEvents).toBeTruthy()
    expect(submitEvents[0][0]).toEqual(expect.objectContaining({
      inep_code: '35000001',
      name: 'Escola X',
      document: '12345678000190',
      phone: '11999998888',
      status: 1,
      administrative_type_id: 1,
      legal_nature_id: 2,
      management_type_id: 3,
      pedagogical_approach_id: 4,
      education_level_ids: [5],
      modality_ids: [6],
      address: expect.objectContaining({
        street: 'Rua A',
        city: 'Campinas',
        state: 'SP',
      }),
    }))
  })

  it('uses readonly cnpj without validation and omits document in edit payload', async () => {
    const wrapper = mount(AdminSchoolForm, {
      props: {
        isEdit: true,
        submitLabel: 'Update school',
        referenceData: {
          administrativeTypes: [{ id: 1, label: 'Public' }],
          legalNatures: [{ id: 2, label: 'Non Profit' }],
          managementTypes: [{ id: 3, label: 'Community' }],
          pedagogicalApproaches: [{ id: 4, name: 'Constructivist' }],
          educationLevels: [{ id: 5, name: 'Elementary School' }],
          modalities: [{ id: 6, name: 'On-site' }],
        },
        initialValues: {
          inep_code: '35000001',
          name: 'Escola X',
          document: '12345678000101',
          email: 'contato@x.com',
          phone: '5511999999999',
          administrative_type_id: 1,
          legal_nature_id: 2,
          management_type_id: 3,
          pedagogical_approach_id: 4,
          status: 1,
          education_level_ids: [5],
          modality_ids: [6],
          address: {
            street: 'Rua A',
            city: 'Campinas',
            state: 'SP',
            zip_code: '13010-000',
            country: 'Brazil',
          },
        },
      },
      global: {
        stubs: {
          ElForm: ElFormStub,
          ElFormItem: ElFormItemStub,
          ElInput: ElInputStub,
          ElSelect: ElSelectStub,
          ElOption: ElOptionStub,
          ElButton: ElButtonStub,
          CnpjField: CnpjFieldStub,
          PhoneField: PhoneFieldStub,
          ElColorPicker: ElColorPickerStub,
        },
      },
    })

    const cnpjInput = wrapper.find('[data-testid="cnpj-field"]')
    expect(cnpjInput.attributes('data-validate')).toBe('false')
    expect(cnpjInput.attributes('readonly')).toBeDefined()

    const submitButton = wrapper.findAll('button').find((node) => node.text() === 'Update school')
    await submitButton.trigger('click')
    await flushPromises()

    const submitEvents = wrapper.emitted('submit')
    expect(submitEvents).toBeTruthy()
    expect(submitEvents[0][0]).not.toHaveProperty('document')
  })
})
