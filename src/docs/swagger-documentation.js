'use strict';

/**
* @swagger
* tags:
*   - name: Health
*     description: Application Health Check
*   - name: Rides
*     description: Rides Management API's
*/

/**
 * @swagger
 *   components:
 *     schemas:
 *       rideID:
 *         type: integer
 *         description: Ride unique id. Autoincrement value when you create a ride.
 *         example: 1
 *       start_lat:
 *         type: number
 *         format: double
 *         description: Starting latitude coordinate of a ride.
 *         example: 1.290270
 *       start_long:
 *         type: number
 *         format: double
 *         description: Starting longitude coordinate of a ride.
 *         example: 103.851959
 *       end_lat:
 *         type: number
 *         format: double
 *         description: Ending latitude coordinate of a ride.
 *         example: 1.290270
 *       end_long:
 *         type: number
 *         format: double
 *         description: Ending longitude coordinate of a ride.
 *         example: 103.851959
 *       rider_name:
 *         type: string
 *         description: Name of the rider.
 *         example: Jhon Doe
 *       driver_name:
 *         type: string
 *         description: Name of the driver.
 *         example: Aris Culala
 *       driver_vehicle:
 *         type: string
 *         description: Vehicle details.
 *         example: Honda CRV - SG1234567
 *       created:
 *         type: string
 *         format: date
 *         description: Date/Time a ride is created.
 *         example: 2021-11-03 14:32:00
 *       NewRide:
 *         description: Input object when creating a ride.
 *         type: object
 *         properties:
 *           start_lat:
 *             $ref: '#/components/schemas/start_lat'
 *           start_long:
 *             $ref: '#/components/schemas/start_long'
 *           end_lat:
 *             $ref: '#/components/schemas/end_lat'
 *           end_long:
 *             $ref: '#/components/schemas/end_long'
 *           rider_name:
 *             $ref: '#/components/schemas/rider_name'
 *           driver_name:
 *             $ref: '#/components/schemas/driver_name'
 *           driver_vehicle:
 *             $ref: '#/components/schemas/driver_vehicle'
 *       Ride:
 *         description: Represent a ride object complete details.
 *         type: object
 *         properties:
 *           rideID:
 *             $ref: '#/components/schemas/rideID'
 *           start_lat:
 *             $ref: '#/components/schemas/start_lat'
 *           start_long:
 *             $ref: '#/components/schemas/start_long'
 *           end_lat:
 *             $ref: '#/components/schemas/end_lat'
 *           end_long:
 *             $ref: '#/components/schemas/end_long'
 *           rider_name:
 *             $ref: '#/components/schemas/rider_name'
 *           driver_name:
 *             $ref: '#/components/schemas/driver_name'
 *           driver_vehicle:
 *             $ref: '#/components/schemas/driver_vehicle'
 *           created:
 *             $ref: '#/components/schemas/created'
 *       HealthCheckOk:
 *         description: Application is running.
 *         type: string
 *         example: Healthy
 *       GeneralError:
 *         description: General error response.
 *         type: object
 *         properties:
 *           error_code:
 *             type: string
 *             description: Type of error
 *             example: ERROR
 *           message:
 *             type: string
 *             description: Description of the error
 *             example: Error message description
 */

/**
 * @swagger
 *   /health:
 *     get:
 *       tags:
 *       - Health
 *       summary: "Application Health Check"
 *       responses:
 *         200:
 *           description: Application is running.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/HealthCheckOk'
 *         503:
 *           description: Service Unavailable
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GeneralError'
 */

/**
 * @swagger
 *   /rides:
 *     post:
 *       tags:
 *       - Rides
 *       summary: "New ride"
 *       description: "Create a new ride."
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewRide'
 *       responses:
 *         200:
 *           description: Ride is created.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Ride'
 *         500:
 *           description: Error encountered creating ride.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GeneralError'
 */

/**
 * @swagger
 *   /rides:
 *     get:
 *       tags:
 *       - Rides
 *       summary: "Get all rides"
 *       description: "A list of rides."
 *       responses:
 *         200:
 *           description: Rides were obtained.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Ride'
 *         500:
 *           description: Internal server error.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GeneralError'
 *         404:
 *           description: Unable to retrieve list of rides.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GeneralError'
 */

/**
 * @swagger
 *   /rides/{id}:
 *     get:
 *       tags:
 *       - Rides
 *       summary: "Retrieve ride"
 *       description: "Retrieve a single ride details."
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           description: Numeric ID of the ride to retrieve.
 *           schema:
 *             type: integer
 *       responses:
 *         200:
 *           description: A single ride.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Ride'
 *         500:
 *           description: Internal server error.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GeneralError'
 *         404:
 *           description: Unable to retrieve ride details.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GeneralError'
 */