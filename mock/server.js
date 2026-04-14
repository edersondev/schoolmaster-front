import jsonServer from 'json-server'
import dotenv from 'dotenv'
import path from 'path'

import createAuthRoutes from './routes/auth.routes.js'

const server = jsonServer.create()
const router = jsonServer.router(path.resolve('mock/db.json'))

const middlewares = jsonServer.defaults()

dotenv.config()

server.use(middlewares)
server.use(jsonServer.bodyParser)

const PATH_PREFIX = '/api'

// Mount auth routes before the default router
server.use(createAuthRoutes(router, PATH_PREFIX))

// middleware
server.use((req, res, next) => {
  console.log(`[MOCK API] ${req.method} ${req.path}`)

  if (req.method === 'POST' && req.path === `${PATH_PREFIX}/users`) {
    const users = router.db.get('users').value() || []
    const lastId = users.reduce((maxId, user) => Math.max(maxId, Number(user?.id) || 0), 0)
    const now = new Date().toISOString()

    return res.status(201).json({
      id: lastId + 1,
      ...req.body,
      created_at: now,
      updated_at: now,
    })
  }

  if (req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
    return res.status(204).end()
  }

  next()
})


const appHost = process.env.VITE_API_HOST?.trim() || 'localhost'
const PORT = process.env.VITE_API_PORT?.trim() || 3000
const HOST = appHost.replace(/^https?:\/\//, '').split('/')[0] || 'localhost'

server.use(PATH_PREFIX, router)

server.listen(PORT, HOST, () => {
  console.log(`Mock API listening on http://${HOST}:${PORT}${PATH_PREFIX}`);
})
