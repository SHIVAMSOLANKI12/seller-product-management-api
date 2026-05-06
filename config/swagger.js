import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express Backend API',
            version: '1.0.0',
            description: 'Professional API documentation for the Node.js Express & MongoDB Backend',
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string', enum: ['user', 'seller', 'admin'] },
                    },
                },
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        productName: { type: 'string' },
                        productDescription: { type: 'string' },
                        brands: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Brand',
                            },
                        },
                    },
                },
                Brand: {
                    type: 'object',
                    properties: {
                        brandName: { type: 'string' },
                        detail: { type: 'string' },
                        price: { type: 'number' },
                        image: { type: 'string' },
                    },
                },
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: { type: 'object' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        errors: { type: 'array', items: { type: 'object' } },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
export default specs;
