'use strict';

import sqlite3 from 'sqlite3';

export default (db: sqlite3.Database) => {
    const createRideTableSchema = `
        CREATE TABLE IF NOT EXISTS Rides
        (
            rideID INTEGER PRIMARY KEY AUTOINCREMENT,
            start_lat DECIMAL NOT NULL,
            start_long DECIMAL NOT NULL,
            end_lat DECIMAL NOT NULL,
            end_long DECIMAL NOT NULL,
            rider_name TEXT NOT NULL,
            driver_name TEXT NOT NULL,
            driver_vehicle TEXT NOT NULL,
            created DATETIME default CURRENT_TIMESTAMP
        )
    `;

    db.run(createRideTableSchema);

    return db;
};
