import mysql from 'mysql2/promise';
import envConfig from './env.js';

/**
 * SQL connection pool
 */
const pool = mysql.createPool({
  host: envConfig.dbHost,
  user: envConfig.dbUser,
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
    // DB address could not be reached
    case 'ENOTFOUND':
      throw new Error(
        `There was an error connecting to the db host '${envConfig.dbHost}' - ${JSON.stringify(err)}`,
      );

    // DB address reached but no database was found
    case 'ECONNREFUSED':
      throw new Error(
        `A connection to a database at '${envConfig.dbHost}:3306' could not be made - ${JSON.stringify(err)}`,
      );

    // DB name not found in the database server
    case 'ER_BAD_DB_ERROR':
      throw new Error(
        `The database '${envConfig.dbName}' could not be found on the database server - ${JSON.stringify(err)}`,
      );

    // Wrong username or password
    case 'ER_ACCESS_DENIED_ERROR':
      throw new Error(
        `There was an error connecting to the database with the entered credentials - ${JSON.stringify(err)}`,
      );

    default:
      throw new Error(`Connection failed - ${JSON.stringify(err)}`);
  }
}
//#endregion

export default pool;
