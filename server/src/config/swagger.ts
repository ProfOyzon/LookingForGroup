import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.1.1',
  info: {
    title: 'Looking For Group API',
    version: '1.0.0',
    description:
      'LFG API Documentation. This will showcase all the endpoints available and how to use them.',
  },
  basePath: '/api',
};

export const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ['../docs/**/*.yaml'],
});
