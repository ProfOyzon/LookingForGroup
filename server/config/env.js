import dotenv from "dotenv";
dotenv.config({ path: './.env' });

const envConfig = {
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    port: process.env.PORT
}

export default envConfig;