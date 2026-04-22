import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'

const pushMock = vi.hoisted(() => vi.fn())
const createUserMock = vi.hoisted(() => vi.fn())
const fetchRolesMock = vi.hoisted(() => vi.fn())
const messageSuccess = vi.hoisted(() => vi.fn())
const messageError = vi.hoisted(() => vi.fn())

const storeState = vi.hoisted(() => ({
  loading: false,
  error: null,
}))
const roleStoreState = vi.hoisted(() => ({
  roles: [],
  loading: false,
  error: null,
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

vi.mock('@/stores/userStore', () => ({
  useUserStore: () => ({
    ...storeState,
    createUser: createUserMock,
  }),
}))

vi.mock('@/stores/roleStore', () => ({
  useRoleStore: () => ({
    ...roleStoreState,
    fetchRoles: fetchRolesMock,
  }),
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: messageSuccess,
    error: messageError,
  },
}))

vi.mock('@/components/admin/users/AdminUserForm.vue', () => ({
  default: defineComponent({
    name: 'AdminUserForm',
    emits: ['submit', 'cancel'],
    setup(_, { emit }) {
      return () =>
        h('div', [
          h('button', {
            onClick: () =>
              emit('submit', {
                name: 'New User',
                email: 'new@x.com',
                cpf: '12345678901',
                phone: '11999990000',
                role_id: 1,
                status: 1,
                password: 'password123',
              }),
          }, 'Submit'),
          h('button', { onClick: () => emit('cancel') }, 'Cancel'),
        ])
    },
  }),
}))

import AdminUsersCreatePage from './AdminUsersCreatePage.vue'

describe('AdminUsersCreatePage', () => {
  beforeEach(() => {
    pushMock.mockReset()
    createUserMock.mockReset()
    fetchRolesMock.mockReset()
    messageSuccess.mockClear()
    messageError.mockClear()
    storeState.loading = false
    storeState.error = null
    roleStoreState.roles = [{ id: 1, name: 'admin' }]
    roleStoreState.loading = false
    roleStoreState.error = null
    createUserMock.mockResolvedValue({ id: 1 })
    fetchRolesMock.mockResolvedValue(roleStoreState.roles)
  })

  it('creates a user and redirects to users list', async () => {
    const wrapper = mount(AdminUsersCreatePage)

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(createUserMock).toHaveBeenCalledWith({
      name: 'New User',
      email: 'new@x.com',
      cpf: '12345678901',
      phone: '11999990000',
      role_id: 1,
      status: 1,
      password: 'password123',
    })
    expect(messageSuccess).toHaveBeenCalledWith('User created successfully!')
    expect(pushMock).toHaveBeenCalledWith('/admin/users')
  })

  it('redirects to users list when form emits cancel', async () => {
    const wrapper = mount(AdminUsersCreatePage)

    await wrapper.findAll('button')[1].trigger('click')

    expect(pushMock).toHaveBeenCalledWith('/admin/users')
  })

  it('fetches roles on mount', async () => {
    mount(AdminUsersCreatePage)

    await flushPromises()

    expect(fetchRolesMock).toHaveBeenCalledTimes(1)
  })
})
