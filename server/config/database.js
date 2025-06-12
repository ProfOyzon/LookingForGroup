import mysql from 'mysql2/promise';
import envConfig from './env.js';

/**
 * SQL connection pool
 */
const pool = mysql.createPool({
  host: envConfig.dbHost,
  user: envConfig.dbUser,
  port: envConfig.dbPort,
  password: envConfig.dbPass,
  database: envConfig.dbName,
  connectionLimit: 10,
});

//#region Ensure pool has connected, crash if we cant
try {
  // Make test connection to db
  const testConnection = await pool.getConnection();

  // Release connection if no error is raised
  testConnection.release();
} catch (err) {
  // @ts-ignore
  switch (err.code) {
    // DB host error
    case 'ENOTFOUND':
      console.error(`There was an error connecting to the db host ${envConfig.dbHost} - ${err}`);
      break;

    // DB name not found
    case 'ER_BAD_DB_ERROR':
      console.error(`There was an error connecting to the database ${envConfig.dbName} - ${err}`);
      break;

    // Wrong username or password
    case 'ER_ACCESS_DENIED_ERROR':
      console.error(
        `There was an error connecting to the database with the entered credentials - ${err}`,
      );
      break;

    default:
      console.error(`Connection failed - ${err}`);
      break;
  }

  process.exit(1);
}
//#endregion

export default pool;
