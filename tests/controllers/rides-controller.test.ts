// Winston logger
import { transports as _transports, format as _format, createLogger } from 'winston'
import sqlite3 from 'sqlite3'
import { expect } from 'chai'
import buildSchemas from '../../src/schemas'
import RidesService from '../../src/services/rides-service';
import RidesController from '../../src/controllers/rides-controller';

const sqlite3Ver = sqlite3.verbose()
const db = new sqlite3Ver.Database(':memory:')

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

describe('RidesController tests', () => {
  let ridesService, ridesController: RidesController;

  before(async () => {
    db.serialize(() => {
        buildSchemas(db)
    })
    ridesService = new RidesService(logger, db);
    ridesController = new RidesController(logger, ridesService);
  })

  describe('createRide', () => {
    it('should return newly created ride', async () => {
      const requestData = {
        start_lat: 1.29027,
        start_long: 103.851959,
        end_lat: 1.29027,
        end_long: 103.851959,
        rider_name: 'Jhon Doe',
        driver_name: 'Aris Culala',
        driver_vehicle: 'Honda CRV - SG1234567'
      }
      const createdRide = await ridesController.createRide(requestData)

      expect(createdRide).to.be.an('array')
      expect(createdRide[0].rideID).to.equal(1)
    })
  })

  describe('getRidesWithPagination', () => {
    it('should return list of rides with pagination parameters', async () => {
      const requestData = {
        limit: 10,
        offset: 0,
        column: 'rideID',
        sort: 'DESC'
      }
      const ridesWithPagination = await ridesController.getRidesWithPagination(requestData)

      expect(ridesWithPagination.rows).to.be.an('array')
      expect(ridesWithPagination.limit).to.equal(10)
      expect(ridesWithPagination.offset).to.equal(0)
    })
  })

  describe('getRideDetails', () => {
    it('should return ride details of the specified rideID', async () => {
      const rideDetails = await ridesController.getRideDetails(1)

      expect(rideDetails).to.be.an('array')
      expect(rideDetails[0].rideID).to.equal(1)
    })
  })
})
