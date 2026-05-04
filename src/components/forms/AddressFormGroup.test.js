import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'

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
  },
  setup(props) {
    const model = ref({
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
    })

    return () => h(AddressFormGroup, {
      title: props.title,
      propPrefix: props.propPrefix,
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
