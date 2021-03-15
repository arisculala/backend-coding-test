'use strict';

// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Initialize app as an instance of express
const app = express();

// Initialize port number of the application
const port = 8010;

// Initialize json parser
const jsonParser = bodyParser.json();

// Initialize sqlite3 db
const db = new sqlite3.Database(':memory:');

// Initialize db schemas to be created
const buildSchemas = require('./src/schemas');

// Swagger documentation configuration
const swaggerDocumentation = require('./src/docs/swagger-documentation');
const swaggerDefinition = {
    openapi: '3.0.1',
    info: {
        title: 'Rides Management API',
        version: '0.0.1',
        description: 'The Rides Management API allows you to create rides, retrieve created rides or enter a specific ride id to get ride details.',
    },
    servers: [
        {
            url: `http://localhost:${port}`,
            description: 'Localhost Server'
        }
    ]
};
const swaggerJSDocOptions = {
    swaggerDefinition,
    swaggerDocumentation,
    // Paths to files containing OpenAPI(swagger) definitions - in this case it will be app.js to be specific
    apis: ['./src/docs/*.js', './src/*.js'],
};
const swaggerSpec = swaggerJSDoc(swaggerJSDocOptions);

db.serialize(() => {
    buildSchemas(db);

    const app = require('./src/app')(db);

    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.listen(port, () => console.log(`App started and listening on port ${port}`));
});