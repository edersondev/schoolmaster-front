import api from './api'

const login = async (credentials) => {
  const { data } = await api.post('/login', credentials)
  return data
}

const register = async (payload) => {
  const { data } = await api.post('/register', payload)
  return data
}

const checkCpfAvailability = async (cpf) => {
  const { data } = await api.get('/register/cpf-availability', {
    params: { cpf },
  })
  return data
}

const logout = async () => {
  const { data } = await api.post('/logout')
  return data
}

const me = async () => {
  const { data } = await api.get('/me')
  return data
}

export default {
  login,
  register,
  checkCpfAvailability,
  logout,
  me,
}
