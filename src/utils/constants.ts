'use strict'

const constants = {
  HTTP_ERROR_CODE_500: 500,
  HTTP_ERROR_CODE_404: 404,
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'Unknown error',
  START_LAT_LON_ERROR_MSG: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
  END_LAT_LON_ERROR_MSG: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
  RIDER_NAME_EMPTY_ERROR_MSG: 'Rider name must be a non empty string',
  DRIVER_NAME_EMPTY_ERROR_MSG: 'Driver name must be a non empty string',
  DRIVER_VEHICLE_EMPTY_ERROR_MSG: 'Driver vehicle must be a non empty string',
  RIDES_NOT_FOUND_ERROR: 'RIDES_NOT_FOUND_ERROR',
  RIDE_NOT_FOUND_ERROR: 'RIDE_NOT_FOUND_ERROR',
  RIDE_ID_NOT_FOUND_ERROR: 'Could not find any rides with the specified id',
  COULD_NOT_FIND_ANY_RIDES: 'Could not find any rides',
  INVALID_COLUMN_PARAMETER: 'Invalid column parameter',
  INVALID_SORT_PARAMETER: 'Invalid sort parameter'
}

export default Object.freeze(constants)
