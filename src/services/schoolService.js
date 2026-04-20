import api from './api'

const normalizeWriteResponse = (data) => {
  if (data === '' || data == null) {
    return null
  }

  return data
}

const getAllSchools = async () => {
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

export default {
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  checkCnpjAvailability,
}
