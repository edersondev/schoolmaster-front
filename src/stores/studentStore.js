import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

import studentService from '@/services/studentService'

export const useStudentStore = defineStore('students', () => {
  const students = ref([])
  const loading = shallowRef(false)
  const error = shallowRef(null)

  const fetchStudents = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await studentService.getAll()
      students.value = Array.isArray(data) ? data : data?.data || []
      return students.value
    } catch (err) {
      error.value = err?.message || 'Unable to load students.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createStudent = async (payload) => {
    loading.value = true
    error.value = null

    try {
      const data = await studentService.create(payload)
      if (data) {
        students.value = [data, ...students.value]
      }
      return data
    } catch (err) {
      error.value = err?.message || 'Unable to create student.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    students,
    loading,
    error,
    fetchStudents,
    createStudent,
  }
})
