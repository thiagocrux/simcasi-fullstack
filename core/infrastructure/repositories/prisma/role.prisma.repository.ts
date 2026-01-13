import { Role } from '@/core/domain/entities/role.entity';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import { Prisma } from '@/prisma/generated/client';
import { prisma } from '../../lib/prisma';

export class PrismaRoleRepository implements RoleRepository {
  /**
   * Finds a role by its unique ID.
   * @param id The role ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @returns The role or null if not found.
   */
  async findById(id: string, includeDeleted = false): Promise<Role | null> {
    const role = await prisma.role.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });
    return (role as Role) || null;
  }

  /**
   * Finds a role by its unique code.
   * @param code The role code (e.g., 'ADMIN', 'DOCTOR').
   * @param includeDeleted Whether to include soft-deleted records.
   * @returns The role or null if not found.
   */
  async findByCode(code: string, includeDeleted = false): Promise<Role | null> {
    const role = await prisma.role.findFirst({
      where: {
        code,
        deletedAt: includeDeleted ? undefined : null,
      },
    });
    return (role as Role) || null;
  }

  /**
   * Retrieves a paginated list of roles with optional search filtering.
   * @param params Filtering and pagination parameters.
   * @returns An object containing the list of roles and the total count.
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Role[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 20;
    const search = params?.search;
    const includeDeleted = params?.includeDeleted || false;

    const where: Prisma.RoleWhereInput = {
      deletedAt: includeDeleted ? undefined : null,
    };

    if (search) {
      where.code = { contains: search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take,
        orderBy: { code: 'asc' },
      }),
      prisma.role.count({ where }),
    ]);

    return {
      items: items as Role[],
      total,
    };
  }

  /**
   * Creates a new role or restores a soft-deleted one with the same code.
   * @param data The role data.
   * @returns The newly created or restored role.
   */
  async create(
    data: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Role> {
    const existing = await prisma.role.findFirst({
      where: { code: data.code },
    });

    if (existing && existing.deletedAt) {
      return (await prisma.role.update({
        where: { id: existing.id },
        data: {
          ...data,
          deletedAt: null,
          updatedAt: new Date(),
        },
      })) as Role;
    }

    const role = await prisma.role.create({
      data,
    });

    return role as Role;
  }

  /**
   * Updates an existing role record.
   * @param id The role ID.
   * @param data The partial data to update.
   * @returns The updated role.
   */
  async update(
    id: string,
    data: Partial<Omit<Role, 'id' | 'createdAt'>>
  ): Promise<Role> {
    const role = await prisma.role.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return role as Role;
  }

  /**
   * Performs a soft delete on a role.
   * @param id The role ID.
   */
  async softDelete(id: string): Promise<void> {
    await prisma.role.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Restores a soft-deleted role.
   * @param id The role ID.
   */
  async restore(id: string): Promise<void> {
    await prisma.role.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}
