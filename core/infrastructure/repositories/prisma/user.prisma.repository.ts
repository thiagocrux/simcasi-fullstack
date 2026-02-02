/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/core/domain/entities/user.entity';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class PrismaUserRepository implements UserRepository {
  /**
   * Finds an user by their unique ID.
   * @param id The user ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @returns The user or null if not found.
   */
  async findById(id: string, includeDeleted = false): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return (user as User) || null;
  }

  /**
   * Finds an user by their unique email.
   * @param email The user email.
   * @param includeDeleted Whether to include soft-deleted records.
   * @returns The user or null if not found.
   */
  async findByEmail(
    email: string,
    includeDeleted = false
  ): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        email,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return (user as User) || null;
  }

  /**
   * Retrieves a paginated list of users with optional filtering.
   * @param params Filtering and pagination parameters.
   * @returns An object containing the list of users and the total count.
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    searchBy?: string;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    startDate?: Date;
    endDate?: Date;
    roleId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: User[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 20;
    const orderBy = params?.orderBy;
    const orderDir = params?.orderDir || 'asc';
    const search = params?.search;
    const searchBy = params?.searchBy;
    const startDate = params?.startDate;
    const endDate = params?.endDate;
    const roleId = params?.roleId;
    const includeDeleted = params?.includeDeleted || false;

    const where: Prisma.UserWhereInput = {
      deletedAt: includeDeleted ? undefined : null,
      roleId: roleId,
      isSystem: false,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (search) {
      if (searchBy) {
        // If a specific column is selected, we only filter by it.
        where[searchBy as keyof Prisma.UserWhereInput] = {
          contains: search,
          mode: 'insensitive',
        } as any;
      } else {
        // Default behavior: Generic OR search across common fields.
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: orderBy ? { [orderBy]: orderDir } : { updatedAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      items: items as User[],
      total,
    };
  }

  /**
   * Creates a new user or restores a soft-deleted one with the same email.
   * @param data The user data.
   * @returns The newly created or restored user.
   */
  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
      password: string;
    }
  ): Promise<User> {
    const existing = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (existing) {
      if (existing.deletedAt) {
        return (await prisma.user.update({
          where: { id: existing.id },
          data: {
            ...data,
            createdBy: (existing.createdBy as string) || data.createdBy,
            deletedAt: null,
            updatedAt: new Date(),
          },
        })) as User;
      }
    }

    const user = await prisma.user.create({
      data,
    });

    return user as User;
  }

  /**
   * Updates an existing user record.
   * @param id The user ID.
   * @param data The partial data to update.
   * @returns The updated user.
   */
  async update(
    id: string,
    data: Partial<Omit<User, 'id' | 'createdAt'>>
  ): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return user as User;
  }

  /**
   * Performs a soft delete on an user.
   * @param id The user ID.
   */
  async softDelete(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Restores a soft-deleted user.
   * @param id The user ID.
   */
  async restore(id: string, updatedBy: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: null,
        updatedBy,
      },
    });
  }
}
