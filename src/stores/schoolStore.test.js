import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const getAllSchoolsMock = vi.hoisted(() => vi.fn())
const getSchoolByIdMock = vi.hoisted(() => vi.fn())
const createSchoolMock = vi.hoisted(() => vi.fn())
const updateSchoolMock = vi.hoisted(() => vi.fn())
const deleteSchoolMock = vi.hoisted(() => vi.fn())
const checkCnpjAvailabilityMock = vi.hoisted(() => vi.fn())
const getAdministrativeTypesMock = vi.hoisted(() => vi.fn())
const getLegalNaturesMock = vi.hoisted(() => vi.fn())
const getManagementTypesMock = vi.hoisted(() => vi.fn())
const getEducationLevelsMock = vi.hoisted(() => vi.fn())
const getModalitiesMock = vi.hoisted(() => vi.fn())
const getPedagogicalApproachesMock = vi.hoisted(() => vi.fn())
const getAllSchoolAddressesMock = vi.hoisted(() => vi.fn())
const createSchoolAddressMock = vi.hoisted(() => vi.fn())
const updateSchoolAddressMock = vi.hoisted(() => vi.fn())
const deleteSchoolAddressMock = vi.hoisted(() => vi.fn())

vi.mock('@/services/schoolService', () => ({
  default: {
    getAllSchools: getAllSchoolsMock,
    getSchoolById: getSchoolByIdMock,
    createSchool: createSchoolMock,
    updateSchool: updateSchoolMock,
    deleteSchool: deleteSchoolMock,
    checkCnpjAvailability: checkCnpjAvailabilityMock,
    getAdministrativeTypes: getAdministrativeTypesMock,
    getLegalNatures: getLegalNaturesMock,
    getManagementTypes: getManagementTypesMock,
    getEducationLevels: getEducationLevelsMock,
    getModalities: getModalitiesMock,
    getPedagogicalApproaches: getPedagogicalApproachesMock,
    getAllSchoolAddresses: getAllSchoolAddressesMock,
    createSchoolAddress: createSchoolAddressMock,
    updateSchoolAddress: updateSchoolAddressMock,
    deleteSchoolAddress: deleteSchoolAddressMock,
  },
}))

