import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import { baseAdminStubs } from '@/__tests__/adminTestUtils'
import AdminLayout from './AdminLayout.vue'

const AdminSidebarStub = defineComponent({
  name: 'AdminSidebar',
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    return () => h('div', { 'data-testid': 'admin-sidebar', 'data-collapsed': String(props.collapsed) })
  },
})

const AdminTopbarStub = defineComponent({
  name: 'AdminTopbar',
  emits: ['toggleDesktopSidebar', 'toggleMobileSidebar'],
  setup(_, { emit }) {
    return () =>
      h('div', { 'data-testid': 'admin-topbar' }, [
        h('button', { 'data-testid': 'toggle-desktop', onClick: () => emit('toggleDesktopSidebar') }, 'Toggle desktop'),
        h('button', { 'data-testid': 'toggle-mobile', onClick: () => emit('toggleMobileSidebar') }, 'Toggle mobile'),
      ])
  },
})

describe('AdminLayout', () => {
  it('toggles the sidebar width when desktop toggle fires', async () => {
    const wrapper = mount(AdminLayout, {
      global: {
        stubs: {
          ...baseAdminStubs,
          AdminSidebar: AdminSidebarStub,
          AdminTopbar: AdminTopbarStub,
        },
      },
    })

    const aside = wrapper.find('aside')
    expect(aside.classes()).toContain('w-72')

    await wrapper.find('[data-testid="toggle-desktop"]').trigger('click')

    expect(aside.classes()).toContain('w-20')
    expect(wrapper.find('[data-testid="admin-sidebar"]').attributes('data-collapsed')).toBe('true')
  })

  it('opens the mobile drawer when mobile toggle fires', async () => {
    const wrapper = mount(AdminLayout, {
      global: {
        stubs: {
          ...baseAdminStubs,
          AdminSidebar: AdminSidebarStub,
          AdminTopbar: AdminTopbarStub,
        },
      },
    })

    expect(wrapper.find('[data-testid="drawer"]').attributes('data-open')).toBe('false')

    await wrapper.find('[data-testid="toggle-mobile"]').trigger('click')

    expect(wrapper.find('[data-testid="drawer"]').attributes('data-open')).toBe('true')
  })

  it('syncs drawer v-model updates back to the layout state', async () => {
    const wrapper = mount(AdminLayout, {
      global: {
        stubs: {
          ...baseAdminStubs,
          AdminSidebar: AdminSidebarStub,
          AdminTopbar: AdminTopbarStub,
        },
      },
    })

    const drawer = wrapper.findComponent({ name: 'ElDrawer' })

    expect(drawer.attributes('data-open')).toBe('false')

    drawer.vm.$emit('update:modelValue', true)
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'ElDrawer' }).attributes('data-open')).toBe('true')
  })
})
