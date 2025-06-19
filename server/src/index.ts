import express, { type Request, type Response } from 'express';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import envConfig from './config/env.ts';

const app = express();
const port = envConfig.port;

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (envConfig.env === 'development') {
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

  const swaggerSpec = swaggerJSDoc({
    swaggerDefinition,
    apis: ['../docs/**/*.yaml'],
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.get('/api', (_req: Request, res: Response) => {
  res.json({ message: 'You Reached The Looking For Group API' });
});

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});

export default app;
