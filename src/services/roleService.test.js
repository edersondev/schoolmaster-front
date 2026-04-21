import { describe, it, expect, vi, beforeEach } from 'vitest'

const apiGet = vi.hoisted(() => vi.fn())

vi.mock('@/services/api', () => ({
  default: {
    get: apiGet,
  },
}))

describe('roleService', () => {
  beforeEach(() => {
    apiGet.mockReset()
  })

  it('fetches all roles', async () => {
    const roleService = (await import('@/services/roleService')).default
    apiGet.mockResolvedValue({ data: [{ id: 1, name: 'admin' }, { id: 2, name: 'teacher' }] })

    const roles = await roleService.getAllRoles()

    expect(apiGet).toHaveBeenCalledWith('/roles')
    expect(roles).toEqual([{ id: 1, name: 'admin' }, { id: 2, name: 'teacher' }])
  })
})
