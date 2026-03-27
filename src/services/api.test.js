import { describe, it, expect, vi, beforeEach } from 'vitest'

const axiosCreateMock = vi.hoisted(() => vi.fn())
const requestHandlers = vi.hoisted(() => [])
const responseHandlers = vi.hoisted(() => [])
const createdApi = vi.hoisted(() => ({ current: null }))

vi.mock('axios', () => ({
  default: {
    create: (config) => {
      axiosCreateMock(config)
      const api = {
        interceptors: {
          request: {
            use: (handler) => {
              requestHandlers.push(handler)
            },
          },
          response: {
            use: (successHandler, errorHandler) => {
              responseHandlers.push({ successHandler, errorHandler })
            },
          },
        },
      }
      createdApi.current = api
      return api
    },
  },
}))

describe('api client', () => {
  beforeEach(() => {
    requestHandlers.length = 0
    responseHandlers.length = 0
    createdApi.current = null
    axiosCreateMock.mockClear()
    localStorage.clear()
    vi.resetModules()
  })

  it('adds an authorization header when a token is present', async () => {
    localStorage.setItem('token', 'token-123')

    await import('@/services/api')

    const handler = requestHandlers[0]
    const config = { headers: {} }
    const result = handler(config)

    expect(result.headers.Authorization).toBe('Bearer token-123')
  })

  it('leaves headers untouched when there is no token', async () => {
    await import('@/services/api')

    const handler = requestHandlers[0]
    const config = { headers: {} }
    const result = handler(config)

    expect(result.headers.Authorization).toBeUndefined()
  })

  it('normalizes errors with response data', async () => {
    await import('@/services/api')

    const { errorHandler } = responseHandlers[0]
    const error = {
      message: 'Request failed.',
      response: {
        status: 401,
        data: {
          message: 'Unauthorized.',
        },
      },
    }

    await expect(errorHandler(error)).rejects.toEqual({
      status: 401,
      data: {
        message: 'Unauthorized.',
      },
      message: 'Unauthorized.',
    })
  })

  it('normalizes errors without a response', async () => {
    await import('@/services/api')

    const { errorHandler } = responseHandlers[0]

    await expect(errorHandler({ message: 'Network down.' })).rejects.toEqual({
      status: null,
      data: null,
      message: 'Network down.',
    })
  })
})
