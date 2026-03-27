import api from './api'

const getAll = async () => {
  const { data } = await api.get('/students')
  return data
}

const getById = async (id) => {
  const { data } = await api.get(`/students/${id}`)
  return data
}

const create = async (payload) => {
  const { data } = await api.post('/students', payload)
  return data
}

const update = async (id, payload) => {
  const { data } = await api.put(`/students/${id}`, payload)
  return data
}

const remove = async (id) => {
  const { data } = await api.delete(`/students/${id}`)
  return data
}

export default {
  getAll,
  getById,
  create,
  update,
  delete: remove,
}
