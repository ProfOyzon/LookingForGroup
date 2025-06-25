import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  definition: swaggerDefinition,
  // apis: ['../../docs/**/*.yaml'],
  apis: [path.join(__dirname, '../docs/**/*.yaml')],
});

console.log('Swagger YAML path:', path.join(__dirname, '../../docs/**/*.yaml'));

//http://localhost:8081/api/docs/
