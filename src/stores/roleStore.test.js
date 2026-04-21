import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const getAllRolesMock = vi.hoisted(() => vi.fn())

vi.mock('@/services/roleService', () => ({
  default: {
    getAllRoles: getAllRolesMock,
  },
}))

describe('roleStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    getAllRolesMock.mockReset()
  })

  it('fetches roles and caches result', async () => {
    const { useRoleStore } = await import('@/stores/roleStore')
    const store = useRoleStore()
    getAllRolesMock.mockResolvedValue([{ id: 1, name: 'admin' }])

    const firstFetch = await store.fetchRoles()
    const secondFetch = await store.fetchRoles()

    expect(firstFetch).toEqual([{ id: 1, name: 'admin' }])
    expect(secondFetch).toEqual([{ id: 1, name: 'admin' }])
    expect(getAllRolesMock).toHaveBeenCalledTimes(1)
    expect(store.loaded).toBe(true)
  })

  it('handles empty roles payload', async () => {
    const { useRoleStore } = await import('@/stores/roleStore')
    const store = useRoleStore()
    getAllRolesMock.mockResolvedValue([])

    const roles = await store.fetchRoles()

    expect(roles).toEqual([])
    expect(store.roles).toEqual([])
  })

  it('sets a default message when loading roles fails', async () => {
    const { useRoleStore } = await import('@/stores/roleStore')
    const store = useRoleStore()
    getAllRolesMock.mockRejectedValue({})

    await expect(store.fetchRoles()).rejects.toEqual({})
    expect(store.error).toBe('Unable to load roles.')
    expect(store.loading).toBe(false)
  })
})
