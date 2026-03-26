import { defineComponent, h } from 'vue'

export const ElIconStub = defineComponent({
  name: 'ElIcon',
  setup(_, { slots }) {
    return () => h('span', { 'data-testid': 'icon' }, slots.default?.())
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

export const ElInputStub = defineComponent({
  name: 'ElInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    return () =>
      h('label', { 'data-testid': 'input' }, [
        slots.prefix?.(),
        h('input', {
          value: props.modelValue,
          onInput: (event) => emit('update:modelValue', event.target.value),
        }),
      ])
  },
})

export const ElMenuStub = defineComponent({
  name: 'ElMenu',
  setup(_, { slots }) {
    return () => h('div', { 'data-testid': 'menu' }, slots.default?.())
  },
})

export const ElSubMenuStub = defineComponent({
  name: 'ElSubMenu',
  setup(_, { slots }) {
    return () =>
      h('div', { 'data-testid': 'submenu' }, [
        h('div', { 'data-testid': 'submenu-title' }, slots.title?.()),
        slots.default?.(),
      ])
  },
})

export const ElMenuItemStub = defineComponent({
  name: 'ElMenuItem',
  setup(_, { slots }) {
    return () => h('div', { 'data-testid': 'menu-item' }, slots.default?.())
  },
})

export const ElDropdownStub = defineComponent({
  name: 'ElDropdown',
  emits: ['visible-change', 'command'],
  setup(_, { slots }) {
    return () =>
      h('div', { 'data-testid': 'dropdown' }, [
        slots.default?.(),
        slots.dropdown?.(),
      ])
  },
})

export const ElDropdownMenuStub = defineComponent({
  name: 'ElDropdownMenu',
  setup(_, { slots }) {
    return () => h('div', { 'data-testid': 'dropdown-menu' }, slots.default?.())
  },
})

export const ElDropdownItemStub = defineComponent({
  name: 'ElDropdownItem',
  setup(_, { slots }) {
    return () => h('div', { 'data-testid': 'dropdown-item' }, slots.default?.())
  },
})

export const ElBadgeStub = defineComponent({
  name: 'ElBadge',
  setup(_, { slots }) {
    return () => h('div', { 'data-testid': 'badge' }, slots.default?.())
  },
})

export const ElDrawerStub = defineComponent({
  name: 'ElDrawer',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          'data-testid': 'drawer',
          'data-open': String(props.modelValue),
        },
        slots.default?.()
      )
  },
})

export const RouterViewStub = defineComponent({
  name: 'RouterView',
  setup() {
    return () => h('div', { 'data-testid': 'router-view' }, 'Route Content')
  },
})

export const baseAdminStubs = {
  ElIcon: ElIconStub,
  ElButton: ElButtonStub,
  ElInput: ElInputStub,
  ElMenu: ElMenuStub,
  ElSubMenu: ElSubMenuStub,
  ElMenuItem: ElMenuItemStub,
  ElDropdown: ElDropdownStub,
  ElDropdownMenu: ElDropdownMenuStub,
  ElDropdownItem: ElDropdownItemStub,
  ElBadge: ElBadgeStub,
  ElDrawer: ElDrawerStub,
  RouterView: RouterViewStub,
}
