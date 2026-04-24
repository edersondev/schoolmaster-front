import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const getProfileMock = vi.hoisted(() => vi.fn())
const updateProfileMock = vi.hoisted(() => vi.fn())
const getAllUsersMock = vi.hoisted(() => vi.fn())
const getUserByIdMock = vi.hoisted(() => vi.fn())
const createUserMock = vi.hoisted(() => vi.fn())
const updateUserMock = vi.hoisted(() => vi.fn())
const deleteUserMock = vi.hoisted(() => vi.fn())

vi.mock('@/services/userService', () => ({
  default: {
    getProfile: getProfileMock,
    updateProfile: updateProfileMock,
    getAllUsers: getAllUsersMock,
    getUserById: getUserByIdMock,
    createUser: createUserMock,
    updateUser: updateUserMock,
    deleteUser: deleteUserMock,
  },
}))

describe('userStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    getProfileMock.mockReset()
    updateProfileMock.mockReset()
    getAllUsersMock.mockReset()
    getUserByIdMock.mockReset()
    createUserMock.mockReset()
    updateUserMock.mockReset()
    deleteUserMock.mockReset()
  })

  it('fetches the profile', async () => {
    const { useUserStore } = await import('@/stores/userStore')
    const store = useUserStore()
    getProfileMock.mockResolvedValue({ id: 1 })

    const profile = await store.fetchProfile()

    expect(profile).toEqual({ id: 1 })
    expect(store.profile).toEqual({ id: 1 })
  })

  it('updates the profile', async () => {
    const { useUserStore } = await import('@/stores/userStore')
    const store = useUserStore()
    updateProfileMock.mockResolvedValue({ id: 1, name: 'Updated' })

    const profile = await store.updateProfile({ name: 'Updated' })

    expect(profile).toEqual({ id: 1, name: 'Updated' })
    expect(store.profile).toEqual({ id: 1, name: 'Updated' })
  })

  it('fetches users list', async () => {
    const { useUserStore } = await import('@/stores/userStore')
    const store = useUserStore()
    getAllUsersMock.mockResolvedValue([{ id: 1 }, { id: 2 }])

    const users = await store.fetchUsers()

    expect(getAllUsersMock).toHaveBeenCalledWith({ include: 'role' })
    expect(users).toEqual([{ id: 1 }, { id: 2 }])
    expect(store.users).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('fetches users list forwarding custom params', async () => {
    const { useUserStore } = await import('@/stores/userStore')
    const store = useUserStore()
    getAllUsersMock.mockResolvedValue([{ id: 1 }, { id: 2 }])

    const users = await store.fetchUsers({ include: 'role,permissions' })

    expect(getAllUsersMock).toHaveBeenCalledWith({ include: 'role,permissions' })
    expect(users).toEqual([{ id: 1 }, { id: 2 }])
    expect(store.users).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('fetches one user by id', async () => {
    const { useUserStore } = await import('@/stores/userStore')
    const store = useUserStore()
    getUserByIdMock.mockResolvedValue({ id: 8, name: 'User' })

    const user = await store.fetchUserById(8)

    expect(getUserByIdMock).toHaveBeenCalledWith(8)
    expect(user).toEqual({ id: 8, name: 'User' })
    expect(store.selectedUser).toEqual({ id: 8, name: 'User' })
  })

  it('creates a user and prepends it when API returns payload', async () => {
    const { useUserStore } = await import('@/stores/userStore')
    const store = useUserStore()
    store.users = [{ id: 1, name: 'A' }]
    createUserMock.mockResolvedValue({ id: 2, name: 'B' })

    await store.createUser({ name: 'B' })

    expect(store.users.map((user) => user.id)).toEqual([2, 1])
  })

  it('updates users list and selected user when update returns payload', async () => {
    const { useUserStore } = await import('@/stores/userStore')
    const store = useUserStore()
    store.users = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }]
    updateUserMock.mockResolvedValue({ id: 2, name: 'B Updated' })

    await store.updateUser(2, { name: 'B Updated' })

    expect(store.users).toEqual([{ id: 1, name: 'A' }, { id: 2, name: 'B Updated' }])
    expect(store.selectedUser).toEqual({ id: 2, name: 'B Updated' })
  })

  it('re-fetches users and selected user when update returns empty payload', async () => {
    const { useUserStore } = await import('@/stores/userStore')
    const store = useUserStore()
    updateUserMock.mockResolvedValue(null)
    getAllUsersMock.mockResolvedValue([{ id: 3, name: 'C' }])
    getUserByIdMock.mockResolvedValue({ id: 3, name: 'C' })

    await store.updateUser(3, { name: 'C' })

    expect(getAllUsersMock).toHaveBeenCalledTimes(1)
    expect(getUserByIdMock).toHaveBeenCalledWith(3)
    expect(store.users).toEqual([{ id: 3, name: 'C' }])
  })

  it('deletes user and refreshes list when delete returns empty payload', async () => {
    const { useUserStore } = await import('@/stores/userStore')
    const store = useUserStore()
    store.users = [{ id: 1 }, { id: 2 }]
    deleteUserMock.mockResolvedValue(null)
    getAllUsersMock.mockResolvedValue([{ id: 2 }])

    await store.deleteUser(1)

    expect(deleteUserMock).toHaveBeenCalledWith(1)
    expect(getAllUsersMock).toHaveBeenCalledTimes(1)
    expect(store.users).toEqual([{ id: 2 }])
  })

  it('handles profile fetch errors', async () => {
    const { useUserStore } = await import('@/stores/userStore')
    const store = useUserStore()
    getProfileMock.mockRejectedValue(new Error('Nope'))

    await expect(store.fetchProfile()).rejects.toThrow('Nope')

    expect(store.error).toBe('Nope')
    expect(store.loading).toBe(false)
  })

  it('handles profile update errors', async () => {
    const { useUserStore } = await import('@/stores/userStore')
    const store = useUserStore()
    updateProfileMock.mockRejectedValue(new Error('Nope'))

    await expect(store.updateProfile({ name: 'Bad' })).rejects.toThrow('Nope')

    expect(store.error).toBe('Nope')
    expect(store.loading).toBe(false)
  })

  it('uses default message when profile fetch error has no message', async () => {
    const { useUserStore } = await import('@/stores/userStore')
    const store = useUserStore()
    getProfileMock.mockRejectedValue({})

    await expect(store.fetchProfile()).rejects.toEqual({})

    expect(store.error).toBe('Unable to load profile.')
    expect(store.loading).toBe(false)
  })

  it('uses default message when profile update error has no message', async () => {
    const { useUserStore } = await import('@/stores/userStore')
    const store = useUserStore()
    updateProfileMock.mockRejectedValue({})

    await expect(store.updateProfile({ name: 'Bad' })).rejects.toEqual({})

    expect(store.error).toBe('Unable to update profile.')
    expect(store.loading).toBe(false)
  })
})
