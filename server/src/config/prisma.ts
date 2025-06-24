import { PrismaClient } from '../generated/prisma/index.js';
import envConfig from './env.ts';

const prisma = new PrismaClient({ datasourceUrl: envConfig.databaseUrl });

export default prisma;
