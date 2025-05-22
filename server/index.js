import express from 'express';
import session from 'express-session';
import { join } from 'path';
import morgan from 'morgan';
import usersRouter from './routes/users.js';
import projectsRouter from './routes/projects.js';
import datasetsRouter from './routes/datasets.js';
import envConfig from './config/env.js';
import pool from './config/database.js';

const dirname = import.meta.dirname;
const app = express();
const port = envConfig.port;

// Serve frontend files and images
app.use(express.static(join(dirname, '../client/build')));
app.use('/images', express.static(join(dirname, './images')));

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup sessions
app.use(
  session({
    secret: envConfig.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 60 * 6 * 1000 },
  })
);

// Routes
app.use(usersRouter);
app.use(projectsRouter);
app.use(datasetsRouter);

// development purpose
import usersV2Router from './routes/usersV2.js';
app.use(usersV2Router);

app.get('/api', (req, res) => {
  return res.json({ message: 'You Reached The Looking For Group API' });
});

app.get('/*', (req, res) => {
  res.sendFile('index.html', { root: join(dirname, '../client/build/') });
});

// Clean up tokens once a day
setInterval(
  async () => {
    await pool.query('DELETE FROM signups WHERE created_at <= DATE_SUB(NOW(), INTERVAL 1 DAY)');
    await pool.query(
      'DELETE FROM password_resets WHERE created_at <= DATE_SUB(NOW(), INTERVAL 20 MINUTE)'
    );
    console.log('Tokens clean up');
  },
  24 * 60 * 60 * 1000
);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
