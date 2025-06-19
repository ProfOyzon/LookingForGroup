import express, { type Request, type Response } from 'express';
import morgan from 'morgan';
import envConfig from './config/env.ts';

const app = express();
const port = envConfig.port;

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
