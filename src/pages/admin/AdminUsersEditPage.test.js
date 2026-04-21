import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'

const pushMock = vi.hoisted(() => vi.fn())
const fetchUserByIdMock = vi.hoisted(() => vi.fn())
const updateUserMock = vi.hoisted(() => vi.fn())
const messageSuccess = vi.hoisted(() => vi.fn())
const messageError = vi.hoisted(() => vi.fn())

const routeState = vi.hoisted(() => ({
  params: { id: '7' },
}))

const storeState = vi.hoisted(() => ({
  selectedUser: null,
  loading: false,
  error: null,
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useRoute: () => routeState,
}))

vi.mock('@/stores/userStore', () => ({
  useUserStore: () => ({
    ...storeState,
    fetchUserById: fetchUserByIdMock,
    updateUser: updateUserMock,
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
    props: {
      initialValues: {
        type: Object,
        default: () => ({}),
      },
    },
    emits: ['submit', 'cancel'],
    setup(props, { emit }) {
      return () =>
        h('div', [
          h('p', `Loaded: ${props.initialValues?.name || ''}`),
          h('button', {
            onClick: () =>
              emit('submit', {
                name: 'Updated User',
                email: 'updated@x.com',
                cpf: '98765432100',
                phone: '11988887777',
                role_id: 2,
                status: 1,
              }),
          }, 'Submit'),
          h('button', { onClick: () => emit('cancel') }, 'Cancel'),
        ])
    },
  }),
}))

import AdminUsersEditPage from './AdminUsersEditPage.vue'

describe('AdminUsersEditPage', () => {
  beforeEach(() => {
    pushMock.mockReset()
    fetchUserByIdMock.mockReset()
    updateUserMock.mockReset()
    messageSuccess.mockClear()
    messageError.mockClear()
    storeState.selectedUser = { id: 7, name: 'Loaded User' }
    storeState.loading = false
    storeState.error = null
    fetchUserByIdMock.mockResolvedValue(storeState.selectedUser)
    updateUserMock.mockResolvedValue({ id: 7, name: 'Updated User' })
    routeState.params = { id: '7' }
  })

  it('loads user on mount and updates on submit', async () => {
    const wrapper = mount(AdminUsersEditPage)

    await flushPromises()

    expect(fetchUserByIdMock).toHaveBeenCalledWith('7')
    expect(wrapper.text()).toContain('Loaded: Loaded User')

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(updateUserMock).toHaveBeenCalledWith('7', {
      name: 'Updated User',
      email: 'updated@x.com',
      cpf: '98765432100',
      phone: '11988887777',
      role_id: 2,
      status: 1,
    })
    expect(messageSuccess).toHaveBeenCalledWith('User updated successfully!')
    expect(pushMock).toHaveBeenCalledWith('/admin/users')
  })

  it('redirects to users list when cancel is emitted', async () => {
    const wrapper = mount(AdminUsersEditPage)

    await flushPromises()
    await wrapper.findAll('button')[1].trigger('click')

    expect(pushMock).toHaveBeenCalledWith('/admin/users')
  })
})
