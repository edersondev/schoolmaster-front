import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { ElButtonStub, ElInputStub } from '@/__tests__/adminTestUtils'

const pushMock = vi.hoisted(() => vi.fn())
const fetchUsersMock = vi.hoisted(() => vi.fn())
const deleteUserMock = vi.hoisted(() => vi.fn())
const messageSuccess = vi.hoisted(() => vi.fn())
const messageError = vi.hoisted(() => vi.fn())
const confirmMock = vi.hoisted(() => vi.fn())

const storeState = vi.hoisted(() => ({
  users: [],
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
    fetchUsers: fetchUsersMock,
    deleteUser: deleteUserMock,
  }),
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: messageSuccess,
    error: messageError,
  },
  ElMessageBox: {
    confirm: confirmMock,
  },
}))

vi.mock('@/components/admin/users/AdminUsersTable.vue', () => ({
  default: defineComponent({
    name: 'AdminUsersTable',
    props: {
      users: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['edit', 'delete'],
    setup(props, { emit }) {
      return () =>
        h('div', [
          h('p', `Rows: ${props.users.length}`),
          h('button', { onClick: () => emit('edit', props.users[0]) }, 'Emit Edit'),
          h('button', { onClick: () => emit('delete', props.users[0]) }, 'Emit Delete'),
        ])
    },
  }),
}))

import AdminUsersListPage from './AdminUsersListPage.vue'

describe('AdminUsersListPage', () => {
  beforeEach(() => {
    pushMock.mockReset()
    fetchUsersMock.mockReset()
    deleteUserMock.mockReset()
    messageSuccess.mockClear()
    messageError.mockClear()
    confirmMock.mockReset()
    storeState.users = [
      { id: 1, name: 'Admin User', email: 'admin@x.com', cpf: '111', phone: '999', role: { id: 1, name: 'admin' }, status: 1 },
      { id: 2, name: 'Teacher User', email: 'teacher@x.com', cpf: '222', phone: '888', role: { id: 2, name: 'teacher' }, status: 1 },
    ]
    storeState.loading = false
    storeState.error = null
    fetchUsersMock.mockResolvedValue(storeState.users)
    deleteUserMock.mockResolvedValue(null)
    confirmMock.mockResolvedValue(true)
  })

  it('fetches users on mount and renders heading', async () => {
    const wrapper = mount(AdminUsersListPage, {
      global: {
        stubs: {
          ElButton: ElButtonStub,
          ElInput: ElInputStub,
        },
      },
    })

    await flushPromises()

    expect(fetchUsersMock).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('Users')
    expect(wrapper.text()).toContain('Rows: 2')
  })

  it('navigates to create page', async () => {
    const wrapper = mount(AdminUsersListPage, {
      global: {
        stubs: {
          ElButton: ElButtonStub,
          ElInput: ElInputStub,
        },
      },
    })

    await flushPromises()
    const createButton = wrapper.findAll('button').find((node) => node.text() === 'Create user')
    await createButton.trigger('click')

    expect(pushMock).toHaveBeenCalledWith('/admin/users/create')
  })

  it('handles edit and delete events from table', async () => {
    const wrapper = mount(AdminUsersListPage, {
      global: {
        stubs: {
          ElButton: ElButtonStub,
          ElInput: ElInputStub,
        },
      },
    })

    await flushPromises()

    const editButton = wrapper.findAll('button').find((node) => node.text() === 'Emit Edit')
    const deleteButton = wrapper.findAll('button').find((node) => node.text() === 'Emit Delete')

    await editButton.trigger('click')
    expect(pushMock).toHaveBeenCalledWith('/admin/users/1/edit')

    await deleteButton.trigger('click')
    await flushPromises()

    expect(confirmMock).toHaveBeenCalledTimes(1)
    expect(deleteUserMock).toHaveBeenCalledWith(1)
    expect(messageSuccess).toHaveBeenCalledWith('User deleted successfully!')
  })

  it('does not filter users by phone anymore', async () => {
    const wrapper = mount(AdminUsersListPage, {
      global: {
        stubs: {
          ElButton: ElButtonStub,
          ElInput: ElInputStub,
        },
      },
    })

    await flushPromises()

    const searchInput = wrapper.find('input')
    await searchInput.setValue('888')
    await flushPromises()

    expect(wrapper.text()).toContain('Rows: 0')
  })

  it('filters users by role label derived from user role object', async () => {
    const wrapper = mount(AdminUsersListPage, {
      global: {
        stubs: {
          ElButton: ElButtonStub,
          ElInput: ElInputStub,
        },
      },
    })

    await flushPromises()

    const searchInput = wrapper.find('input')
    await searchInput.setValue('teacher')
    await flushPromises()

    expect(wrapper.text()).toContain('Rows: 1')
  })
})
