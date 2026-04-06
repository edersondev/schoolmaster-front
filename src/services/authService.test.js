import { describe, it, expect, vi, beforeEach } from 'vitest'

const apiPost = vi.hoisted(() => vi.fn())
const apiGet = vi.hoisted(() => vi.fn())

vi.mock('@/services/api', () => ({
  default: {
    post: apiPost,
    get: apiGet,
  },
}))

describe('authService', () => {
  beforeEach(() => {
    apiPost.mockReset()
    apiGet.mockReset()
  })

  it('logs in with credentials', async () => {
    const authService = (await import('@/services/authService')).default
    apiPost.mockResolvedValue({ data: { token: 'token' } })

    const result = await authService.login({ email: 'a', password: 'b' })

    expect(apiPost).toHaveBeenCalledWith('/login', { email: 'a', password: 'b' })
    expect(result).toEqual({ token: 'token' })
  })

  it('registers a new user', async () => {
    const authService = (await import('@/services/authService')).default
    apiPost.mockResolvedValue({ data: { id: 6 } })

    const payload = {
      name: 'Jane Doe',
      email: 'jane@schoolmaster.test',
      password: 'password123',
      cpf: '12345678901',
      phone: '11999990000',
    }
    const result = await authService.register(payload)

    expect(apiPost).toHaveBeenCalledWith('/register', payload)
    expect(result).toEqual({ id: 6 })
  })

  it('checks cpf availability', async () => {
    const authService = (await import('@/services/authService')).default
    apiGet.mockResolvedValue({ data: { available: true } })

    const result = await authService.checkCpfAvailability('12345678901')

    expect(apiGet).toHaveBeenCalledWith('/register/cpf-availability', {
      params: { cpf: '12345678901' },
    })
    expect(result).toEqual({ available: true })
  })

  it('logs out', async () => {
    const authService = (await import('@/services/authService')).default
    apiPost.mockResolvedValue({ data: { message: 'ok' } })

    const result = await authService.logout()

    expect(apiPost).toHaveBeenCalledWith('/logout')
    expect(result).toEqual({ message: 'ok' })
  })

  it('fetches the current user', async () => {
    const authService = (await import('@/services/authService')).default
    apiGet.mockResolvedValue({ data: { id: 1 } })

    const result = await authService.me()

    expect(apiGet).toHaveBeenCalledWith('/me')
    expect(result).toEqual({ id: 1 })
  })
})
