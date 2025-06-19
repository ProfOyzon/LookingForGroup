import express from 'express';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import envConfig from './config/env.js';

const app = express();
const port = envConfig.port;

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Swagger JSDoc options
const options = {
  definition: {
    openapi: '3.1.1',
    info: {
      title: 'LFG API',
      version: '0.1.0',
      description: 'API for the RIT Looking for Group project.',
      license: {
        name: 'CC0-1.0',
        url: 'https://creativecommons.org/publicdomain/zero/1.0/',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/**/*.js'],
};

// Setup Swagger docs endpoint
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));

// @ts-ignore
app.get('/api', (req, res) => {
  return res.json({ message: 'You Reached The Looking For Group API' });
});

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
