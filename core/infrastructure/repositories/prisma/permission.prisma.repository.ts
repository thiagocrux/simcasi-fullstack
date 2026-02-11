/* eslint-disable @typescript-eslint/no-explicit-any */
import { Permission } from '@/core/domain/entities/permission.entity';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import { Prisma } from '@prisma/client';
import { normalizeDateFilter } from '../../lib/date.utils';
import { prisma } from '../../lib/prisma';

export class PrismaPermissionRepository implements PermissionRepository {
  /**
   * Finds a permission by its unique ID.
   *
   * @param id The permission ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found permission or null if not found.
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
   *
   * @param ids The list of permission IDs.
   * @return A list of found permissions.
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
   *
   * @param code The permission code (e.g., 'USER_CREATE').
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found permission or null if not found.
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
   *
   * @param roleId The role ID.
   * @return A list of permissions for the role.
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
   *
   * @param params Filtering and pagination parameters.
   * @return An object containing the list of permissions and the total count.
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    search?: string;
    searchBy?: string;
    startDate?: string;
    endDate?: string;
    timezoneOffset?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Permission[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 20;
    const orderBy = params?.orderBy;
    const orderDir = params?.orderDir || 'asc';
    const search = params?.search;
    const searchBy = params?.searchBy;
    const startDate = params?.startDate;
    const endDate = params?.endDate;
    const timezoneOffset = params?.timezoneOffset;
    const includeDeleted = params?.includeDeleted || false;

    const where: Prisma.PermissionWhereInput = {
      deletedAt: includeDeleted ? undefined : null,
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
        where[searchBy as keyof Prisma.PermissionWhereInput] = {
          contains: search,
          mode: 'insensitive',
        } as any;
      } else {
        where.code = { contains: search, mode: 'insensitive' };
      }
    }

    const [items, total] = await Promise.all([
      prisma.permission.findMany({
        where,
        skip,
        take,
        orderBy: orderBy ? { [orderBy]: orderDir } : { updatedAt: 'desc' },
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
   *
   * @param data The permission data, including optional role IDs.
   * @return The newly created permission entity.
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
   *
   * @param id The permission ID.
   * @param data The partial data for the update.
   * @param updatedBy The user who performed the update.
   * @return The updated permission.
   */
  async update(
    id: string,
    data: Partial<Omit<Permission, 'id' | 'createdAt'>> & {
      roleIds?: string[];
    },
    updatedBy: string
  ): Promise<Permission> {
    const { roleIds, ...permissionData } = data as any;
    const permission = await prisma.permission.update({
      where: { id },
      data: {
        ...permissionData,
        updatedAt: new Date(),
        updater: { connect: { id: updatedBy } },
        /**
         * Sincroniza relacionamentos muitos-para-muitos usando gravações aninhadas do Prisma.
         * O uso de deleteMany + create garante que as associações correspondam exatamente ao array fornecido.
         */
        roles: roleIds
          ? {
              deleteMany: {},
              create: roleIds.map((rid: string) => ({ roleId: rid })),
            }
          : undefined,
      },
    });
    return permission as Permission;
  }

  /**
   * Performs a soft delete on a permission.
   *
   * @param id The permission ID.
   * @param updatedBy The user performing the deletion.
   * @return A promise that resolves when the operation is complete.
   */
  async softDelete(id: string, updatedBy: string): Promise<void> {
    await prisma.permission.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updater: { connect: { id: updatedBy } },
      },
    });
  }

  /**
   * Restores a soft-deleted permission record.
   *
   * @param id The permission ID.
   * @param updatedBy The ID of the user performing the restoration.
   * @return A promise that resolves when the operation is complete.
   */
  async restore(id: string, updatedBy: string): Promise<void> {
    await prisma.permission.update({
      where: { id },
      data: {
        deletedAt: null,
        updatedBy,
      },
    });
  }
}
