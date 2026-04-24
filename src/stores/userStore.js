import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

import userService from '@/services/userService'

export const useUserStore = defineStore('user', () => {
  const profile = ref(null)
  const users = ref([])
  const selectedUser = ref(null)
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
      if (data) {
        profile.value = data
      }
      return data
    } catch (err) {
      error.value = err?.message || 'Unable to update profile.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUsers = async (params = { include: 'role' }) => {
    loading.value = true
    error.value = null

    try {
      const data = await userService.getAllUsers(params)
      users.value = Array.isArray(data) ? data : data?.data || []
      return users.value
    } catch (err) {
      error.value = err?.message || 'Unable to load users.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserById = async (id) => {
    loading.value = true
    error.value = null

    try {
      const data = await userService.getUserById(id)
      selectedUser.value = data
      return data
    } catch (err) {
      error.value = err?.message || 'Unable to load user.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createUser = async (payload) => {
    loading.value = true
    error.value = null

    try {
      const data = await userService.createUser(payload)

      if (data) {
        users.value = [data, ...users.value]
      } else {
        await fetchUsers()
      }

      return data
    } catch (err) {
      error.value = err?.message || 'Unable to create user.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id, payload) => {
    loading.value = true
    error.value = null

    try {
      const data = await userService.updateUser(id, payload)

      if (data) {
        users.value = users.value.map((user) => (String(user.id) === String(id) ? data : user))
        selectedUser.value = data
      } else {
        await fetchUsers()
        selectedUser.value = await userService.getUserById(id)
      }

      return data
    } catch (err) {
      error.value = err?.message || 'Unable to update user.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id) => {
    loading.value = true
    error.value = null

    try {
      const data = await userService.deleteUser(id)
      users.value = users.value.filter((user) => String(user.id) !== String(id))

      if (!data) {
        await fetchUsers()
      }

      return data
    } catch (err) {
      error.value = err?.message || 'Unable to delete user.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    users,
    selectedUser,
    loading,
    error,
    fetchProfile,
    updateProfile,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
  }
})
