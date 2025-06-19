import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import envConfig from './config/env.js';

const app = express();
const port = envConfig.port;

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
