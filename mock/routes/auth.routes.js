import express from 'express'

const router = express.Router()

const tokenStore = new Map()

const pickUserResponse = (user) => {
  const { password, ...safeUser } = user
  return safeUser
}

const generateToken = (user) => {
  const raw = `${user.id}:${user.email}:${Date.now()}`
  return Buffer.from(raw).toString('base64')
}

const getAuthToken = (req) => {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) return null
  return header.replace('Bearer ', '').trim()
}

export default function createAuthRoutes(dbRouter, pathPrefix = '') {
  const users = dbRouter.db.get('users').value()

  router.post(`${pathPrefix}/login`, (req, res) => {

    try {
      const { email, password } = req.body || {}

      if (!email || !password) {
        throw {
          code: 422,
          message: 'The given data was invalid.',
          errors: {
            email: !email ? ['Email is required.'] : undefined,
            password: !password ? ['Password is required.'] : undefined,
          },
        }
      }

      const user = users.find((item) => item.email === email)

      if (!user || user.password !== password) {
        throw {
          code: 401,
          message: 'Invalid credentials.',
        }
      }

      const token = generateToken(user)
      tokenStore.set(token, user.id)
  
      return res.status(200).json({
        token,
        token_type: 'Bearer',
        user: pickUserResponse(user),
      })
    } catch (error) {
      console.error('Error in /login:', error)
      const response = {
        message: error.message ?? 'Internal Server Error',
        errors: error.errors ?? undefined,
      }
      return res.status(error.code ?? 500).json(response)
    }
  })

  router.get(`${pathPrefix}/me`, (req, res) => {
    try {
      const token = getAuthToken(req)
      const unauthenticatedError = { code: 401, message: 'Unauthenticated.' }

      if (!token) {
        throw unauthenticatedError
      }

      const userId = tokenStore.get(token)
      if (!userId) {
        throw unauthenticatedError
      }

      const user = users.find(item => item.id === userId)
      if (!user) {
        throw unauthenticatedError
      }

      return res.status(200).json(pickUserResponse(user))
    } catch (error) {
      console.error('Error in /me:', error)
      return res.status(error.code ?? 500).json({ message: error.message ?? 'Internal Server Error' })
    }
  })

  router.post(`${pathPrefix}/logout`, (req, res) => {
    const token = getAuthToken(req)
    if (token) {
      tokenStore.delete(token)
    }

    return res.status(200).json({ message: 'Logged out.' })
  })

  return router
}
