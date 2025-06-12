import dotenv from 'dotenv';

//load .env file varibles
dotenv.config({ path: './.env' });

/**
 * Gets the value of an environment variable.
 * @param {string} key Name of the environment variable to retrieve
 * @throws {Error} If the environment variable is not defined
 * @returns {string} Value of the environment variable
 */
const getEnvVariable = (key) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable ${key} is not defined!`);
  }

  return value;
};

/**
 * Gets the value of an environment variable and converts it to a number.
 * @param {string} key Name of the environment variable to retrieve
 * @throws {Error} If the environment variable is not defined or is not a valid number
 * @returns {number} Value of the environment variable as a number
 */
const getNumEnvVariable = (key) => {
  const value = getEnvVariable(key);
  const numValue = Number.parseInt(value, 10);

  if (Number.isNaN(numValue)) {
    throw new Error(`Environment variable ${key} is not a valid number!`);
  }

  return numValue;
};

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