describe('schoolStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    getAllSchoolsMock.mockReset()
    getSchoolByIdMock.mockReset()
    createSchoolMock.mockReset()
    updateSchoolMock.mockReset()
    deleteSchoolMock.mockReset()
    checkCnpjAvailabilityMock.mockReset()
    getAdministrativeTypesMock.mockReset()
    getLegalNaturesMock.mockReset()
    getManagementTypesMock.mockReset()
    getEducationLevelsMock.mockReset()
    getModalitiesMock.mockReset()
    getPedagogicalApproachesMock.mockReset()
    getAllSchoolAddressesMock.mockReset()
    createSchoolAddressMock.mockReset()
    updateSchoolAddressMock.mockReset()
    deleteSchoolAddressMock.mockReset()
  })

  it('loads lookup reference data', async () => {
    const { useSchoolStore } = await import('@/stores/schoolStore')
    const store = useSchoolStore()

    getAdministrativeTypesMock.mockResolvedValue([{ id: 1, label: 'Public' }])
    getLegalNaturesMock.mockResolvedValue([{ id: 2, label: 'Non Profit' }])
    getManagementTypesMock.mockResolvedValue([{ id: 3, label: 'Community' }])
    getEducationLevelsMock.mockResolvedValue([{ id: 1, name: 'Early Childhood Education' }])
    getModalitiesMock.mockResolvedValue([{ id: 1, name: 'On-site' }])
    getPedagogicalApproachesMock.mockResolvedValue([{ id: 2, name: 'Constructivist' }])

    await store.fetchReferenceData()

    expect(store.referenceData.administrativeTypes).toEqual([{ id: 1, label: 'Public' }])
    expect(store.referenceData.legalNatures).toEqual([{ id: 2, label: 'Non Profit' }])
    expect(store.referenceData.managementTypes).toEqual([{ id: 3, label: 'Community' }])
    expect(store.referenceData.educationLevels).toEqual([{ id: 1, name: 'Early Childhood Education' }])
    expect(store.referenceData.modalities).toEqual([{ id: 1, name: 'On-site' }])
    expect(store.referenceData.pedagogicalApproaches).toEqual([{ id: 2, name: 'Constructivist' }])
  })

  it('creates school and linked address when school write returns payload', async () => {
    const { useSchoolStore } = await import('@/stores/schoolStore')
    const store = useSchoolStore()

    createSchoolMock.mockResolvedValue({ id: 9, name: 'New School' })
    getAllSchoolAddressesMock.mockResolvedValue([])
    createSchoolAddressMock.mockResolvedValue({ id: 77, school_id: 9, city: 'Campinas' })

    await store.createSchool({
      inep_code: '123',
      name: 'New School',
      document: '12.345.678/0001-01',
      status: 1,
      education_level_ids: [1],
      modality_ids: [1],
      address: {
        city: 'Campinas',
        state: 'SP',
        country: 'Brazil',
      },
    })

    expect(createSchoolMock).toHaveBeenCalledTimes(1)
    expect(createSchoolAddressMock).toHaveBeenCalledWith(expect.objectContaining({
      school_id: 9,
      city: 'Campinas',
      state: 'SP',
      country: 'Brazil',
    }))
    expect(store.schools[0]).toEqual({ id: 9, name: 'New School' })
  })

  it('re-fetches schools and resolves created school when create returns null', async () => {
    const { useSchoolStore } = await import('@/stores/schoolStore')
    const store = useSchoolStore()

    createSchoolMock.mockResolvedValue(null)
    getAllSchoolsMock.mockResolvedValue([
      { id: 3, inep_code: '35000003', document: '12345678000190', name: 'Resolved School' },
    ])
    getAllSchoolAddressesMock.mockResolvedValue([])
    createSchoolAddressMock.mockResolvedValue({ id: 33, school_id: 3 })

    const result = await store.createSchool({
      inep_code: '35000003',
      document: '12.345.678/0001-90',
      address: {
        city: 'Sao Paulo',
        state: 'SP',
        country: 'Brazil',
      },
    })

    expect(getAllSchoolsMock).toHaveBeenCalledTimes(1)
    expect(createSchoolAddressMock).toHaveBeenCalledWith(expect.objectContaining({ school_id: 3 }))
    expect(result).toEqual({ id: 3, inep_code: '35000003', document: '12345678000190', name: 'Resolved School' })
  })

  it('updates school and existing linked address', async () => {
    const { useSchoolStore } = await import('@/stores/schoolStore')
    const store = useSchoolStore()

    store.schools = [{ id: 1, name: 'Old Name' }]
    store.schoolAddresses = [{ id: 8, school_id: 1, city: 'Old City' }]

    updateSchoolMock.mockResolvedValue({ id: 1, name: 'Updated Name' })
    updateSchoolAddressMock.mockResolvedValue({ id: 8, school_id: 1, city: 'Campinas' })

    await store.updateSchool(1, {
      name: 'Updated Name',
      document: '12.345.678/0001-10',
      status: 1,
      education_level_ids: [1],
      modality_ids: [1],
      address: {
        city: 'Campinas',
        state: 'SP',
        country: 'Brazil',
      },
    })

    expect(updateSchoolMock).toHaveBeenCalledWith(1, expect.objectContaining({
      name: 'Updated Name',
      document: '12345678000110',
    }))
    expect(updateSchoolAddressMock).toHaveBeenCalledWith(8, expect.objectContaining({
      school_id: 1,
      city: 'Campinas',
    }))
    expect(store.selectedSchool).toEqual({ id: 1, name: 'Updated Name' })
  })

  it('does not send document on update when payload omits it', async () => {
    const { useSchoolStore } = await import('@/stores/schoolStore')
    const store = useSchoolStore()

    store.schoolAddresses = [{ id: 8, school_id: 1, city: 'Old City' }]
    updateSchoolMock.mockResolvedValue({ id: 1, name: 'Updated Name' })
    updateSchoolAddressMock.mockResolvedValue({ id: 8, school_id: 1, city: 'Campinas' })

    await store.updateSchool(1, {
      name: 'Updated Name',
      status: 1,
      education_level_ids: [1],
      modality_ids: [1],
      address: {
        city: 'Campinas',
        state: 'SP',
        country: 'Brazil',
      },
    })

    const sentPayload = updateSchoolMock.mock.calls[0][1]
    expect(sentPayload).toEqual(expect.objectContaining({
      name: 'Updated Name',
      status: 1,
    }))
    expect(sentPayload).not.toHaveProperty('document')
  })
})
