import { describe, it, expect, vi, beforeEach } from 'vitest'

const apiGet = vi.hoisted(() => vi.fn())
const apiPost = vi.hoisted(() => vi.fn())
const apiPut = vi.hoisted(() => vi.fn())
const apiDelete = vi.hoisted(() => vi.fn())

vi.mock('@/services/api', () => ({
  default: {
    get: apiGet,
    post: apiPost,
    put: apiPut,
    delete: apiDelete,
  },
}))

describe('studentService', () => {
  beforeEach(() => {
    apiGet.mockReset()
    apiPost.mockReset()
    apiPut.mockReset()
    apiDelete.mockReset()
  })

  it('gets all students', async () => {
    const studentService = (await import('@/services/studentService')).default
    apiGet.mockResolvedValue({ data: [{ id: 1 }] })

    const result = await studentService.getAll()

    expect(apiGet).toHaveBeenCalledWith('/students')
    expect(result).toEqual([{ id: 1 }])
  })

  it('gets a student by id', async () => {
    const studentService = (await import('@/services/studentService')).default
    apiGet.mockResolvedValue({ data: { id: 2 } })

    const result = await studentService.getById(2)

    expect(apiGet).toHaveBeenCalledWith('/students/2')
    expect(result).toEqual({ id: 2 })
  })

  it('creates a student', async () => {
    const studentService = (await import('@/services/studentService')).default
    apiPost.mockResolvedValue({ data: { id: 3 } })

    const result = await studentService.create({ name: 'New' })

    expect(apiPost).toHaveBeenCalledWith('/students', { name: 'New' })
    expect(result).toEqual({ id: 3 })
  })

  it('updates a student', async () => {
    const studentService = (await import('@/services/studentService')).default
    apiPut.mockResolvedValue({ data: { id: 4 } })

    const result = await studentService.update(4, { name: 'Updated' })

    expect(apiPut).toHaveBeenCalledWith('/students/4', { name: 'Updated' })
    expect(result).toEqual({ id: 4 })
  })

  it('removes a student', async () => {
    const studentService = (await import('@/services/studentService')).default
    apiDelete.mockResolvedValue({ data: { success: true } })

    const result = await studentService.delete(5)

    expect(apiDelete).toHaveBeenCalledWith('/students/5')
    expect(result).toEqual({ success: true })
  })
})
