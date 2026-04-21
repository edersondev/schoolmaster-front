import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

import roleService from '@/services/roleService'

export const useRoleStore = defineStore('role', () => {
  const roles = ref([])
  const loading = shallowRef(false)
  const error = shallowRef(null)
  const loaded = shallowRef(false)

  const fetchRoles = async (force = false) => {
    if (loaded.value && !force) {
      return roles.value
    }

    loading.value = true
    error.value = null

    try {
      const data = await roleService.getAllRoles()
      roles.value = Array.isArray(data) ? data : data?.data || []
      loaded.value = true
      return roles.value
    } catch (err) {
      error.value = err?.message || 'Unable to load roles.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    roles,
    loading,
    error,
    loaded,
    fetchRoles,
  }
})
