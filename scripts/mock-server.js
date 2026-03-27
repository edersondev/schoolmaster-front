import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve as resolvePath } from 'node:path'
import { App } from '@tinyhttp/app'
import { cors } from '@tinyhttp/cors'
import { createApp } from 'json-server/lib/app.js'
import { NormalizedAdapter } from 'json-server/lib/adapters/normalized-adapter.js'
import { Observer } from 'json-server/lib/adapters/observer.js'
import { JSONFile } from 'lowdb/node'
import { Low } from 'lowdb'
import { json } from 'milliparsec'

const DB_FILE = 'db.json'
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
const parsedUrl = new URL(apiUrl)
const API_PREFIX = parsedUrl.pathname.replace(/\/$/, '') || '/api'
const PORT = parsedUrl.port ? Number(parsedUrl.port) : parsedUrl.protocol === 'https:' ? 443 : 80
const HOST = parsedUrl.hostname || 'localhost'
const APP_ORIGIN = process.env.VITE_APP_URL || readEnvValue('VITE_APP_URL') || null

const dbPath = resolvePath(DB_FILE)

if (!existsSync(dbPath)) {
  writeFileSync(dbPath, '{}')
} else if (readFileSync(dbPath, 'utf-8').trim() === '') {
  writeFileSync(dbPath, '{}')
}

const adapter = new JSONFile(dbPath)
const observer = new Observer(new NormalizedAdapter(adapter))
const db = new Low(observer, {})
await db.read()
db.data ||= {}

const server = new App()
const tokenStore = new Map()
const api = createApp(db, { logger: false })

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

server.use(
  cors({
    origin: APP_ORIGIN || true,
    credentials: true,
  })
)
server.use(API_PREFIX, json())

server.post(`${API_PREFIX}/login`, (req, res) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(422).json({
      message: 'The given data was invalid.',
      errors: {
        email: !email ? ['Email is required.'] : undefined,
        password: !password ? ['Password is required.'] : undefined,
      },
    })
  }

  const user = (db.data?.users || []).find((item) => item.email === email)

  if (!user || user.password !== password) {
    return res.status(401).json({
      message: 'Invalid credentials.',
    })
  }

  const token = generateToken(user)
  tokenStore.set(token, user.id)

  return res.status(200).json({
    token,
    token_type: 'Bearer',
    user: pickUserResponse(user),
  })
})

server.get(`${API_PREFIX}/me`, (req, res) => {
  const token = getAuthToken(req)

  if (!token) {
    return res.status(401).json({ message: 'Unauthenticated.' })
  }

  const userId = tokenStore.get(token)
  if (!userId) {
    return res.status(401).json({ message: 'Unauthenticated.' })
  }

  const user = (db.data?.users || []).find((item) => item.id === userId)
  if (!user) {
    return res.status(401).json({ message: 'Unauthenticated.' })
  }

  return res.status(200).json(pickUserResponse(user))
})

server.post(`${API_PREFIX}/logout`, (req, res) => {
  const token = getAuthToken(req)
  if (token) {
    tokenStore.delete(token)
  }

  return res.status(200).json({ message: 'Logged out.' })
})

server.use(API_PREFIX, api)

server.listen(PORT, HOST, () => {
  console.log(`Mock API listening on ${apiUrl}`)
})
