import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJSDoc from 'swagger-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDefinition = {
  openapi: '3.1.1',
  info: {
    title: 'Looking For Group API',
    version: '1.0.0',
    description: `LFG API Documentation. This will showcase all the endpoints available and how to use them.

      Note: When accessed directly from the express app, the endpoints will have an additional "/api" prefix.
      Because of this, please use the vite proxy when reviewing the docs.`,
  },
};

const apiPath = path.join(__dirname, '../../docs/**/*.yaml');

export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: [apiPath],
});
