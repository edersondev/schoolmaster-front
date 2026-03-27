import { describe, it, expect, vi, beforeEach } from 'vitest'

const apiGet = vi.hoisted(() => vi.fn())
const apiPut = vi.hoisted(() => vi.fn())

vi.mock('@/services/api', () => ({
  default: {
    get: apiGet,
    put: apiPut,
  },
}))

describe('userService', () => {
  beforeEach(() => {
    apiGet.mockReset()
    apiPut.mockReset()
  })

  it('fetches the profile', async () => {
    const userService = (await import('@/services/userService')).default
    apiGet.mockResolvedValue({ data: { id: 1 } })

    const result = await userService.getProfile()

    expect(apiGet).toHaveBeenCalledWith('/user')
    expect(result).toEqual({ id: 1 })
  })

  it('updates the profile', async () => {
    const userService = (await import('@/services/userService')).default
    apiPut.mockResolvedValue({ data: { id: 1, name: 'Updated' } })

    const result = await userService.updateProfile({ name: 'Updated' })

    expect(apiPut).toHaveBeenCalledWith('/user', { name: 'Updated' })
    expect(result).toEqual({ id: 1, name: 'Updated' })
  })
})
