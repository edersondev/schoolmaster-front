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

    const result = await userService.updateProfile({ id: 1, name: 'Updated' })

    expect(apiPut).toHaveBeenCalledWith('/users/1', { name: 'Updated' })
    expect(result).toEqual({ id: 1, name: 'Updated' })
  })

  it('requires user id to update the profile', async () => {
    const userService = (await import('@/services/userService')).default

    await expect(userService.updateProfile({ name: 'Updated' })).rejects.toThrow(
      'User ID is required to update profile.'
    )
    expect(apiPut).not.toHaveBeenCalled()
  })
})
