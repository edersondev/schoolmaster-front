import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const loginMock = vi.hoisted(() => vi.fn())
const logoutMock = vi.hoisted(() => vi.fn())
const meMock = vi.hoisted(() => vi.fn())

vi.mock('@/services/authService', () => ({
  default: {
    login: loginMock,
    logout: logoutMock,
    me: meMock,
  },
}))

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    loginMock.mockReset()
    logoutMock.mockReset()
    meMock.mockReset()
  })

  it('logs in and stores the session', async () => {
    const { useAuthStore } = await import('@/stores/authStore')
    const store = useAuthStore()
    loginMock.mockResolvedValue({
      token: 'token-1',
      user: { id: 1, email: 'admin@schoolmaster.test' },
    })

    const session = await store.login({ email: 'a', password: 'b' })

    expect(session.token).toBe('token-1')
    expect(store.token).toBe('token-1')
    expect(store.user?.email).toBe('admin@schoolmaster.test')
    expect(localStorage.getItem('token')).toBe('token-1')
  })

  it('fetches the current user when token exists', async () => {
    localStorage.setItem('token', 'token-2')
    const { useAuthStore } = await import('@/stores/authStore')
    const store = useAuthStore()
    meMock.mockResolvedValue({ id: 2, email: 'user@schoolmaster.test' })

    const profile = await store.fetchMe()

    expect(profile.email).toBe('user@schoolmaster.test')
    expect(store.user?.email).toBe('user@schoolmaster.test')
  })

  it('returns null when fetching without a token', async () => {
    const { useAuthStore } = await import('@/stores/authStore')
    const store = useAuthStore()

    const result = await store.fetchMe()

    expect(result).toBeNull()
    expect(store.user).toBeNull()
    expect(meMock).not.toHaveBeenCalled()
  })

  it('exposes an error when login fails', async () => {
    const { useAuthStore } = await import('@/stores/authStore')
    const store = useAuthStore()
    loginMock.mockRejectedValue(new Error('Nope'))

    await expect(store.login({ email: 'a', password: 'b' })).rejects.toThrow('Nope')

    expect(store.error).toBe('Nope')
    expect(store.loading).toBe(false)
  })

  it('clears the session when fetchMe fails', async () => {
    localStorage.setItem('token', 'token-4')
    const { useAuthStore } = await import('@/stores/authStore')
    const store = useAuthStore()
    meMock.mockRejectedValue(new Error('Denied'))

    await expect(store.fetchMe()).rejects.toThrow('Denied')

    expect(store.error).toBe('Denied')
    expect(store.loading).toBe(false)
  })

  it('clears session when logging out', async () => {
    const { useAuthStore } = await import('@/stores/authStore')
    const store = useAuthStore()
    loginMock.mockResolvedValue({
      token: 'token-3',
      user: { id: 3 },
    })
    await store.login({ email: 'a', password: 'b' })

    await store.logout()

    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('still clears session if logout request fails', async () => {
    const { useAuthStore } = await import('@/stores/authStore')
    const store = useAuthStore()
    loginMock.mockResolvedValue({
      token: 'token-5',
      user: { id: 5 },
    })
    await store.login({ email: 'a', password: 'b' })
    logoutMock.mockRejectedValue(new Error('Server down'))

    await store.logout()

    expect(store.error).toBe('Server down')
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
  })
})
