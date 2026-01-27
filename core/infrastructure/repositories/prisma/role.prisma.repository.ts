import { Role } from '@/core/domain/entities/role.entity';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import { Prisma } from '@prisma/client';
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
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    search?: string;
    startDate?: Date;
    endDate?: Date;
    includeDeleted?: boolean;
  }): Promise<{ items: Role[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 20;
    const orderBy = params?.orderBy;
    const orderDir = params?.orderDir || 'asc';
    const search = params?.search;
    const includeDeleted = params?.includeDeleted || false;
    const startDate = params?.startDate;
    const endDate = params?.endDate;

    const where: Prisma.RoleWhereInput = {
      deletedAt: includeDeleted ? undefined : null,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (search) {
      where.code = { contains: search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take,
        orderBy: orderBy ? { [orderBy]: orderDir } : { code: 'asc' },
      }),
      prisma.role.count({ where }),
    ]);

    return {
      items: items as Role[],
      total,
    };
  }

  /**
   * Creates a new role record in the database.
   * This method performs a simple insert and will fail if a role with the same code already exists.
   * @param data The role data including optional permission IDs.
   * @returns The newly created role entity.
   */
  async create(
    data: Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
      permissionIds?: string[];
    }
  ): Promise<Role> {
    const { permissionIds, ...roleData } = data;

    const role = await prisma.role.create({
      data: {
        ...roleData,
        permission: permissionIds
          ? {
              create: permissionIds.map((id) => ({ permissionId: id })),
            }
          : undefined,
      },
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
    data: Partial<Omit<Role, 'id' | 'createdAt'>> & {
      permissionIds?: string[];
    }
  ): Promise<Role> {
    const { permissionIds, ...roleData } = data;
    const role = await prisma.role.update({
      where: { id },
      data: {
        ...roleData,
        updatedAt: new Date(),
        /**
         * Synchronize many-to-many relationships using Prisma's nested writes.
         * Using deleteMany + create ensures the associations match the provided array exactly.
         */
        permission: permissionIds
          ? {
              deleteMany: {},
              create: permissionIds.map((id) => ({ permissionId: id })),
            }
          : undefined,
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
   * Restores a soft-deleted role record.
   * @param id The role ID.
   * @param updatedBy The ID of the user performing the restoration.
   */
  async restore(id: string, updatedBy: string): Promise<void> {
    await prisma.role.update({
      where: { id },
      data: {
        deletedAt: null,
        updatedBy,
      },
    });
  }

  /**
   * Checks if a role has at least one of the required permissions.
   * @param roleId The role ID.
   * @param codes Array of permission codes.
   * @returns True if the role has any of the requested permissions.
   */
  async hasPermissions(roleId: string, codes: string[]): Promise<boolean> {
    if (codes.length === 0) return true;

    const count = await prisma.rolePermission.count({
      where: {
        roleId,
        permission: {
          code: { in: codes },
          deletedAt: null,
        },
        role: {
          deletedAt: null,
        },
      },
    });

    return count > 0;
  }
}
