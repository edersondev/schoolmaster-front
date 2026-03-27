import { existsSync, readFileSync } from 'node:fs'

const ENV_FILE = '.env'
const DEFAULT_API_URL = 'http://localhost:3001/api'

const readEnvValue = (key) => {
  if (!existsSync(ENV_FILE)) return null
  const raw = readFileSync(ENV_FILE, 'utf-8')
  const match = raw.match(new RegExp(`^${key}=(.*)$`, 'm'))
  if (!match) return null
  return match[1].trim().replace(/^['"]|['"]$/g, '')
}

const apiUrl = process.env.VITE_API_URL || readEnvValue('VITE_API_URL') || DEFAULT_API_URL

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

const request = async (path, options = {}) => {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let data = null
  const text = await response.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    const errorMessage = data?.message || response.statusText
    throw new Error(`Request failed (${response.status}): ${errorMessage}`)
  }

  return data
}

const run = async () => {
  console.log(`Smoke test target: ${apiUrl}`)

  const loginPayload = {
    email: 'admin@schoolmaster.test',
    password: 'password123',
  }

  const loginData = await request('/login', {
    method: 'POST',
    body: JSON.stringify(loginPayload),
  })

  assert(loginData?.token, 'Login did not return a token.')
  assert(loginData?.user?.email === loginPayload.email, 'Login returned unexpected user.')
  console.log('Login: ok')

  const meData = await request('/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  })

  assert(meData?.email === loginPayload.email, 'Me endpoint returned unexpected user.')
  console.log('Me: ok')

  const logoutData = await request('/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  })

  assert(logoutData?.message, 'Logout did not return a message.')
  console.log('Logout: ok')

  console.log('Smoke test completed successfully.')
}

run().catch((error) => {
  console.error(`Smoke test failed: ${error.message}`)
  process.exitCode = 1
})
