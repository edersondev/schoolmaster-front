import { describe, it, expect, vi, beforeEach } from 'vitest'

const apiGet = vi.hoisted(() => vi.fn())
const apiPut = vi.hoisted(() => vi.fn())
const apiPatch = vi.hoisted(() => vi.fn())
const apiPost = vi.hoisted(() => vi.fn())
const apiDelete = vi.hoisted(() => vi.fn())

vi.mock('@/services/api', () => ({
  default: {
    get: apiGet,
    put: apiPut,
    patch: apiPatch,
    post: apiPost,
    delete: apiDelete,
  },
}))

describe('userService', () => {
  beforeEach(() => {
    apiGet.mockReset()
    apiPut.mockReset()
    apiPatch.mockReset()
    apiPost.mockReset()
    apiDelete.mockReset()
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

  it('fetches all users', async () => {
    const userService = (await import('@/services/userService')).default
    apiGet.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] })

    const users = await userService.getAllUsers()

    expect(apiGet).toHaveBeenCalledWith('/users', { params: {} })
    expect(users).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('fetches all users with custom params', async () => {
    const userService = (await import('@/services/userService')).default
    apiGet.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] })

    const users = await userService.getAllUsers({ include: 'role' })

    expect(apiGet).toHaveBeenCalledWith('/users', { params: { include: 'role' } })
    expect(users).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('fetches one user by id', async () => {
    const userService = (await import('@/services/userService')).default
    apiGet.mockResolvedValue({ data: { id: 7, name: 'Alice' } })

    const user = await userService.getUserById(7)

    expect(apiGet).toHaveBeenCalledWith('/users/7')
    expect(user).toEqual({ id: 7, name: 'Alice' })
  })

  it('creates a user', async () => {
    const userService = (await import('@/services/userService')).default
    apiPost.mockResolvedValue({ data: { id: 11, name: 'New User' } })

    const result = await userService.createUser({ name: 'New User' })

    expect(apiPost).toHaveBeenCalledWith('/users', { name: 'New User' })
    expect(result).toEqual({ id: 11, name: 'New User' })
  })

  it('updates a user and normalizes empty 204 response', async () => {
    const userService = (await import('@/services/userService')).default
    apiPatch.mockResolvedValue({ data: '' })

    const result = await userService.updateUser(11, { name: 'Edited' })

    expect(apiPatch).toHaveBeenCalledWith('/users/11', { name: 'Edited' })
    expect(result).toBeNull()
  })

  it('deletes a user and normalizes empty 204 response', async () => {
    const userService = (await import('@/services/userService')).default
    apiDelete.mockResolvedValue({ data: '' })

    const result = await userService.deleteUser(11)

    expect(apiDelete).toHaveBeenCalledWith('/users/11')
    expect(result).toBeNull()
  })
})
