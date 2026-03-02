import { PrismaClient } from '@prisma/client';
import { mockDeep, MockProxy } from 'jest-mock-extended';

export const prisma =
  mockDeep<PrismaClient>() as unknown as MockProxy<PrismaClient>;
