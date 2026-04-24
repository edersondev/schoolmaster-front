import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'

import schoolService from '@/services/schoolService'

const emptyReferenceData = () => ({
  administrativeTypes: [],
  legalNatures: [],
  managementTypes: [],
  educationLevels: [],
  modalities: [],
  pedagogicalApproaches: [],
})

const onlyDigits = (value) => String(value || '').replace(/\D/g, '')

const normalizeSchoolPayload = (payload = {}) => {
  const normalizedPayload = {
    inep_code: String(payload.inep_code || '').trim(),
    name: String(payload.name || '').trim(),
    trade_name: String(payload.trade_name || '').trim(),
    legal_name: String(payload.legal_name || '').trim(),
    email: String(payload.email || '').trim(),
    phone: onlyDigits(payload.phone),
    website: String(payload.website || '').trim(),
    description: String(payload.description || '').trim(),
    administrative_type_id: Number(payload.administrative_type_id || 0) || null,
    legal_nature_id: Number(payload.legal_nature_id || 0) || null,
    management_type_id: Number(payload.management_type_id || 0) || null,
    pedagogical_approach_id: Number(payload.pedagogical_approach_id || 0) || null,
    status: Number(payload.status || 0),
    logo_path: payload.logo_path ? String(payload.logo_path).trim() : null,
    primary_color: String(payload.primary_color || '').trim(),
    secondary_color: String(payload.secondary_color || '').trim(),
    timezone: String(payload.timezone || '').trim(),
    language: String(payload.language || '').trim(),
    education_level_ids: Array.isArray(payload.education_level_ids)
      ? payload.education_level_ids.map((value) => Number(value)).filter(Boolean)
      : [],
    modality_ids: Array.isArray(payload.modality_ids)
      ? payload.modality_ids.map((value) => Number(value)).filter(Boolean)
      : [],
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'document')) {
    normalizedPayload.document = onlyDigits(payload.document)
  }

  return normalizedPayload
}

const normalizeAddressPayload = (payload = {}) => ({
  street: String(payload.street || '').trim(),
  number: String(payload.number || '').trim(),
  complement: payload.complement ? String(payload.complement).trim() : null,
  neighborhood: String(payload.neighborhood || '').trim(),
  city: String(payload.city || '').trim(),
  state: String(payload.state || '').trim(),
  zip_code: String(payload.zip_code || '').trim(),
  country: String(payload.country || '').trim(),
})

