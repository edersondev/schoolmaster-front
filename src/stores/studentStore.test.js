import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const getAllMock = vi.hoisted(() => vi.fn())
const createMock = vi.hoisted(() => vi.fn())

vi.mock('@/services/studentService', () => ({
  default: {
    getAll: getAllMock,
    create: createMock,
  },
}))

describe('studentStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    getAllMock.mockReset()
    createMock.mockReset()
  })

  it('fetches students from a plain array', async () => {
    const { useStudentStore } = await import('@/stores/studentStore')
    const store = useStudentStore()
    getAllMock.mockResolvedValue([{ id: 1 }])

    const result = await store.fetchStudents()

    expect(result).toEqual([{ id: 1 }])
    expect(store.students).toEqual([{ id: 1 }])
  })

  it('fetches students from a data wrapper', async () => {
    const { useStudentStore } = await import('@/stores/studentStore')
    const store = useStudentStore()
    getAllMock.mockResolvedValue({ data: [{ id: 2 }] })

    const result = await store.fetchStudents()

    expect(result).toEqual([{ id: 2 }])
    expect(store.students).toEqual([{ id: 2 }])
  })

  it('creates a new student and prepends it', async () => {
    const { useStudentStore } = await import('@/stores/studentStore')
    const store = useStudentStore()
    store.students = [{ id: 1 }]
    createMock.mockResolvedValue({ id: 3 })

    const result = await store.createStudent({ name: 'New' })

    expect(result).toEqual({ id: 3 })
    expect(store.students[0]).toEqual({ id: 3 })
  })

  it('handles fetch errors', async () => {
    const { useStudentStore } = await import('@/stores/studentStore')
    const store = useStudentStore()
    getAllMock.mockRejectedValue(new Error('Boom'))

    await expect(store.fetchStudents()).rejects.toThrow('Boom')

    expect(store.error).toBe('Boom')
    expect(store.loading).toBe(false)
  })

  it('handles create errors', async () => {
    const { useStudentStore } = await import('@/stores/studentStore')
    const store = useStudentStore()
    createMock.mockRejectedValue(new Error('Nope'))

    await expect(store.createStudent({ name: 'Bad' })).rejects.toThrow('Nope')

    expect(store.error).toBe('Nope')
    expect(store.loading).toBe(false)
  })
})
