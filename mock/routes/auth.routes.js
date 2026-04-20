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

const onlyDigits = (value) => String(value || '').replace(/\D/g, '')

const normalizeRegisterPayload = (payload = {}) => ({
  name: String(payload.name || '').trim(),
  email: String(payload.email || '').trim(),
  password: String(payload.password || ''),
  cpf: onlyDigits(payload.cpf),
  phone: onlyDigits(payload.phone),
})

export default function createAuthRoutes(dbRouter, pathPrefix = '') {
  const usersCollection = () => dbRouter.db.get('users')
  const getUsers = () => usersCollection().value()

  router.get(`${pathPrefix}/register/cpf-availability`, (req, res) => {
    try {
      const cpf = onlyDigits(req.query?.cpf)

      const existingUser = getUsers().find((item) => item.cpf === cpf)
      if (existingUser) {
        throw {
          code: 422,
          message: 'CPF is already registered.',
          errors: {
            cpf: ['CPF is already registered.'],
          },
        }
      }

      return res.status(200).json({
        available: true,
        message: 'CPF can be registered.',
      })
    } catch (error) {
      console.error('Error in /register/cpf-availability:', error)
      const response = {
        message: error.message ?? 'Internal Server Error',
        errors: error.errors ?? undefined,
      }
      return res.status(error.code ?? 500).json(response)
    }
  })

  router.post(`${pathPrefix}/register`, (req, res) => {
    try {
      const payload = normalizeRegisterPayload(req.body)

      const users = getUsers()
      const cpfTaken = users.some((item) => item.cpf === payload.cpf)

      if (cpfTaken) {
        throw {
          code: 422,
          message: 'CPF is already registered.',
          errors: {
            cpf: ['CPF is already registered.'],
          },
        }
      }

      payload.status = 0; // pending approval
      payload.role = 'school-admin'

      usersCollection().insert({ ...payload }).write()

      return res.status(201).json({
        message: 'Account created successfully. Your registration will be active soon.',
      })
    } catch (error) {
      console.error('Error in /register:', error)
      const response = {
        message: error.message ?? 'Internal Server Error',
        errors: error.errors ?? undefined,
      }
      return res.status(error.code ?? 500).json(response)
    }
  })

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

      const user = getUsers().find((item) => item.email === email)

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

      const user = getUsers().find((item) => item.id === userId)
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
