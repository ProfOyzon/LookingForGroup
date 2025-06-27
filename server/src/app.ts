import express, { type Request, type Response } from 'express';
import morgan from 'morgan';
import envConfig from '#config/env.ts';
import datasetsRouter from '#routes/datasets.ts';

const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (envConfig.env === 'development') {
  // Dynamic imports are used here because swagger packages are dev dependencies, which would cause crashes when imported in production.
  const swaggerUi = (await import('swagger-ui-express')).default;
  const swaggerSpec = (await import('#config/swagger.ts')).swaggerSpec;

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use('/datasets', datasetsRouter);

app.get('', (_req: Request, res: Response) => {
  res.json({ message: 'You Reached The Looking For Group API' });
});

export default app;
