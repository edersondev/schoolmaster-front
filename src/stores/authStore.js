import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = shallowRef(localStorage.getItem('token'))
  const loading = shallowRef(false)
  const error = shallowRef(null)

  const setSession = (session) => {
    token.value = session?.token || null
    user.value = session?.user || null

    if (token.value) {
      localStorage.setItem('token', token.value)
    } else {
      localStorage.removeItem('token')
    }
  }

  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const session = await authService.login(credentials)
      setSession(session)
      return session
    } catch (err) {
      error.value = err?.message || 'Unable to sign in.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchMe = async () => {
    if (!token.value) {
      user.value = null
      return null
    }

    loading.value = true
    error.value = null

    try {
      const profile = await authService.me()
      user.value = profile?.user || profile
      return user.value
    } catch (err) {
      error.value = err?.message || 'Unable to fetch user.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      await authService.logout()
    } catch (err) {
      error.value = err?.message || 'Unable to sign out.'
    } finally {
      setSession(null)
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    fetchMe,
  }
})
