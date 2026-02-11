/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/core/domain/entities/user.entity';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import { Prisma } from '@prisma/client';
import { normalizeDateFilter } from '../../lib/date.utils';
import { prisma } from '../../lib/prisma';

export class PrismaUserRepository implements UserRepository {
  /**
   * Finds a user by its unique ID.
   *
   * @param id The user ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found user or null if not found.
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
   * Finds multiple users by their IDs.
   *
   * @param ids The list of user IDs.
   * @return A list of found users.
   */
  async findByIds(ids: string[]): Promise<User[]> {
    if (ids.length === 0) return [];

    const users = await prisma.user.findMany({
      where: {
        id: { in: ids },
      },
    });

    return users as User[];
  }

  /**
   * Finds a user by their unique email.
   *
   * @param email The user's email.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found user or null if not found.
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
   *
   * @param params Filtering and pagination parameters.
   * @return An object containing the list of users and the total count.
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    searchBy?: string;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
    timezoneOffset?: string;
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
    const timezoneOffset = params?.timezoneOffset;
    const roleId = params?.roleId;
    const includeDeleted = params?.includeDeleted || false;

    const where: Prisma.UserWhereInput = {
      deletedAt: includeDeleted ? undefined : null,
      roleId: roleId,
      isSystem: false,
    };

    // Add date range filter only if dates are provided
    const start = normalizeDateFilter(startDate, 'start', timezoneOffset);
    const end = normalizeDateFilter(endDate, 'end', timezoneOffset);

    if (start || end) {
      where.createdAt = {
        gte: start,
        lte: end,
      };
    }

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
   *
   * @param data The user data.
   * @return The newly created or restored user.
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
        const {
          roleId,
          createdBy: inputCreatedBy,
          updatedBy: inputUpdatedBy,
          ...updateData
        } = data as any;
        const finalCreatorId = (existing.createdBy as string) || inputCreatedBy;

        return (await prisma.user.update({
          where: { id: existing.id },
          data: {
            ...updateData,
            role: roleId ? { connect: { id: roleId } } : undefined,
            creator: finalCreatorId
              ? { connect: { id: finalCreatorId } }
              : undefined,
            updater: inputUpdatedBy
              ? { connect: { id: inputUpdatedBy } }
              : undefined,
            deletedAt: null,
            updatedAt: new Date(),
          },
        })) as User;
      }
    }

    const { roleId, createdBy, updatedBy, ...userData } = data;

    const user = await prisma.user.create({
      data: {
        ...userData,
        creator: createdBy ? { connect: { id: createdBy } } : undefined,
        updater: updatedBy ? { connect: { id: updatedBy } } : undefined,
        role: { connect: { id: roleId } },
      },
    });

    return user as User;
  }

  /**
   * Updates an existing user record.
   *
   * @param id The user ID.
   * @param data The partial data for the update.
   * @param updatedBy The user performing the update.
   * @return The updated user.
   */
  async update(
    id: string,
    data: Partial<Omit<User, 'id' | 'createdAt'>>,
    updatedBy: string
  ): Promise<User> {
    const { roleId, ...updateData } = data as any;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        role: roleId ? { connect: { id: roleId } } : undefined,
        updater: { connect: { id: updatedBy } },
        updatedAt: new Date(),
      },
    });

    return user as User;
  }

  /**
   * Updates the password of an existing user.
   *
   * @param id The user ID.
   * @param newPassword The new hashed password.
   * @param updatedBy The user performing the update.
   * @return The updated user with the new password.
   */
  async updatePassword(
    id: string,
    newPassword: string,
    updatedBy: string
  ): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
        updater: { connect: { id: updatedBy } },
        updatedAt: new Date(),
      },
    });

    return user as User;
  }

  /**
   * Performs a soft delete on a user.
   *
   * @param id The user ID.
   * @param updatedBy The user performing the deletion.
   * @return A promise that resolves when the operation is complete.
   */
  async softDelete(id: string, updatedBy: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updater: { connect: { id: updatedBy } },
      },
    });
  }

  /**
   * Restores a soft-deleted user.
   *
   * @param id The user ID.
   * @param updatedBy The ID of the user performing the restoration.
   * @return A promise that resolves when the operation is complete.
   */
  async restore(id: string, updatedBy: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: null,
        updater: { connect: { id: updatedBy } },
        updatedAt: new Date(),
      },
    });
  }
}
