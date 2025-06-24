import { PrismaClient } from '../generated/prisma/index.js';
import envConfig from './env.ts';

// Create a reference to global that has type info for Prisma
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// If Prisma doesn't already exist, make a new instance
const prisma = globalForPrisma.prisma || new PrismaClient({ datasourceUrl: envConfig.databaseUrl });

export default prisma;

// If we aren't in prod, assign the Prisma instance to the global object
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
