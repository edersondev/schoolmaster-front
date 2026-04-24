import api from './api'

const normalizeWriteResponse = (data) => {
  if (data === '' || data == null) {
    return null
  }

  return data
}

const getAllSchools = async (params) => {
  if (params) {
    const { data } = await api.get('/schools', { params })
    return data
  }

  const { data } = await api.get('/schools')
  return data
}

const getSchoolById = async (id) => {
  const { data } = await api.get(`/schools/${id}`)
  return data
}

const createSchool = async (payload) => {
  const { data } = await api.post('/schools', payload)
  return normalizeWriteResponse(data)
}

const updateSchool = async (id, payload) => {
  const { data } = await api.patch(`/schools/${id}`, payload)
  return normalizeWriteResponse(data)
}

const deleteSchool = async (id) => {
  const { data } = await api.delete(`/schools/${id}`)
  return normalizeWriteResponse(data)
}

const checkCnpjAvailability = async (cnpj) => {
  const { data } = await api.get('/schools/cnpj-availability', {
    params: { cnpj },
  })
  return data
}

const getAdministrativeTypes = async () => {
  const { data } = await api.get('/administrative_types')
  return data
}

const getLegalNatures = async () => {
  const { data } = await api.get('/legal_natures')
  return data
}

const getManagementTypes = async () => {
  const { data } = await api.get('/management_types')
  return data
}

const getEducationLevels = async () => {
  const { data } = await api.get('/education_levels')
  return data
}

const getModalities = async () => {
  const { data } = await api.get('/modalities')
  return data
}

const getPedagogicalApproaches = async () => {
  const { data } = await api.get('/pedagogical_approaches')
  return data
}

const getAllSchoolAddresses = async () => {
  const { data } = await api.get('/school_addresses')
  return data
}

const createSchoolAddress = async (payload) => {
  const { data } = await api.post('/school_addresses', payload)
  return normalizeWriteResponse(data)
}

const updateSchoolAddress = async (id, payload) => {
  const { data } = await api.patch(`/school_addresses/${id}`, payload)
  return normalizeWriteResponse(data)
}

const deleteSchoolAddress = async (id) => {
  const { data } = await api.delete(`/school_addresses/${id}`)
  return normalizeWriteResponse(data)
}

export default {
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  checkCnpjAvailability,
  getAdministrativeTypes,
  getLegalNatures,
  getManagementTypes,
  getEducationLevels,
  getModalities,
  getPedagogicalApproaches,
  getAllSchoolAddresses,
  createSchoolAddress,
  updateSchoolAddress,
  deleteSchoolAddress,
}
