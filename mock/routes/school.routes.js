import express from 'express'

const router = express.Router()

const onlyDigits = (value) => String(value || '').replace(/\D/g, '')

export default function createSchoolRoutes(dbRouter, pathPrefix = '') {
  const schoolsCollection = () => dbRouter.db.get('schools')
  const getSchools = () => schoolsCollection().value()

  router.get(`${pathPrefix}/schools/cnpj-availability`, (req, res) => {
    try {
      const cnpj = onlyDigits(req.query?.cnpj)

      const existingSchool = getSchools().find((item) => onlyDigits(item.document) === cnpj)
      if (existingSchool) {
        throw {
          code: 422,
          message: 'CNPJ is already registered.',
          errors: {
            cnpj: ['CNPJ is already registered.'],
          },
        }
      }

      return res.status(200).json({
        available: true,
        message: 'CNPJ can be registered.',
      })
    } catch (error) {
      console.error('Error in /schools/cnpj-availability:', error)
      const response = {
        message: error.message ?? 'Internal Server Error',
        errors: error.errors ?? undefined,
      }
      return res.status(error.code ?? 500).json(response)
    }
  })

  return router
}
