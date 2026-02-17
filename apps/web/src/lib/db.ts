import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PrismaClient } = require('../generated/prisma');

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: typeof PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
