'use strict'

import request from 'supertest'
import buildSchemas from '../src/schemas'
import sqlite3 from 'sqlite3'
import sinon from 'sinon'

import { Express } from 'express-serve-static-core'
import _app from '../src/app'
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
    it('should return health', () => {
      request(app).get('/health').expect('Content-Type', /text/).expect(200)
    })
  })

  // test [post: /rides]
  describe('POST /rides', () => {
    it('should return rides', async () => {
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
  })

  // test [get: /rides]
  describe('GET /rides', () => {
    it('should return rides', async () => {
      const response = await request(app).get('/rides').expect(200)

      const rides = response.body

      expect(rides).to.be.an('array')
      expect(rides[0].rideID).to.equal(1)
    })

    it('should throw error 500 if there is something wrong with the database connection', async () => {
      const dbAllStub = sinon
        .stub(db, 'all')
        .yields(new Error('some fake error'))

      // expect the api call to return error 500
      await request(app).get('/rides').expect(500)
      dbAllStub.restore()
    })
  })

  // test [get: /rides/:id]
  describe('GET /rides/:id', () => {
    it('should return rides', async () => {
      const response = await request(app).get('/rides/1').expect(200)

      const rides = response.body

      expect(rides).to.be.an('array')
      expect(rides[0].rideID).to.equal(1)
    })
  })
})
