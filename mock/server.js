import jsonServer from 'json-server'
import dotenv from 'dotenv'
import data from './db.json' with { type: 'json' }

import createAuthRoutes from './routes/auth.routes.js'

const server = jsonServer.create()
const router = jsonServer.router(data)

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

  next()
})


const appHost = process.env.VITE_API_HOST?.trim() || 'localhost'
const PORT = process.env.VITE_API_PORT?.trim() || 3000
const HOST = appHost.replace(/^https?:\/\//, '').split('/')[0] || 'localhost'

server.use(PATH_PREFIX, router)

server.listen(PORT, HOST, () => {
  console.log(`Mock API listening on http://${HOST}:${PORT}${PATH_PREFIX}`);
})
