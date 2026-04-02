import api from './api'

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
  return data
}

export default {
  getProfile,
  updateProfile,
}
