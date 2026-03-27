import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
