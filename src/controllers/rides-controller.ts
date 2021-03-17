import { Logger } from "winston";
import sqlite3 from "sqlite3";
import _ from 'lodash'
import constants from "../utils/constants"
import CustomError from "../utils/custom-error";
import { IRideService, CreateRide } from '../interfaces/ride'

class RideController {
    logger: Logger;
    rideService: IRideService;

    constructor(logger: Logger, rideService: IRideService) {
        this.logger = logger;
        this.rideService = rideService;
    }

    public async createRide(requestData: CreateRide): Promise<any> {
        const startLatitude = Number(requestData.start_lat)
        const startLongitude = Number(requestData.start_long)
        const endLatitude = Number(requestData.end_lat)
        const endLongitude = Number(requestData.end_long)
        const riderName = requestData.rider_name
        const driverName = requestData.driver_name
        const driverVehicle = requestData.driver_vehicle

        const self = this;

        try {
            if (startLatitude < -90 || startLatitude > 90 || startLongitude < -180 || startLongitude > 180) {
                self.logger.error(constants.START_LAT_LON_ERROR_MSG)
                throw new CustomError(constants.VALIDATION_ERROR, constants.START_LAT_LON_ERROR_MSG);
            }

            if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
                self.logger.error(constants.END_LAT_LON_ERROR_MSG)
                throw new CustomError(constants.VALIDATION_ERROR, constants.END_LAT_LON_ERROR_MSG);
            }

            if (typeof riderName !== 'string' || riderName.length < 1) {
                self.logger.error(constants.RIDER_NAME_EMPTY_ERROR_MSG)
                throw new CustomError(constants.VALIDATION_ERROR, constants.RIDER_NAME_EMPTY_ERROR_MSG);
            }

            if (typeof driverName !== 'string' || driverName.length < 1) {
                self.logger.error(constants.DRIVER_NAME_EMPTY_ERROR_MSG)
                throw new CustomError(constants.VALIDATION_ERROR, constants.DRIVER_NAME_EMPTY_ERROR_MSG);
            }

            if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
                self.logger.error(constants.DRIVER_VEHICLE_EMPTY_ERROR_MSG)
                throw new CustomError(constants.VALIDATION_ERROR, constants.DRIVER_VEHICLE_EMPTY_ERROR_MSG);
            }

            const createdRide = await self.rideService.create(requestData);

            return createdRide;
        } catch (err) {
            throw err;
        }
    }

    public async getRidesWithPagination(requestData: any): Promise<any> {
        let limit = _.get(requestData, 'limit', 10)
        let offset = _.get(requestData, 'offset', 0)
        let column = _.get(requestData, 'column', 'rideID')
        let sort = _.get(requestData, 'sort', 'DESC')

        const self = this;

        try {
            const count = await self.rideService.findAllCount();
            const rides = await self.rideService.findAllPagination(requestData);

            const results = {
                total: count,
                limit: limit,
                offset: offset,
                rows: rides
            }

            return results;
        } catch (err) {
            throw err;
        }
    }

    public async getRideDetails(id: Number): Promise<any> {
        const self = this;
        try {
            const ride = await self.rideService.findRideById(id);
            return ride;
        } catch (err) {
            throw err;
        }
    }
}

export default RideController;