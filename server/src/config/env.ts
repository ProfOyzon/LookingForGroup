/**
 * Gets the value of an environment variable.
 * @param {string} key Name of the environment variable to retrieve
 * @throws {Error} If the environment variable is not defined
 * @returns {string} Value of the environment variable
 */
const getEnvVariable = (key: string): string => {
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
const getNumEnvVariable = (key: string): number => {
  const value = getEnvVariable(key);
  const numValue = Number.parseInt(value, 10);

  if (Number.isNaN(numValue)) {
    throw new Error(`Environment variable ${key} is not a valid number!`);
  }

  return numValue;
};

const envConfig = Object.freeze({
  env: getEnvVariable('NODE_ENV') as 'production' | 'development' | 'test',
  databaseUrl: `mysql://${getEnvVariable('DB_USER')}:${getEnvVariable('DB_PASS')}@${getEnvVariable('DB_HOST')}:${getEnvVariable('DB_PORT')}/${getEnvVariable('DB_NAME')}`,
  port: getNumEnvVariable('PORT'),
});

export default envConfig;
