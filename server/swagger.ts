require('dotenv').config();
import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Todo App API',
        description: 'Implementation of Todo App API',
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT}`,
            description: '',
        },
    ],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./server.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
