import mariadb from "mariadb";
import envConfig from "./env.js";

let pool;
// Create a pool connection with MariaDB database
try {
    pool = mariadb.createPool({
        host: envConfig.dbHost, 
        user:envConfig.dbUser, 
        password: envConfig.dbPass,
        database: envConfig.dbName,
        connectionLimit: 10
    });
} catch (err) {
    console.log(err);
}

export default pool;