export const useSchoolStore = defineStore('school', () => {
  const schools = ref([])
  const schoolAddresses = ref([])
  const selectedSchool = ref(null)
  const loading = shallowRef(false)
  const error = shallowRef(null)
  const referenceData = ref(emptyReferenceData())

  const schoolAddressesBySchoolId = computed(() => {
    const pairs = schoolAddresses.value.map((address) => [String(address.school_id), address])
    return Object.fromEntries(pairs)
  })

  const fetchSchools = async (params) => {
    loading.value = true
    error.value = null

    try {
      const data = await schoolService.getAllSchools(params)
      schools.value = Array.isArray(data) ? data : data?.data || []
      return schools.value
    } catch (err) {
      error.value = err?.message || 'Unable to load schools.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchSchoolAddresses = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await schoolService.getAllSchoolAddresses()
      schoolAddresses.value = Array.isArray(data) ? data : data?.data || []
      return schoolAddresses.value
    } catch (err) {
      error.value = err?.message || 'Unable to load school addresses.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchReferenceData = async () => {
    loading.value = true
    error.value = null

    try {
      const [
        administrativeTypes,
        legalNatures,
        managementTypes,
        educationLevels,
        modalities,
        pedagogicalApproaches,
      ] = await Promise.all([
        schoolService.getAdministrativeTypes(),
        schoolService.getLegalNatures(),
        schoolService.getManagementTypes(),
        schoolService.getEducationLevels(),
        schoolService.getModalities(),
        schoolService.getPedagogicalApproaches(),
      ])

      referenceData.value = {
        administrativeTypes: Array.isArray(administrativeTypes) ? administrativeTypes : [],
        legalNatures: Array.isArray(legalNatures) ? legalNatures : [],
        managementTypes: Array.isArray(managementTypes) ? managementTypes : [],
        educationLevels: Array.isArray(educationLevels) ? educationLevels : [],
        modalities: Array.isArray(modalities) ? modalities : [],
        pedagogicalApproaches: Array.isArray(pedagogicalApproaches) ? pedagogicalApproaches : [],
      }

      return referenceData.value
    } catch (err) {
      error.value = err?.message || 'Unable to load school reference data.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchSchoolById = async (id) => {
    loading.value = true
    error.value = null

    try {
      const data = await schoolService.getSchoolById(id)
      selectedSchool.value = data
      return data
    } catch (err) {
      error.value = err?.message || 'Unable to load school.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getAddressBySchoolId = (schoolId) => {
    return schoolAddressesBySchoolId.value[String(schoolId)] || null
  }

  const syncAddressForSchool = async (schoolId, payloadAddress = {}) => {
    const addressPayload = {
      school_id: Number(schoolId),
      ...normalizeAddressPayload(payloadAddress),
    }

    if (!schoolAddresses.value.length) {
      await fetchSchoolAddresses()
    }

    const existingAddress = schoolAddresses.value.find(
      (address) => String(address.school_id) === String(schoolId)
    )

    if (existingAddress) {
      const updatedAddress = await schoolService.updateSchoolAddress(existingAddress.id, addressPayload)

      if (updatedAddress) {
        schoolAddresses.value = schoolAddresses.value.map((address) => (
          String(address.id) === String(existingAddress.id) ? updatedAddress : address
        ))
      } else {
        await fetchSchoolAddresses()
      }

      return
    }

    const createdAddress = await schoolService.createSchoolAddress(addressPayload)

    if (createdAddress) {
      schoolAddresses.value = [createdAddress, ...schoolAddresses.value]
    } else {
      await fetchSchoolAddresses()
    }
  }

  const resolveSchoolAfterCreateWithoutPayload = (schoolPayload = {}) => {
    return schools.value.find((school) => (
      String(school.inep_code || '').trim() === schoolPayload.inep_code
      || onlyDigits(school.document) === schoolPayload.document
    ))
  }

  const createSchool = async (payload) => {
    loading.value = true
    error.value = null

    try {
      const schoolPayload = normalizeSchoolPayload(payload)
      const data = await schoolService.createSchool(schoolPayload)

      let createdSchool = data

      if (createdSchool) {
        schools.value = [createdSchool, ...schools.value]
      } else {
        await fetchSchools()
        createdSchool = resolveSchoolAfterCreateWithoutPayload(schoolPayload)
      }

      if (!createdSchool?.id) {
        throw new Error('Unable to resolve created school to save address.')
      }

      await syncAddressForSchool(createdSchool.id, payload?.address)
      return createdSchool
    } catch (err) {
      error.value = err?.message || 'Unable to create school.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSchool = async (id, payload) => {
    loading.value = true
    error.value = null

    try {
      const schoolPayload = normalizeSchoolPayload(payload)
      const data = await schoolService.updateSchool(id, schoolPayload)

      if (data) {
        schools.value = schools.value.map((school) => (String(school.id) === String(id) ? data : school))
        selectedSchool.value = data
      } else {
        await fetchSchools()
        selectedSchool.value = await schoolService.getSchoolById(id)
      }

      await syncAddressForSchool(id, payload?.address)
      return data
    } catch (err) {
      error.value = err?.message || 'Unable to update school.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSchool = async (id) => {
    loading.value = true
    error.value = null

    try {
      const existingAddress = getAddressBySchoolId(id)
      if (existingAddress?.id) {
        await schoolService.deleteSchoolAddress(existingAddress.id)
        schoolAddresses.value = schoolAddresses.value.filter((address) => String(address.id) !== String(existingAddress.id))
      }

      const data = await schoolService.deleteSchool(id)
      schools.value = schools.value.filter((school) => String(school.id) !== String(id))

      if (!data) {
        await fetchSchools()
      }

      return data
    } catch (err) {
      error.value = err?.message || 'Unable to delete school.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    schools,
    schoolAddresses,
    schoolAddressesBySchoolId,
    selectedSchool,
    referenceData,
    loading,
    error,
    fetchSchools,
    fetchSchoolAddresses,
    fetchReferenceData,
    fetchSchoolById,
    getAddressBySchoolId,
    createSchool,
    updateSchool,
    deleteSchool,
  }
})
