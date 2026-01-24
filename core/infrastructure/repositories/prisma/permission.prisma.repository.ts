import { Permission } from '@/core/domain/entities/permission.entity';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class PrismaPermissionRepository implements PermissionRepository {
  /**
   * Finds a permission by its unique ID.
   * @param id The permission ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @returns The permission or null if not found.
   */
  async findById(
    id: string,
    includeDeleted = false
  ): Promise<Permission | null> {
    const permission = await prisma.permission.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });
    return (permission as Permission) || null;
  }

  /**
   * Finds multiple permissions by their IDs.
   * @param ids The list of permission IDs.
   * @returns A list of found permissions.
   */
  async findByIds(ids: string[]): Promise<Permission[]> {
    const permissions = await prisma.permission.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
    });
    return permissions as Permission[];
  }

  /**
   * Finds a permission by its unique code.
   * @param code The permission code (e.g., 'USER_CREATE').
   * @param includeDeleted Whether to include soft-deleted records.
   * @returns The permission or null if not found.
   */
  async findByCode(
    code: string,
    includeDeleted = false
  ): Promise<Permission | null> {
    const permission = await prisma.permission.findFirst({
      where: {
        code,
        deletedAt: includeDeleted ? undefined : null,
      },
    });
    return (permission as Permission) || null;
  }

  /**
   * Finds all permissions assigned to a specific role.
   * @param roleId The role ID.
   * @returns A list of permissions.
   */
  async findByRoleId(roleId: string): Promise<Permission[]> {
    const permissions = await prisma.permission.findMany({
      where: {
        roles: {
          some: {
            roleId,
          },
        },
        deletedAt: null,
      },
      orderBy: { code: 'asc' },
    });

    return permissions as Permission[];
  }

  /**
   * Retrieves a paginated list of permissions.
   * @param params Filtering and pagination parameters.
   * @returns An object containing the list of permissions and the total count.
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Permission[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 20;
    const search = params?.search;
    const includeDeleted = params?.includeDeleted || false;

    const where: Prisma.PermissionWhereInput = {
      deletedAt: includeDeleted ? undefined : null,
    };

    if (search) {
      where.code = { contains: search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      prisma.permission.findMany({
        where,
        skip,
        take,
        orderBy: { code: 'asc' },
      }),
      prisma.permission.count({ where }),
    ]);

    return {
      items: items as Permission[],
      total,
    };
  }

  /**
   * Creates a new permission record in the database.
   * This is a simple insert operation; it does not handle restoration of deleted records.
   * @param data The permission data including optional role IDs.
   * @returns The newly created permission entity.
   */
  async create(
    data: Omit<Permission, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
      roleIds?: string[];
    }
  ): Promise<Permission> {
    const { roleIds, ...permissionData } = data;

    const permission = await prisma.permission.create({
      data: {
        ...permissionData,
        roles: roleIds
          ? {
              create: roleIds.map((id) => ({ roleId: id })),
            }
          : undefined,
      },
    });

    return permission as Permission;
  }

  /**
   * Updates an existing permission record.
   * @param id The permission ID.
   * @param data The partial data to update.
   * @returns The updated permission.
   */
  async update(
    id: string,
    data: Partial<Omit<Permission, 'id' | 'createdAt'>> & {
      roleIds?: string[];
    }
  ): Promise<Permission> {
    const { roleIds, ...permissionData } = data;
    const permission = await prisma.permission.update({
      where: { id },
      data: {
        ...permissionData,
        updatedAt: new Date(),
        /**
         * Synchronize many-to-many relationships using Prisma's nested writes.
         * Using deleteMany + create ensures the associations match the provided array exactly.
         */
        roles: roleIds
          ? {
              deleteMany: {},
              create: roleIds.map((rid) => ({ roleId: rid })),
            }
          : undefined,
      },
    });
    return permission as Permission;
  }

  /**
   * Performs a soft delete on a permission.
   * @param id The permission ID.
   */
  async softDelete(id: string): Promise<void> {
    await prisma.permission.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Restores a soft-deleted permission.
   * @param id The permission ID.
   */
  async restore(id: string): Promise<void> {
    await prisma.permission.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}
