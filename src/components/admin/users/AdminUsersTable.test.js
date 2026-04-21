import { describe, it, expect } from 'vitest'
import { defineComponent, h, inject, provide } from 'vue'
import { mount } from '@vue/test-utils'

import AdminUsersTable from './AdminUsersTable.vue'

const ElTableStub = defineComponent({
  name: 'ElTable',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    provide('tableData', props.data)
    return () => h('div', slots.default?.())
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
  setup(props, { slots }) {
    const tableData = inject('tableData', [])
    return () =>
      h('section', [
        h('h3', props.label),
        slots.default ? h('div', slots.default({ row: tableData[0] || {} })) : null,
      ])
  },
})

const ElButtonStub = defineComponent({
  name: 'ElButton',
  emits: ['click'],
  setup(_, { slots, emit }) {
    return () => h('button', { onClick: () => emit('click') }, slots.default?.())
  },
})

describe('AdminUsersTable', () => {
  it('renders masked cpf and does not render phone column', async () => {
    const wrapper = mount(AdminUsersTable, {
      props: {
        users: [
          { id: 7, name: 'Jane', email: 'jane@x.com', cpf: '12345678901', role_label: 'Admin', status: 1 },
        ],
      },
      global: {
        stubs: {
          ElTable: ElTableStub,
          ElTableColumn: ElTableColumnStub,
          ElButton: ElButtonStub,
        },
      },
    })

    expect(wrapper.text()).toContain('CPF')
    expect(wrapper.text()).not.toContain('Phone')
    expect(wrapper.text()).toContain('123.456.789-01')
    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).toContain('Admin')
  })

  it('emits edit and delete actions', async () => {
    const wrapper = mount(AdminUsersTable, {
      props: {
        users: [
          { id: 7, name: 'Jane', email: 'jane@x.com', cpf: '12345678901', role_label: 'Admin', status: 1 },
        ],
      },
      global: {
        stubs: {
          ElTable: ElTableStub,
          ElTableColumn: ElTableColumnStub,
          ElButton: ElButtonStub,
        },
      },
    })

    const [editButton, deleteButton] = wrapper.findAll('button')

    await editButton.trigger('click')
    await deleteButton.trigger('click')

    expect(wrapper.emitted('edit')?.[0]?.[0]).toEqual({
      id: 7,
      name: 'Jane',
      email: 'jane@x.com',
      cpf: '12345678901',
      role_label: 'Admin',
      status: 1,
    })

    expect(wrapper.emitted('delete')?.[0]?.[0]).toEqual({
      id: 7,
      name: 'Jane',
      email: 'jane@x.com',
      cpf: '12345678901',
      role_label: 'Admin',
      status: 1,
    })
  })
})
