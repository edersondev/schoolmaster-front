import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'

import AdminSchoolsTable from './AdminSchoolsTable.vue'

const ElTableStub = defineComponent({
  name: 'ElTable',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    return () => h('div', props.data.map((row) => (
      h('div', { class: 'row' }, [
        h('span', { class: 'name' }, row.name),
        h('span', { class: 'email' }, row.email),
        h('span', { class: 'cnpj' }, slots.default?.({ row }) || ''),
      ])
    )))
  },
})

const ElTableColumnStub = defineComponent({
  name: 'ElTableColumn',
  props: {
    label: {
      type: String,
      default: '',
    },
  },
  setup(_, { slots }) {
    return () => h('div', slots.default?.({ row: {} }))
  },
})

const ElButtonStub = defineComponent({
  name: 'ElButton',
  emits: ['click'],
  setup(_, { slots, emit }) {
    return () => h('button', { onClick: () => emit('click') }, slots.default?.())
  },
})

describe('AdminSchoolsTable', () => {
  it('formats document as cnpj and renders mapped administrative type + status', () => {
    const wrapper = mount(AdminSchoolsTable, {
      props: {
        schools: [
          {
            id: 1,
            name: 'School A',
            email: 'a@test.com',
            document: '12345678000190',
            administrative_type_id: 2,
            status: 1,
          },
        ],
        administrativeTypeLabelMap: {
          '2': 'Private',
        },
      },
      global: {
        stubs: {
          ElTable: ElTableStub,
          ElTableColumn: ElTableColumnStub,
          ElButton: ElButtonStub,
        },
      },
    })

    const vm = wrapper.vm
    expect(vm.formatCnpj('12345678000190')).toBe('12.345.678/0001-90')
    expect(vm.formatAdministrativeType(2)).toBe('Private')
    expect(vm.formatStatusLabel(1)).toBe('Active')
  })

  it('emits edit and delete events', async () => {
    const school = { id: 1, name: 'School A' }

    const wrapper = mount(AdminSchoolsTable, {
      props: {
        schools: [school],
      },
      global: {
        stubs: {
          ElTable: ElTableStub,
          ElTableColumn: ElTableColumnStub,
          ElButton: ElButtonStub,
        },
      },
    })

    await wrapper.vm.handleEdit(school)
    await wrapper.vm.handleDelete(school)

    expect(wrapper.emitted('edit')).toEqual([[school]])
    expect(wrapper.emitted('delete')).toEqual([[school]])
  })
})
