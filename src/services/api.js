import axios from 'axios'

const API_PROTOCOL = import.meta.env.VITE_API_PROTOCOL?.trim() || 'http'
const API_HOST = import.meta.env.VITE_API_HOST?.trim() || 'localhost'
const API_PORT = import.meta.env.VITE_API_PORT?.trim() || '3000'

const api = axios.create({
  baseURL: `${API_PROTOCOL}://${API_HOST}:${API_PORT}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const normalizeError = (error) => {
  if (error?.response) {
    return {
      status: error.response.status,
      data: error.response.data,
      message: error.response.data?.message || error.message,
    }
  }

  return {
    status: null,
    data: null,
    message: error?.message || 'Unexpected error occurred.',
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error))
)

export default api
