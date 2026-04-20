import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

import schoolService from '@/services/schoolService'

export const useSchoolStore = defineStore('school', () => {
  const schools = ref([])
  const selectedSchool = ref(null)
  const loading = shallowRef(false)
  const error = shallowRef(null)

  const fetchSchools = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await schoolService.getAllSchools()
      schools.value = Array.isArray(data) ? data : data?.data || []
      return schools.value
    } catch (err) {
      error.value = err?.message || 'Unable to load schools.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchSchoolById = async (id) => {
    loading.value = true
    error.value = null

    try {
      const data = await schoolService.getSchoolById(id)
      selectedSchool.value = data
      return data
    } catch (err) {
      error.value = err?.message || 'Unable to load school.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createSchool = async (payload) => {
    loading.value = true
    error.value = null

    try {
      const data = await schoolService.createSchool(payload)

      if (data) {
        schools.value = [data, ...schools.value]
      } else {
        await fetchSchools()
      }

      return data
    } catch (err) {
      error.value = err?.message || 'Unable to create school.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSchool = async (id, payload) => {
    loading.value = true
    error.value = null

    try {
      const data = await schoolService.updateSchool(id, payload)

      if (data) {
        schools.value = schools.value.map((school) => (String(school.id) === String(id) ? data : school))
        selectedSchool.value = data
      } else {
        await fetchSchools()
        selectedSchool.value = await schoolService.getSchoolById(id)
      }

      return data
    } catch (err) {
      error.value = err?.message || 'Unable to update school.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSchool = async (id) => {
    loading.value = true
    error.value = null

    try {
      const data = await schoolService.deleteSchool(id)
      schools.value = schools.value.filter((school) => String(school.id) !== String(id))

      if (!data) {
        await fetchSchools()
      }

      return data
    } catch (err) {
      error.value = err?.message || 'Unable to delete school.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    schools,
    selectedSchool,
    loading,
    error,
    fetchSchools,
    fetchSchoolById,
    createSchool,
    updateSchool,
    deleteSchool,
  }
})
