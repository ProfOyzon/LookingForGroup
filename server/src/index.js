import express from 'express';
import morgan from 'morgan';
import envConfig from './config/env.js';
import usersRouter from './routes/users.js';
import projectsRouter from './routes/projects.js';
import datasetsRouter from './routes/datasets.js';

const app = express();
const port = envConfig.port;

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use(usersRouter);
app.use(projectsRouter);
app.use(datasetsRouter);

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
