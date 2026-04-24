import { describe, it, expect, vi, beforeEach } from 'vitest'

const apiGet = vi.hoisted(() => vi.fn())
const apiPatch = vi.hoisted(() => vi.fn())
const apiPost = vi.hoisted(() => vi.fn())
const apiDelete = vi.hoisted(() => vi.fn())

vi.mock('@/services/api', () => ({
  default: {
    get: apiGet,
    patch: apiPatch,
    post: apiPost,
    delete: apiDelete,
  },
}))

describe('schoolService', () => {
  beforeEach(() => {
    apiGet.mockReset()
    apiPatch.mockReset()
    apiPost.mockReset()
    apiDelete.mockReset()
  })

  it('fetches school lookups', async () => {
    const schoolService = (await import('@/services/schoolService')).default
    apiGet.mockResolvedValueOnce({ data: [{ id: 1, label: 'Public' }] })
    apiGet.mockResolvedValueOnce({ data: [{ id: 1, label: 'For Profit' }] })

    const administrativeTypes = await schoolService.getAdministrativeTypes()
    const legalNatures = await schoolService.getLegalNatures()

    expect(apiGet).toHaveBeenNthCalledWith(1, '/administrative_types')
    expect(apiGet).toHaveBeenNthCalledWith(2, '/legal_natures')
    expect(administrativeTypes).toEqual([{ id: 1, label: 'Public' }])
    expect(legalNatures).toEqual([{ id: 1, label: 'For Profit' }])
  })

  it('fetches all schools without query params', async () => {
    const schoolService = (await import('@/services/schoolService')).default
    apiGet.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] })

    const schools = await schoolService.getAllSchools()

    expect(apiGet).toHaveBeenCalledWith('/schools')
    expect(schools).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('fetches all schools with query params', async () => {
    const schoolService = (await import('@/services/schoolService')).default
    apiGet.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] })

    const schools = await schoolService.getAllSchools({ include: 'address' })

    expect(apiGet).toHaveBeenCalledWith('/schools', { params: { include: 'address' } })
    expect(schools).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('checks cnpj availability', async () => {
    const schoolService = (await import('@/services/schoolService')).default
    apiGet.mockResolvedValue({ data: { available: true } })

    const result = await schoolService.checkCnpjAvailability('12345678000100')

    expect(apiGet).toHaveBeenCalledWith('/schools/cnpj-availability', {
      params: { cnpj: '12345678000100' },
    })
    expect(result).toEqual({ available: true })
  })

  it('creates and updates school addresses', async () => {
    const schoolService = (await import('@/services/schoolService')).default
    apiPost.mockResolvedValue({ data: { id: 10, school_id: 2 } })
    apiPatch.mockResolvedValue({ data: { id: 10, city: 'Campinas' } })

    const created = await schoolService.createSchoolAddress({ school_id: 2, city: 'Sao Paulo' })
    const updated = await schoolService.updateSchoolAddress(10, { city: 'Campinas' })

    expect(apiPost).toHaveBeenCalledWith('/school_addresses', { school_id: 2, city: 'Sao Paulo' })
    expect(apiPatch).toHaveBeenCalledWith('/school_addresses/10', { city: 'Campinas' })
    expect(created).toEqual({ id: 10, school_id: 2 })
    expect(updated).toEqual({ id: 10, city: 'Campinas' })
  })

  it('normalizes empty responses from writes', async () => {
    const schoolService = (await import('@/services/schoolService')).default
    apiPatch.mockResolvedValue({ data: '' })
    apiDelete.mockResolvedValue({ data: '' })

    const updatedSchool = await schoolService.updateSchool(4, { name: 'Updated' })
    const deletedAddress = await schoolService.deleteSchoolAddress(9)

    expect(updatedSchool).toBeNull()
    expect(deletedAddress).toBeNull()
  })
})
