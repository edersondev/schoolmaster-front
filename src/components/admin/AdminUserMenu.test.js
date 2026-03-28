import { beforeEach, describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

import { baseAdminStubs } from '@/__tests__/adminTestUtils'

const pushMock = vi.fn()
const logoutMock = vi.hoisted(() => vi.fn())
const authStoreState = vi.hoisted(() => ({
  user: null,
  logout: logoutMock,
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => authStoreState,
}))

import AdminUserMenu from './AdminUserMenu.vue'

const ArrowUpStub = defineComponent({
  name: 'ArrowUp',
  setup() {
    return () => h('span', 'ArrowUp')
  },
})

const ArrowDownStub = defineComponent({
  name: 'ArrowDown',
  setup() {
    return () => h('span', 'ArrowDown')
  },
})

describe('AdminUserMenu', () => {
  beforeEach(() => {
    pushMock.mockClear()
    logoutMock.mockReset()
    logoutMock.mockResolvedValue(undefined)
    authStoreState.user = {
      id: 1,
      name: 'Jordan Lee',
      email: 'jordan.lee@schoolmaster.test',
    }
  })

  it('renders the user details', () => {
    const wrapper = mount(AdminUserMenu, {
      global: {
        stubs: baseAdminStubs,
      },
    })

    expect(wrapper.text()).toContain('Jordan Lee')
    expect(wrapper.text()).toContain('jordan.lee@schoolmaster.test')
  })

  it('routes when a command is selected', () => {
    const wrapper = mount(AdminUserMenu, {
      global: {
        stubs: {
          ...baseAdminStubs,
          ArrowUp: ArrowUpStub,
          ArrowDown: ArrowDownStub,
        },
      },
    })

    wrapper.findComponent({ name: 'ElDropdown' }).vm.$emit('command', 'account-settings')

    expect(pushMock).toHaveBeenCalledWith({ name: 'account-settings' })
    expect(wrapper.text()).toContain('Jordan')
  })

  it('falls back to a generic name when user name is missing', () => {
    authStoreState.user = {
      id: 1,
      email: 'jordan.lee@schoolmaster.test',
    }

    const wrapper = mount(AdminUserMenu, {
      global: {
        stubs: baseAdminStubs,
      },
    })

    expect(wrapper.text()).toContain('User')
    expect(wrapper.text()).toContain('jordan.lee@schoolmaster.test')
  })

  it('handles dropdown visibility and ignores empty commands', async () => {
    const wrapper = mount(AdminUserMenu, {
      global: {
        stubs: {
          ...baseAdminStubs,
          ArrowUp: ArrowUpStub,
          ArrowDown: ArrowDownStub,
        },
      },
    })

    const dropdown = wrapper.findComponent({ name: 'ElDropdown' })

    dropdown.vm.$emit('visible-change', true)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('ArrowUp')

    dropdown.vm.$emit('visible-change', false)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('ArrowDown')
    dropdown.vm.$emit('command', '')

    expect(pushMock).not.toHaveBeenCalled()
  })

  it('signs out and redirects to login', async () => {
    const wrapper = mount(AdminUserMenu, {
      global: {
        stubs: baseAdminStubs,
      },
    })

    wrapper.findComponent({ name: 'ElDropdown' }).vm.$emit('command', 'sign-out')
    await flushPromises()

    expect(logoutMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith({ name: 'login' })
  })
})
