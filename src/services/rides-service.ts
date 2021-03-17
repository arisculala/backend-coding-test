import { Logger } from "winston"
import sqlite3 from "sqlite3"
import _ from 'lodash'
import constants from "../utils/constants"
import CustomError from "../utils/custom-error"
import { CreateRide } from '../interfaces/ride'

class RideService {
    logger: Logger;
    db: sqlite3.Database;

    constructor(logger: Logger, db: sqlite3.Database) {
        this.logger = logger;
        this.db = db;
    }

    // Create a new ride record in Rides table
    public async create(requestData: CreateRide): Promise<any> {
        try {
            const self = this;
            this.logger.info('Calling rides-service create')

            // Make sure the values pass to requestData are in the same sequence on how we populate in the query below
            const values = Object.values(requestData);

            return await new Promise((resolve, reject) => {
                self.db.run('INSERT INTO Rides(start_lat, start_long, end_lat, end_long, rider_name, driver_name, driver_vehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                    values, 
                    function (err) {
                        if (err) {
                            self.logger.error('Error encountered inserting ride details', err)
                            reject(new CustomError(constants.SERVER_ERROR, constants.UNKNOWN_ERROR));
                        }

                        self.db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, function (err, rows) {
                        if (err) {
                            self.logger.error('Error encountered getting the newly created ride', err)
                            reject(new CustomError(constants.SERVER_ERROR, constants.UNKNOWN_ERROR));
                        }

                        resolve(rows);
                    })
                })
            });
        } catch (err) {
            this.logger.error('Error encountered rides-service create', err);
            throw err;
        }
    }

    // Get total count from Rides table
    public async findAllCount(): Promise<any> {
        try {
            const self = this;
            this.logger.info('Calling rides-service findAllCount')

            return await new Promise((resolve, reject) => {
                self.db.all(`SELECT count(*) as count FROM Rides`,
                    function (err, rows) {
                    if (err) {
                        self.logger.error('Error encountered getting list of rides count', err)
                        reject(new CustomError(constants.SERVER_ERROR, constants.UNKNOWN_ERROR));
                    }
                    const count = rows[0].count
                    resolve(count);
                  })
            })
        } catch (err) {
            this.logger.error('Error encountered rides-service findAllCount', err);
            throw err;
        }
    }

    // Get list of rides using the pagination parameters from Rides table
    public async findAllPagination(requestData: any): Promise<any> {
        try {
            const self = this;
            this.logger.info('Calling rides-service findAllPagination')

            let limit = _.get(requestData, 'limit', 10)
            let offset = _.get(requestData, 'offset', 0)
            let column = _.get(requestData, 'column', 'rideID')
            let sort = _.get(requestData, 'sort', 'DESC')

            return await new Promise((resolve, reject) => {
                self.db.all(`SELECT * FROM Rides ORDER BY ${column} ${sort} limit ? offset ?`, [limit, offset],
                    function (err, rows) {
                    if (err || rows.length === 0) {
                        self.logger.error(constants.COULD_NOT_FIND_ANY_RIDES)
                        reject(new CustomError(constants.RIDES_NOT_FOUND_ERROR, constants.COULD_NOT_FIND_ANY_RIDES));
                    }
                    resolve(rows);
                })
            })
        } catch (err) {
            this.logger.error('Error encountered rides-service findAllPagination', err);
            throw err;
        }
    }

    // Get ride details from Rides table using the specified rideID
    public async findRideById(id: Number): Promise<any> {
        try {
            const self = this;
            this.logger.info('Calling rides-service findRideById')

            return await new Promise((resolve, reject) => {
                self.db.all(`SELECT * FROM Rides WHERE rideID='${id}'`,
                    function (err, rows) {
                    if (err) {
                        self.logger.error('Error encountered getting the specified ride id details', err)
                        reject(new CustomError(constants.SERVER_ERROR, constants.UNKNOWN_ERROR));
                    }

                    if (rows.length === 0) {
                        self.logger.error(constants.RIDE_ID_NOT_FOUND_ERROR)
                        reject(new CustomError(constants.RIDE_NOT_FOUND_ERROR, constants.RIDE_ID_NOT_FOUND_ERROR));
                    }
                    resolve(rows);
                })
            })
        } catch (err) {
            this.logger.error('Error encountered rides-service findRideById', err);
            throw err;
        }
    }
}

export default RideService;