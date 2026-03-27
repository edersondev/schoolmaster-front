import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

import userService from '@/services/userService'

export const useUserStore = defineStore('user', () => {
  const profile = ref(null)
  const loading = shallowRef(false)
  const error = shallowRef(null)

  const fetchProfile = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await userService.getProfile()
      profile.value = data
      return data
    } catch (err) {
      error.value = err?.message || 'Unable to load profile.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (payload) => {
    loading.value = true
    error.value = null

    try {
      const data = await userService.updateProfile(payload)
      profile.value = data
      return data
    } catch (err) {
      error.value = err?.message || 'Unable to update profile.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  }
})
