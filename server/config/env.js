import dotenv from 'dotenv';

//load .env file varibles
dotenv.config({ path: './.env' });

//object for environment varibles
const envConfig = {
  env: process.env.NODE_ENV,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
  mailerEmail: process.env.MAILER_EMAIL,
  mailerPass: process.env.MAILER_PASS,
  sessionSecret: process.env.SESSION_SECRET,
  port: process.env.PORT,
};

export default envConfig;
