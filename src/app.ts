'use strict'

import constants from './utils/constants'

import express from 'express'

import cors from 'cors'

import { json } from 'body-parser'

import _ from 'lodash'

// Winston logger
import { transports as _transports, format as _format, createLogger } from 'winston'
import sqlite3 from 'sqlite3'
const app = express()
app.use(cors())
const jsonParser = json()
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

  app.post('/rides', jsonParser, (req, res) => {
    logger.info('Calling post: /rides')
    const startLatitude = Number(req.body.start_lat)
    const startLongitude = Number(req.body.start_long)
    const endLatitude = Number(req.body.end_lat)
    const endLongitude = Number(req.body.end_long)
    const riderName = req.body.rider_name
    const driverName = req.body.driver_name
    const driverVehicle = req.body.driver_vehicle

    if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
      logger.error(constants.START_LAT_LON_ERROR_MSG)
      res.status(constants.HTTP_ERROR_CODE_500)
      return res.send({
        error_code: constants.VALIDATION_ERROR,
        message: constants.START_LAT_LON_ERROR_MSG
      })
    }

    if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
      logger.error(constants.END_LAT_LON_ERROR_MSG)
      res.status(constants.HTTP_ERROR_CODE_500)
      return res.send({
        error_code: constants.VALIDATION_ERROR,
        message: constants.END_LAT_LON_ERROR_MSG
      })
    }

    if (typeof riderName !== 'string' || riderName.length < 1) {
      logger.error(constants.RIDER_NAME_EMPTY_ERROR_MSG)
      res.status(constants.HTTP_ERROR_CODE_500)
      return res.send({
        error_code: constants.VALIDATION_ERROR,
        message: constants.RIDER_NAME_EMPTY_ERROR_MSG
      })
    }

    if (typeof driverName !== 'string' || driverName.length < 1) {
      logger.error(constants.DRIVER_NAME_EMPTY_ERROR_MSG)
      res.status(constants.HTTP_ERROR_CODE_500)
      return res.send({
        error_code: constants.VALIDATION_ERROR,
        message: constants.DRIVER_NAME_EMPTY_ERROR_MSG
      })
    }

    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
      logger.error(constants.DRIVER_VEHICLE_EMPTY_ERROR_MSG)
      res.status(constants.HTTP_ERROR_CODE_500)
      return res.send({
        error_code: constants.VALIDATION_ERROR,
        message: constants.DRIVER_VEHICLE_EMPTY_ERROR_MSG
      })
    }

    const values = [req.body.start_lat, req.body.start_long, req.body.end_lat, req.body.end_long, req.body.rider_name, req.body.driver_name, req.body.driver_vehicle]

    db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function (err) {
      if (err) {
        logger.error('Error encountered inserting ride details', err)
        res.status(constants.HTTP_ERROR_CODE_500)
        return res.send({
          error_code: constants.SERVER_ERROR,
          message: constants.UNKNOWN_ERROR
        })
      }

      db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
        if (err) {
          logger.error('Error encountered getting the newly created ride', err)
          res.status(constants.HTTP_ERROR_CODE_500)
          return res.send({
            error_code: constants.SERVER_ERROR,
            message: constants.UNKNOWN_ERROR
          })
        }

        res.send(rows)
      })
    })
  })

  app.get('/rides', (req, res) => {
    logger.info('Calling get: /rides')

    let limit = _.get(req.query, 'limit', 10)
    let offset = _.get(req.query, 'offset', 0)
    let column = _.get(req.query, 'column', 'rideID')
    let sort = _.get(req.query, 'sort', 'DESC')

    db.all(`SELECT count(*) as count FROM Rides ORDER BY ${column} ${sort}`, function (err, rows) {
      if (err) {
        logger.error('Error encountered getting list of rides count', err)
        res.status(constants.HTTP_ERROR_CODE_500)
        return res.send({
          error_code: constants.SERVER_ERROR,
          message: constants.UNKNOWN_ERROR
        })
      }

      const count = rows[0].count

      db.all(`SELECT * FROM Rides ORDER BY ${column} ${sort} limit ${limit} offset ${offset}`,
        function (err, rows) {
          if (err) {
            logger.error('Error encountered getting list of rides', err)
            res.status(constants.HTTP_ERROR_CODE_500)
            return res.send({
              error_code: constants.SERVER_ERROR,
              message: constants.UNKNOWN_ERROR
            })
          }

          if (rows.length === 0) {
            logger.error(constants.COULD_NOT_FIND_ANY_RIDES)
            res.status(constants.HTTP_ERROR_CODE_404)
            return res.send({
              error_code: constants.RIDES_NOT_FOUND_ERROR,
              message: constants.COULD_NOT_FIND_ANY_RIDES
            })
          }

          res.send({
            total: count,
            limit,
            offset,
            rows
          })
        }
      )
    })
  })

  app.get('/rides/:id', (req, res) => {
    logger.info('Calling get: /ride/{id}')

    db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, function (err, rows) {
      if (err) {
        logger.error('Error encountered getting the specified ride id details', err)
        res.status(constants.HTTP_ERROR_CODE_500)
        return res.send({
          error_code: constants.SERVER_ERROR,
          message: constants.UNKNOWN_ERROR
        })
      }

      if (rows.length === 0) {
        logger.error(`${constants.RIDE_ID_NOT_FOUND_ERROR} [${req.params.id}]`)
        res.status(constants.HTTP_ERROR_CODE_404)
        return res.send({
          error_code: constants.RIDE_NOT_FOUND_ERROR,
          message: `${constants.RIDE_ID_NOT_FOUND_ERROR} [${req.params.id}]`
        })
      }

      res.send(rows)
    })
  })

  return app
}
