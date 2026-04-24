import express from 'express'
import path from 'path'
import pluralize from 'pluralize';

const router = express.Router()

function getRelatedEntityData(base, dbRouter) {
  const dataCollection = () => dbRouter.db.get(base)
  const getData = () => dataCollection().value()
  return getData()
}

export default function loadEntitiesRoutes(dbRouter, pathPrefix = '') {

  router.get(`${pathPrefix}/*`, (req, res, next) => {
    const base = path.basename(req.path)

    // To simulate eager loading of related entities, we check for query parameter 'include'
    // spatie/laravel-query-builder uses 'include' to specify related entities to load, e.g. ?include=author,comments
    const include = req.query?.include

    if (!include) {
      return next() // No related entities to load, proceed to the next middleware/router
    }

    const data = getRelatedEntityData(base, dbRouter)

    data.forEach(obj => {
      const idKeys = Object.keys(obj).filter(key => key.includes(`${include}_id`));

      for (const idKey of idKeys) {
        const relatedEntityName = pluralize(include);

        const relatedEntityData = dbRouter.db.get(relatedEntityName).find({ id: obj[idKey] }).value();

        if (relatedEntityData) {
          obj[include] = relatedEntityData; // Add the related entity data with the new key
        }
      }

    })

    next()
  })

  return router
}
