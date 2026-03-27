import jsonServer from 'json-server'

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

const pickUserResponse = (user) => {
  const { password, ...safeUser } = user
  return safeUser
}

const generateToken = (user) => {
  const raw = `${user.id}:${user.email}:${Date.now()}`
  return Buffer.from(raw).toString('base64')
}

server.post('/api/login', (req, res) => {
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

  const user = router.db.get('users').find({ email }).value()

  if (!user || user.password !== password) {
    return res.status(401).json({
      message: 'Invalid credentials.',
    })
  }

  return res.status(200).json({
    token: generateToken(user),
    token_type: 'Bearer',
    user: pickUserResponse(user),
  })
})

server.use('/api', router)

server.listen(3001, () => {
  console.log('Mock API listening on http://localhost:3001')
})
