import api from './api'

const normalizeWriteResponse = (data) => {
  if (data === '' || data == null) {
    return null
  }

  return data
}

const getProfile = async () => {
  const { data } = await api.get('/user')
  return data
}

const updateProfile = async (payload) => {
  const userId = payload?.id
  if (!userId) {
    throw new Error('User ID is required to update profile.')
  }

  const { id, ...profilePayload } = payload || {}

  const { data } = await api.put(`/users/${userId}`, profilePayload)
  return normalizeWriteResponse(data)
}

const getAllUsers = async () => {
  const { data } = await api.get('/users')
  return data
}

const getUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`)
  return data
}

const createUser = async (payload) => {
  const { data } = await api.post('/users', payload)
  return normalizeWriteResponse(data)
}

const updateUser = async (id, payload) => {
  const { data } = await api.put(`/users/${id}`, payload)
  return normalizeWriteResponse(data)
}

const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`)
  return normalizeWriteResponse(data)
}

export default {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}
