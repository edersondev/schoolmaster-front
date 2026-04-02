import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import { createFormStubs } from '@/__tests__/pageTestUtils'
import EditProfilePage from './EditProfilePage.vue'

const fetchProfileMock = vi.hoisted(() => vi.fn())
const updateProfileMock = vi.hoisted(() => vi.fn())
const fetchMeMock = vi.hoisted(() => vi.fn())
const messageSuccess = vi.hoisted(() => vi.fn())
const messageError = vi.hoisted(() => vi.fn())

const userStoreState = vi.hoisted(() => ({
  profile: null,
  loading: false,
  error: null,
}))

const authStoreState = vi.hoisted(() => ({
  user: null,
  token: null,
  loading: false,
}))

vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    ...authStoreState,
    fetchMe: fetchMeMock,
  }),
}))

vi.mock('@/stores/userStore', () => ({
  useUserStore: () => ({
    ...userStoreState,
    fetchProfile: fetchProfileMock,
    updateProfile: updateProfileMock,
  }),
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: messageSuccess,
    error: messageError,
  },
}))

describe('EditProfilePage', () => {
  beforeEach(() => {
    fetchProfileMock.mockReset()
    updateProfileMock.mockReset()
    fetchMeMock.mockReset()
    messageSuccess.mockClear()
    messageError.mockClear()
    userStoreState.profile = null
    userStoreState.loading = false
    userStoreState.error = null
    authStoreState.user = null
    authStoreState.token = null
    authStoreState.loading = false
    fetchProfileMock.mockResolvedValue(null)
    fetchMeMock.mockResolvedValue(null)
  })

  it('renders the edit profile heading', () => {
    const { stubs } = createFormStubs()
    const wrapper = mount(EditProfilePage, {
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Edit Profile')
  })

  it('shows a success toast after a valid save', async () => {
    const { stubs, validateMock } = createFormStubs()
    authStoreState.user = {
      id: 1,
      name: 'Current User',
      email: 'current@schoolmaster.test',
    }
    fetchProfileMock.mockResolvedValue({
      id: 1,
      name: 'Current User',
      email: 'current@schoolmaster.test',
    })
    updateProfileMock.mockResolvedValue({
      id: 1,
      name: 'Jane Doe',
      email: 'jane@schoolmaster.test',
    })

    const wrapper = mount(EditProfilePage, {
      global: {
        stubs,
      },
    })

    await flushPromises()

    const [nameInput, emailInput] = wrapper.findAll('input')
    await nameInput.setValue('Jane Doe')
    await emailInput.setValue('jane@schoolmaster.test')

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalledTimes(1)
    expect(updateProfileMock).toHaveBeenCalledWith({
      id: 1,
      name: 'Jane Doe',
      email: 'jane@schoolmaster.test',
    })
    expect(messageSuccess).toHaveBeenCalledWith('Profile updated successfully!')
  })

  it('prefills fields with logged-in user data', async () => {
    const { stubs } = createFormStubs()
    authStoreState.user = {
      id: 1,
      name: 'Logged User',
      email: 'logged@schoolmaster.test',
    }

    const wrapper = mount(EditProfilePage, {
      global: {
        stubs,
      },
    })

    await flushPromises()

    const [nameInput, emailInput] = wrapper.findAll('input')
    expect(nameInput.element.value).toBe('Logged User')
    expect(emailInput.element.value).toBe('logged@schoolmaster.test')
    expect(fetchProfileMock).not.toHaveBeenCalled()
  })

  it('prefills fields from fetchMe when token exists and user is not loaded', async () => {
    const { stubs } = createFormStubs()
    authStoreState.token = 'token-123'
    fetchMeMock.mockResolvedValue({
      id: 2,
      name: 'Token User',
      email: 'token@schoolmaster.test',
    })

    const wrapper = mount(EditProfilePage, {
      global: {
        stubs,
      },
    })

    await flushPromises()

    const [nameInput, emailInput] = wrapper.findAll('input')
    expect(nameInput.element.value).toBe('Token User')
    expect(emailInput.element.value).toBe('token@schoolmaster.test')
    expect(fetchProfileMock).not.toHaveBeenCalled()
  })

  it('falls back to userStore profile when fetchMe fails', async () => {
    const { stubs } = createFormStubs()
    authStoreState.token = 'token-123'
    userStoreState.profile = {
      id: 3,
      name: 'Stored User',
      email: 'stored@schoolmaster.test',
    }
    fetchMeMock.mockRejectedValue(new Error('Unable to fetch me'))

    const wrapper = mount(EditProfilePage, {
      global: {
        stubs,
      },
    })

    await flushPromises()

    const [nameInput, emailInput] = wrapper.findAll('input')
    expect(nameInput.element.value).toBe('Stored User')
    expect(emailInput.element.value).toBe('stored@schoolmaster.test')
  })

  it('does not submit when validation fails', async () => {
    const { stubs, validateMock } = createFormStubs()
    validateMock.mockRejectedValueOnce(new Error('invalid'))

    const wrapper = mount(EditProfilePage, {
      global: {
        stubs,
      },
    })

    await flushPromises()
    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(validateMock).toHaveBeenCalledTimes(1)
    expect(updateProfileMock).not.toHaveBeenCalled()
    expect(messageSuccess).not.toHaveBeenCalled()
  })

  it('shows an error toast when save fails', async () => {
    const { stubs } = createFormStubs()
    authStoreState.user = {
      id: 1,
      name: 'Current User',
      email: 'current@schoolmaster.test',
    }
    updateProfileMock.mockRejectedValue(new Error('Update failed.'))

    const wrapper = mount(EditProfilePage, {
      global: {
        stubs,
      },
    })

    await flushPromises()

    const [nameInput, emailInput] = wrapper.findAll('input')
    await nameInput.setValue('Jane Doe')
    await emailInput.setValue('jane@schoolmaster.test')

    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(updateProfileMock).toHaveBeenCalledWith({
      id: 1,
      name: 'Jane Doe',
      email: 'jane@schoolmaster.test',
    })
    expect(messageError).toHaveBeenCalledWith('Update failed.')
  })

  it('shows an error toast when user id is missing', async () => {
    const { stubs } = createFormStubs()

    const wrapper = mount(EditProfilePage, {
      global: {
        stubs,
      },
    })

    await flushPromises()
    await wrapper.find('button').trigger('click')
    await flushPromises()

    expect(updateProfileMock).not.toHaveBeenCalled()
    expect(messageError).toHaveBeenCalledWith('Unable to determine user ID.')
  })
})
