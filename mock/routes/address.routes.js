import express from 'express'

const router = express.Router()

const onlyDigits = (value) => String(value || '').replace(/\D/g, '')

export default function createAddressRoutes(_dbRouter, pathPrefix = '') {
  router.get(`${pathPrefix}/get-address/:zipcode`, (req, res) => {
    try {
      const zipcode = onlyDigits(req.params?.zipcode)

      if (!zipcode) {
        throw {
          code: 422,
          message: 'ZIP code is required.',
          errors: {
            zipcode: ['ZIP code is required.'],
          },
        }
      }

      return res.status(200).json({
        street: 'Rua Exemplo',
        neighborhood: 'Centro',
        city: 'Campinas',
        state: 'SP',
      })
    } catch (error) {
      console.error('Error in /get-address/:zipcode:', error)
      const response = {
        message: error.message ?? 'Internal Server Error',
        errors: error.errors ?? undefined,
      }
      return res.status(error.code ?? 500).json(response)
    }
  })

  return router
}
