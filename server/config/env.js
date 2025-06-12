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

const envConfig = {
  env: getEnvVariable('NODE_ENV'),
  dbHost: getEnvVariable('DB_HOST'),
  dbUser: getEnvVariable('DB_USER'),
  dbPass: getEnvVariable('DB_PASS'),
  dbName: getEnvVariable('DB_NAME'),
  dbPort: getNumEnvVariable('DB_PORT'),
  mailerEmail: getEnvVariable('MAILER_EMAIL'),
  mailerPass: getEnvVariable('MAILER_PASS'),
  sessionSecret: getEnvVariable('SESSION_SECRET'),
  port: getNumEnvVariable('PORT'),
};

export default envConfig;
