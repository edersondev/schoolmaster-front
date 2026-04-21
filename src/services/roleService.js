import api from './api'

const getAllRoles = async () => {
  const { data } = await api.get('/roles')
  return data
}

export default {
  getAllRoles,
}
