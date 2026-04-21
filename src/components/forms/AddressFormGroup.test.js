import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'

import AddressFormGroup from './AddressFormGroup.vue'

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

describe('AddressFormGroup', () => {
  it('emits object updates and enforces numeric-only number/zip code', async () => {
    const wrapper = mount(AddressFormGroup, {
      props: {
        title: 'Address',
        propPrefix: 'address_',
        modelValue: {
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          zip_code: '',
          country: '',
        },
      },
      global: {
        stubs: {
          ElFormItem: ElFormItemStub,
          ElInput: ElInputStub,
        },
      },
    })

    const inputs = wrapper.findAll('input')
    await inputs[1].setValue('12A-3')
    await inputs[6].setValue('13010-000')

    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()

    const numberPayload = events.find((item) => item[0]?.number === '123')?.[0]
    const zipPayload = events.find((item) => item[0]?.zip_code === '13010000')?.[0]

    expect(numberPayload).toBeTruthy()
    expect(zipPayload).toBeTruthy()
  })
})
