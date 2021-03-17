'use strict'

import constants from './utils/constants'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import _ from 'lodash'
import rideRoutes from './routes/rides-router'
import { transports as _transports, format as _format, createLogger } from 'winston'
import sqlite3 from 'sqlite3'

const app = express()

// Use cors
app.use(cors())

// Use bodyParser
app.use(bodyParser.json({ limit: '10MB', type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Winston logger configuration
const logConfiguration = {
  transports: [
    new _transports.File({ filename: 'logs/error.log', level: 'error' }),
    new _transports.File({ filename: 'logs/info.log', level: 'info' })
  ],
  format: _format.combine(
    _format.timestamp({
      format: 'MM-DD-YYYY HH:mm:ss'
    }),
    _format.printf(info => `[${info.level}]: ${[info.timestamp]}: ${info.message}`)
  )
}
const logger = createLogger(logConfiguration)

export default (db: sqlite3.Database) => {
  app.get('/health', (req, res) => res.send('Healthy'))

  app.use([rideRoutes(logger, db)])

  return app
}
