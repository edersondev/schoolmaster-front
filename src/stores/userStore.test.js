import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const getProfileMock = vi.hoisted(() => vi.fn())
const updateProfileMock = vi.hoisted(() => vi.fn())

vi.mock('@/services/userService', () => ({
  default: {
    getProfile: getProfileMock,
    updateProfile: updateProfileMock,
  },
}))

describe('userStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    getProfileMock.mockReset()
    updateProfileMock.mockReset()
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
})
