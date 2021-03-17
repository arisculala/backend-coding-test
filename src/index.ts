'use strict'

// Dependencies
import express from 'express'
import sqlite3 from 'sqlite3'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import _app from './app'
import buildSchemas from './schemas'

// Initialize app as an instance of express
const app = express()

// Initialize port number of the application
const port = 8010

// Initialize sqlite3 db
const sqlite3Ver = sqlite3.verbose()
const db = new sqlite3Ver.Database(':memory:')

db.serialize(() => {
  // Initialize db schemas to be created
  buildSchemas(db)

  const app = _app(db)

  // Use swagger.yml for swagger documentation ui
  const swaggerDocument = YAML.load(`${__dirname}/docs/swagger.yml`);
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );

  app.listen(port, () => console.log(`App started and listening on port ${port}`))
})
