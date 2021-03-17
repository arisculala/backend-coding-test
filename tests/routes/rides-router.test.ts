'use strict'

import request from 'supertest'
import buildSchemas from '../../src/schemas'
import sqlite3 from 'sqlite3'
import sinon from 'sinon'

import { Express } from 'express-serve-static-core'
import _app from '../../src/app'
import { expect } from 'chai'

const sqlite3Ver = sqlite3.verbose()
const db = new sqlite3Ver.Database(':memory:')

let app: Express

describe('API tests', () => {
  before(async () => {
    db.serialize(() => {
      buildSchemas(db)
      app = _app(db)
    })
  })

  // test [get: /health]
  describe('GET /health', async () => {
    it('should return health status code 200', () => {
      request(app).get('/health').expect('Content-Type', /text/).expect(200)
    })

    it('should return health status code 200 and response string Healthy', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /text/).expect(200)

      expect(response.text).to.equal('Healthy')
    })
  })

  // test [post: /rides]
  describe('POST /rides', () => {
    it('should return newly created ride', async () => {
      const response = await request(app)
        .post('/rides')
        .send({
          start_lat: 1.29027,
          start_long: 103.851959,
          end_lat: 1.29027,
          end_long: 103.851959,
          rider_name: 'Jhon Doe',
          driver_name: 'Aris Culala',
          driver_vehicle: 'Honda CRV - SG1234567'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)

      const rides = response.body

      expect(rides).to.be.an('array')
      expect(rides[0].rideID).to.equal(1)
    })

    it('should return newly created rides for pagination testing', async () => {
      for (var i = 2; i <= 58; i++) {
        const response = await request(app)
          .post('/rides')
          .send({
            start_lat: 1.29027,
            start_long: 103.851959,
            end_lat: 1.29027,
            end_long: 103.851959,
            rider_name: `Jhon Doe ${i}`,
            driver_name: 'Aris Culala',
            driver_vehicle: 'Honda CRV - SG1234567'
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)

        const rides = response.body

        expect(rides).to.be.an('array')
      }
    })

    it('should return error 500 if startLatitude < -90 or startLatitude > 90 and startLongitude < -180 or startLongitude > 180', async () => {
      const response = await request(app)
        .post('/rides')
        .send({
          start_lat: 91,
          start_long: 181,
          end_lat: 1.29027,
          end_long: 103.851959,
          rider_name: 'Jhon Doe',
          driver_name: 'Aris Culala',
          driver_vehicle: 'Honda CRV - SG1234567'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)

      const errorResponse = response.body

      expect(errorResponse).to.be.an('object')
      expect(errorResponse.error_code).to.equal('VALIDATION_ERROR')
      expect(errorResponse.message).to.equal(
        'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
      )
    })

    it('should return error 500 if endLatitude < -90 or endLatitude > 90 and endLongitude < -180 or endLongitude > 180', async () => {
      const response = await request(app)
        .post('/rides')
        .send({
          start_lat: 1.29027,
          start_long: 103.851959,
          end_lat: 91,
          end_long: 181,
          rider_name: 'Jhon Doe',
          driver_name: 'Aris Culala',
          driver_vehicle: 'Honda CRV - SG1234567'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)

      const errorResponse = response.body

      expect(errorResponse).to.be.an('object')
      expect(errorResponse.error_code).to.equal('VALIDATION_ERROR')
      expect(errorResponse.message).to.equal(
        'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
      )
    })

    it('should return error 500 if the rider name is not a string or empty', async () => {
      const response = await request(app)
        .post('/rides')
        .send({
          start_lat: 1.29027,
          start_long: 103.851959,
          end_lat: 1.29027,
          end_long: 103.851959,
          rider_name: '',
          driver_name: 'Aris Culala',
          driver_vehicle: 'Honda CRV - SG1234567'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)

      const errorResponse = response.body

      expect(errorResponse).to.be.an('object')
      expect(errorResponse.error_code).to.equal('VALIDATION_ERROR')
      expect(errorResponse.message).to.equal(
        'Rider name must be a non empty string'
      )
    })

    it('should return error 500 if the driver name is not a string or empty', async () => {
      const response = await request(app)
        .post('/rides')
        .send({
          start_lat: 1.29027,
          start_long: 103.851959,
          end_lat: 1.29027,
          end_long: 103.851959,
          rider_name: 'Jhon Doe',
          driver_name: '',
          driver_vehicle: 'Honda CRV - SG1234567'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)

      const errorResponse = response.body

      expect(errorResponse).to.be.an('object')
      expect(errorResponse.error_code).to.equal('VALIDATION_ERROR')
      expect(errorResponse.message).to.equal(
        'Driver name must be a non empty string'
      )
    })

    it('should return error 500 if the driver vehicle is not a string or empty', async () => {
      const response = await request(app)
        .post('/rides')
        .send({
          start_lat: 1.29027,
          start_long: 103.851959,
          end_lat: 1.29027,
          end_long: 103.851959,
          rider_name: 'Jhon Doe',
          driver_name: 'Aris Culala',
          driver_vehicle: ''
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)

      const errorResponse = response.body

      expect(errorResponse).to.be.an('object')
      expect(errorResponse.error_code).to.equal('VALIDATION_ERROR')
      expect(errorResponse.message).to.equal(
        'Driver vehicle must be a non empty string'
      )
    })

    it('should throw error 500 if there is something wrong with the database when doing insert of new ride', async () => {
      const dbAllStub = sinon
        .stub(db, 'run')
        .yields(new Error('Database run method insert fake error'))

      // expect the api call to return error 500
      await request(app)
        .post('/rides')
        .send({
          start_lat: 1.29027,
          start_long: 103.851959,
          end_lat: 1.29027,
          end_long: 103.851959,
          rider_name: 'Jhon Doe',
          driver_name: 'Aris Culala',
          driver_vehicle: 'Honda CRV - SG1234567'
        }).expect(500)
      dbAllStub.restore()
    })

    it('should throw error 500 if there is something wrong with the database when retrieving the newly created ride details after the insert', async () => {
      const dbAllStub = sinon
        .stub(db, 'all')
        .yields(new Error('Database all method insert fake error'))

      // expect the api call to return error 500
      await request(app)
        .post('/rides')
        .send({
          start_lat: 1.29027,
          start_long: 103.851959,
          end_lat: 1.29027,
          end_long: 103.851959,
          rider_name: 'Jhon Doe',
          driver_name: 'Aris Culala',
          driver_vehicle: 'Honda CRV - SG1234567'
        }).expect(500)
      dbAllStub.restore()
    })
  })

  // test [get: /rides/:id]
  describe('GET /rides/:id', () => {
    it('should return specified id ride details', async () => {
      const response = await request(app).get('/rides/1').expect(200)

      const rides = response.body

      expect(rides).to.be.an('array')
      expect(rides[0].rideID).to.equal(1)
    })

    it('should return 500 if the ride id specified do not exists', async () => {
      const response = await request(app)
        .get('/rides/287')
        .expect(500)

      const errorResponse = response.body

      expect(errorResponse).to.be.an('object')
      expect(errorResponse.error_code).to.equal('RIDE_NOT_FOUND_ERROR')
      expect(errorResponse.message).to.equal(
        'Could not find any rides with the specified id'
      )
    })

    it('should throw error 500 if there is something wrong with the database when retrieving the specified ride id details', async () => {
      const dbAllStub = sinon
        .stub(db, 'all')
        .yields(new Error('Database all method retrieve fake error'))

      // expect the api call to return error 500
      const response = await request(app)
        .get('/rides/1')
        .expect(500)

      const errorResponse = response.body

      expect(errorResponse).to.be.an('object')
      expect(errorResponse.error_code).to.equal('SERVER_ERROR')
      expect(errorResponse.message).to.equal('Unknown error')
      dbAllStub.restore()
    })
  })

  // test [get: /rides]
  describe('GET /rides', () => {
    it('should return list of rides using the default value of query params (limit=10, offset=0, column=rideID, sort=DESC)', async () => {
      var paginationQueryParams = {};

      const response = await request(app).get('/rides').query(paginationQueryParams).expect(200)
      const rides = response.body
      const rows = rides.rows;

      expect(rows).to.be.an('array')
      expect(rows[0].rideID).to.equal(59)
    })

    it('should return all available list of rides total of 59, rideID sorted in Descending order', async () => {
      var paginationQueryParams = { limit: 100, offset: 0, column: 'rideID', sort: 'DESC' };

      const response = await request(app).get('/rides').query(paginationQueryParams).expect(200)
      const rides = response.body
      const rows = rides.rows;

      expect(rows).to.be.an('array')
      expect(rows[0].rideID).to.equal(59)
      expect(rows[58].rideID).to.equal(1)
    })

    it('should return the first 5 rides with rideID sorted in Ascending order', async () => {
      var paginationQueryParams = { limit: 5, offset: 0, column: 'rideID', sort: 'ASC' };

      const response = await request(app).get('/rides').query(paginationQueryParams).expect(200)
      const rides = response.body
      const rows = rides.rows;

      expect(rows).to.be.an('array')
      expect(rows.length).to.equal(5)
      expect(rows[0].rideID).to.equal(1)
      expect(rows[1].rideID).to.equal(2)
      expect(rows[2].rideID).to.equal(3)
      expect(rows[3].rideID).to.equal(4)
      expect(rows[4].rideID).to.equal(5)
    })

    it('should return list of 6 rides starting from rideID 11 to 16 since rideID is sorted in Ascending order', async () => {
      var paginationQueryParams = { limit: 6, offset: 10, column: 'rideID', sort: 'ASC' };

      const response = await request(app).get('/rides').query(paginationQueryParams).expect(200)
      const rides = response.body
      const rows = rides.rows;

      expect(rows).to.be.an('array')
      expect(rows.length).to.equal(6)
      expect(rows[0].rideID).to.equal(11)
      expect(rows[1].rideID).to.equal(12)
      expect(rows[2].rideID).to.equal(13)
      expect(rows[3].rideID).to.equal(14)
      expect(rows[4].rideID).to.equal(15)
      expect(rows[5].rideID).to.equal(16)
    })

    it('should return list of 6 rides starting from 49 to 44 since rideID is sorted in Descending order', async () => {
      var paginationQueryParams = { limit: 6, offset: 10, column: 'rideID', sort: 'DESC' };

      const response = await request(app).get('/rides').query(paginationQueryParams).expect(200)
      const rides = response.body
      const rows = rides.rows;

      expect(rows).to.be.an('array')
      expect(rows.length).to.equal(6)
      expect(rows[0].rideID).to.equal(49)
      expect(rows[1].rideID).to.equal(48)
      expect(rows[2].rideID).to.equal(47)
      expect(rows[3].rideID).to.equal(46)
      expect(rows[4].rideID).to.equal(45)
      expect(rows[5].rideID).to.equal(44)
    })

    it('should throw error 500 if there is something wrong with the database when retrieving list of rides', async () => {
      const dbAllStub = sinon
        .stub(db, 'all')
        .yields(new Error('Database all method retrieve fake error'))

      // expect the api call to return error 500
      await request(app).get('/rides').expect(500)
      dbAllStub.restore()
    })

    it('should return 500 if no rides found', async () => {
      // Delete data in Rides table
      db.all('DELETE FROM Rides', function (err, rows) {});

      // expect the api call to return error 404
      const response = await request(app)
        .get('/rides')
        .expect(500)

      const errorResponse = response.body

      expect(errorResponse).to.be.an('object')
      expect(errorResponse.error_code).to.equal('RIDES_NOT_FOUND_ERROR')
      expect(errorResponse.message).to.equal('Could not find any rides')
    })
  })

})
