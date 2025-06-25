import envConfig from '#config/env.ts';
import { PrismaClient } from '#prisma-generated/index.js';

const prisma = new PrismaClient({ datasourceUrl: envConfig.databaseUrl });

export default prisma;
