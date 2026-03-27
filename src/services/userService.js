import api from './api'

const getProfile = async () => {
  const { data } = await api.get('/user')
  return data
}

const updateProfile = async (payload) => {
  const { data } = await api.put('/user', payload)
  return data
}

export default {
  getProfile,
  updateProfile,
}
