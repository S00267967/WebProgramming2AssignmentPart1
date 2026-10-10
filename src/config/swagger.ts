import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Albums API',
            version: '1.0.0',
            description: 'REST API for managing albums'
        },
        servers: [
            {
                url: "/api/v1",
            },
        ],
    },
    apis: ['./src/controllers/*.ts','./src/routes/*.ts','./src/models/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);
