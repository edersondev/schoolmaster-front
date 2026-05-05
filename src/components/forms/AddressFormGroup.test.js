import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { formContextKey } from 'element-plus'

import AddressFormGroup from './AddressFormGroup.vue'

const getAddressByZipCodeMock = vi.hoisted(() => vi.fn())

vi.mock('@/services/schoolService', () => ({
  default: {
    getAddressByZipCode: getAddressByZipCodeMock,
  },
}))

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
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () => h('input', {
      ...attrs,
      value: props.modelValue,
      onInput: (event) => emit('update:modelValue', event.target.value),
    })
  },
})

const TestHarness = defineComponent({
  components: {
    AddressFormGroup,
  },
  props: {
    title: {
      type: String,
      default: 'Address',
    },
    propPrefix: {
      type: String,
      default: 'address_',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    initialModel: {
      type: Object,
      default: () => ({
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
      }),
    },
  },
  setup(props) {
    const model = ref({ ...props.initialModel })

    return () => h(AddressFormGroup, {
      title: props.title,
      propPrefix: props.propPrefix,
      isEdit: props.isEdit,
      disabled: props.disabled,
      readonly: props.readonly,
      modelValue: model.value,
      'onUpdate:modelValue': (value) => {
        model.value = value
      },
    })
  },
})

describe('AddressFormGroup', () => {
  beforeEach(() => {
    getAddressByZipCodeMock.mockReset()
  })

  it('puts zip code first, makes auto-filled fields readonly, and fills the address from the lookup', async () => {
    getAddressByZipCodeMock.mockResolvedValue({
      street: 'Rua Exemplo',
      neighborhood: 'Centro',
      city: 'Campinas',
      state: 'SP',
    })

    const wrapper = mount(TestHarness, {
      global: {
        stubs: {
          ElFormItem: ElFormItemStub,
          ElInput: ElInputStub,
        },
      },
    })

    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(8)
    expect(inputs[0].attributes('placeholder')).toBe('00000-000')
    expect(inputs[1].attributes('placeholder')).toBe('Street')
    expect(inputs[4].attributes('placeholder')).toBe('Neighborhood')
    expect(inputs[5].attributes('placeholder')).toBe('City')
    expect(inputs[6].attributes('placeholder')).toBe('State')
    expect(inputs[1].attributes('readonly')).toBeDefined()
    expect(inputs[4].attributes('readonly')).toBeDefined()
    expect(inputs[5].attributes('readonly')).toBeDefined()
    expect(inputs[6].attributes('readonly')).toBeDefined()

    await inputs[0].setValue('13010-000')
    await flushPromises()

    expect(getAddressByZipCodeMock).toHaveBeenCalledWith('13010000')
    expect(inputs[1].element.value).toBe('Rua Exemplo')
    expect(inputs[4].element.value).toBe('Centro')
    expect(inputs[5].element.value).toBe('Campinas')
    expect(inputs[6].element.value).toBe('SP')
  })

  it('does not trigger the zip lookup in edit mode', async () => {
    getAddressByZipCodeMock.mockResolvedValue({
      street: 'Rua Alterada',
      neighborhood: 'Novo Centro',
      city: 'Sao Paulo',
      state: 'SP',
    })

    const wrapper = mount(TestHarness, {
      props: {
        isEdit: true,
        initialModel: {
          street: 'Rua Existente',
          number: '10',
          complement: 'Sala 2',
          neighborhood: 'Centro',
          city: 'Campinas',
          state: 'SP',
          zip_code: '13010000',
          country: 'Brasil',
        },
      },
      global: {
        stubs: {
          ElFormItem: ElFormItemStub,
          ElInput: ElInputStub,
        },
      },
    })

    await flushPromises()

    const inputs = wrapper.findAll('input')
    expect(getAddressByZipCodeMock).not.toHaveBeenCalled()
    expect(inputs[1].element.value).toBe('Rua Existente')
    expect(inputs[4].element.value).toBe('Centro')
    expect(inputs[5].element.value).toBe('Campinas')
    expect(inputs[6].element.value).toBe('SP')
  })

  it('in edit mode clears auto-filled fields when the zip code changes and clears validation after loading the new address', async () => {
    const clearValidate = vi.fn()
    let resolveLookup

    getAddressByZipCodeMock.mockImplementation(
      () => new Promise((resolve) => {
        resolveLookup = resolve
      })
    )

    const wrapper = mount(TestHarness, {
      props: {
        isEdit: true,
        initialModel: {
          street: 'Rua Existente',
          number: '10',
          complement: 'Sala 2',
          neighborhood: 'Centro',
          city: 'Campinas',
          state: 'SP',
          zip_code: '13010000',
          country: 'Brasil',
        },
      },
      global: {
        provide: {
          [formContextKey]: {
            clearValidate,
          },
        },
        stubs: {
          ElFormItem: ElFormItemStub,
          ElInput: ElInputStub,
        },
      },
    })

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('13010-001')

    expect(getAddressByZipCodeMock).toHaveBeenCalledWith('13010001')
    expect(inputs[1].element.value).toBe('')
    expect(inputs[4].element.value).toBe('')
    expect(inputs[5].element.value).toBe('')
    expect(inputs[6].element.value).toBe('')

    resolveLookup({
      street: 'Rua Nova',
      neighborhood: 'Bela Vista',
      city: 'Sao Paulo',
      state: 'SP',
    })
    await flushPromises()

    expect(inputs[1].element.value).toBe('Rua Nova')
    expect(inputs[4].element.value).toBe('Bela Vista')
    expect(inputs[5].element.value).toBe('Sao Paulo')
    expect(inputs[6].element.value).toBe('SP')
    expect(clearValidate).toHaveBeenCalledWith([
      'address_zip_code',
      'address_street',
      'address_neighborhood',
      'address_city',
      'address_state',
    ])
  })

  it('clears form validation for zip code and auto-filled fields after a successful lookup', async () => {
    const clearValidate = vi.fn()

    getAddressByZipCodeMock.mockResolvedValue({
      street: 'Rua Exemplo',
      neighborhood: 'Centro',
      city: 'Campinas',
      state: 'SP',
    })

    const wrapper = mount(TestHarness, {
      global: {
        provide: {
          [formContextKey]: {
            clearValidate,
          },
        },
        stubs: {
          ElFormItem: ElFormItemStub,
          ElInput: ElInputStub,
        },
      },
    })

    const [zipCodeInput] = wrapper.findAll('input')
    await zipCodeInput.setValue('13010-000')
    await flushPromises()

    expect(clearValidate).toHaveBeenCalledWith([
      'address_zip_code',
      'address_street',
      'address_neighborhood',
      'address_city',
      'address_state',
    ])
  })

  it('keeps number editable and clears auto-filled fields when zip code becomes incomplete', async () => {
    getAddressByZipCodeMock.mockResolvedValue({
      street: 'Rua Exemplo',
      neighborhood: 'Centro',
      city: 'Campinas',
      state: 'SP',
    })

    const wrapper = mount(TestHarness, {
      global: {
        stubs: {
          ElFormItem: ElFormItemStub,
          ElInput: ElInputStub,
        },
      },
    })

    const inputs = wrapper.findAll('input')
    await inputs[2].setValue('12A-3')
    await inputs[0].setValue('13010-000')
    await flushPromises()
    await inputs[0].setValue('13010-0')
    await flushPromises()

    expect(inputs[2].attributes('readonly')).toBeUndefined()
    expect(inputs[2].element.value).toBe('123')
    expect(inputs[1].element.value).toBe('')
    expect(inputs[4].element.value).toBe('')
    expect(inputs[5].element.value).toBe('')
    expect(inputs[6].element.value).toBe('')
  })

  it('clears auto-filled fields when the zip lookup fails', async () => {
    getAddressByZipCodeMock.mockRejectedValue(new Error('Lookup failed'))

    const wrapper = mount(TestHarness, {
      global: {
        stubs: {
          ElFormItem: ElFormItemStub,
          ElInput: ElInputStub,
        },
      },
    })

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('13010-000')
    await flushPromises()

    expect(getAddressByZipCodeMock).toHaveBeenCalledWith('13010000')
    expect(inputs[1].element.value).toBe('')
    expect(inputs[4].element.value).toBe('')
    expect(inputs[5].element.value).toBe('')
    expect(inputs[6].element.value).toBe('')
  })
})
