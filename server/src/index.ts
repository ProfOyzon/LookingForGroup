import express, { type Request, type Response } from 'express';
import morgan from 'morgan';
import envConfig from '#config/env.ts';

const app = express();
const port = envConfig.port;

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (envConfig.env === 'development') {
  // Dynamic imports are used here because swagger packages are dev dependencies, which would cause crashes when imported in production.
  const swaggerSpec = (await import('./config/swagger.ts')).swaggerSpec;
  const swaggerUi = (await import('swagger-ui-express')).default;

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.get('', (_req: Request, res: Response) => {
  res.json({ message: 'You Reached The Looking For Group API' });
});

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});

export default app;
