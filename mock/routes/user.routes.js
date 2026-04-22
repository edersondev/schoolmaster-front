import express from 'express'

const router = express.Router()

export default function listUsersRoutes(dbRouter, pathPrefix = '') {
  const usersCollection = () => dbRouter.db.get('users')
  const getUsers = () => usersCollection().value()

  router.get(`${pathPrefix}/users`, (req, res) => {
    try {
      const users = getUsers()

      users.forEach(user => {
        delete user.password
        user.role = dbRouter.db.get('roles').find({ id: user.role_id }).value() || null

        return user
      })

      return res.status(200).json(users)
    } catch (error) {
      console.error('Error in GET /users:', error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  return router
}
