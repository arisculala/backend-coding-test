// Winston logger
import { transports as _transports, format as _format, createLogger } from 'winston'
import sqlite3 from 'sqlite3'
import sinon from 'sinon'
import { expect } from 'chai'
import buildSchemas from '../../src/schemas'
import RidesService from '../../src/services/rides-service';

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

describe('RidesService tests', () => {
  let ridesService: RidesService;

  before(async () => {
    db.serialize(() => {
        buildSchemas(db)
    })
    ridesService = new RidesService(logger, db);
  })

  describe('create', () => {
    it('should return newly created ride record in Rides table', async () => {
      const requestData = {
        start_lat: 1.29027,
        start_long: 103.851959,
        end_lat: 1.29027,
        end_long: 103.851959,
        rider_name: 'Jhon Doe',
        driver_name: 'Aris Culala',
        driver_vehicle: 'Honda CRV - SG1234567'
      }
      const createdRide = await ridesService.create(requestData)

      expect(createdRide).to.be.an('array')
      expect(createdRide[0].rideID).to.equal(1)
    })
  })

  describe('findAllCount', () => {
    it('should return total count of records from Rides table', async () => {
      const ridesCnt = await ridesService.findAllCount()

      expect(ridesCnt).to.be.an('number')
      expect(ridesCnt).greaterThan(0)
    })
  })

  describe('findAllPagination', () => {
    const requestDataPagination = {
      limit: 10,
      offset: 0,
      column: 'rideID',
      sort: 'DESC'
    }

    it('should return list of rides using the pagination limit, offset order by column (rideID) sorted in Descending order', async () => {
      for (var i = 2; i <= 21; i++) {
        const requestData = {
            start_lat: 1.29027,
            start_long: 103.851959,
            end_lat: 1.29027,
            end_long: 103.851959,
            rider_name: `Jhon Doe ${i}`,
            driver_name: 'Aris Culala',
            driver_vehicle: 'Honda CRV - SG1234567'
        }
        await ridesService.create(requestData)
      }
      const rides = await ridesService.findAllPagination(requestDataPagination)
      expect(rides).to.be.an('array')
      expect(rides[0].rideID).to.equal(21)
      expect(rides[9].rider_name).to.equal('Jhon Doe 12')
    })

    // it('should throw error 500 if there is something wrong with the database when calling findAllPagination', async () => {
    //   const dbAllStub = sinon
    //     .stub(db, 'all')
    //     .yields(new Error('Database all method retrieve fake error'))

    //   // expect the api call to return error 500
    //   const response = await ridesService.findAllPagination(requestDataPagination)
    //   console.log('response::', response)
    //   const errorResponse = response.body

    //   expect(errorResponse).to.be.an('object')
    //   expect(errorResponse.error_code).to.equal('SERVER_ERROR')
    //   expect(errorResponse.error_code).to.equal('UNKNOWN_ERROR')

    //   dbAllStub.restore()
    // })
  })

  describe('findRideById', () => {
    it('should return details of the specified rideID', async () => {
      const ride = await ridesService.findRideById(21)
      expect(ride).to.be.an('array')
      expect(ride[0].rideID).to.equal(21)
      expect(ride[0].rider_name).to.equal('Jhon Doe 21')
    })
  })
  
})
