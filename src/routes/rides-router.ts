import { NextFunction, Request, Response, Router } from 'express';
import sqlite3 from 'sqlite3';
import constants from '../utils/constants';
import { Logger } from 'winston';
import RidesController from '../controllers/rides-controller';
import RidesService from '../services/rides-service';

const router = Router();

export default (logger: Logger, db: sqlite3.Database): Router => {
    const rideService = new RidesService(logger, db);
    const rideController = new RidesController(logger, rideService);

    router.post('/rides', async (req: Request, res: Response) => {
        try {
            const createdRide = await rideController.createRide(req.body);
            return res.status(200).send(createdRide);
        } catch (err) {
            return res.status(constants.HTTP_ERROR_CODE_500).send({
                error_code: err.error_code,
                message: err.message
            });
        }
    });

    router.get('/rides', async (req: Request, res: Response) => {
        try {
            const ridesWithPagination = await rideController.getRidesWithPagination(req.query);
            return res.status(200).send(ridesWithPagination);
        } catch (err) {
            return res.status(constants.HTTP_ERROR_CODE_500).send({
                error_code: err.error_code,
                message: err.message
            });
        }
    });

    router.get('/rides/:id', async (req: Request, res: Response) => {
        try {
            const ride = await rideController.getRideDetails(Number(req.params.id));
            return res.status(200).send(ride);
        } catch (err) {
            return res.status(constants.HTTP_ERROR_CODE_500).send({
                error_code: err.error_code,
                message: err.message
            });
        }
    });

    return router;
};