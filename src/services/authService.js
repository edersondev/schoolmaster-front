import api from './api'

const login = async (credentials) => {
  const { data } = await api.post('/login', credentials)
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
  logout,
  me,
}
