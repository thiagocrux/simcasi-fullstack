import { PrismaClient } from '@/prisma/generated/client';

/**
 * Prisma client singleton to avoid multiple connections.
 * In development, it attaches the client to the global object to prevent
 * connection exhaustion during hot reloads (Fast Refresh).
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
