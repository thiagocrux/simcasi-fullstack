/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from '@/core/domain/entities/role.entity';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import { Prisma } from '@prisma/client';
import { normalizeDateFilter } from '../../lib/date.utils';
import { prisma } from '../../lib/prisma';

export class PrismaRoleRepository implements RoleRepository {
  /**
   * Finds a role by its unique ID.
   *
   * @param id The role ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found role or null if not found.
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
   *
   * @param code The role code (e.g., 'ADMIN', 'DOCTOR').
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found role or null if not found.
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
   * Retrieves a paginated list of roles with optional filtering.
   *
   * @param params Filtering and pagination parameters.
   * @return An object containing the list of roles and the total count.
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
  }): Promise<{ items: Role[]; total: number }> {
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

    const where: Prisma.RoleWhereInput = {
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
        where[searchBy as keyof Prisma.RoleWhereInput] = {
          contains: search,
          mode: 'insensitive',
        } as any;
      } else {
        where.code = { contains: search, mode: 'insensitive' };
      }
    }

    const [items, total] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take,
        orderBy: orderBy ? { [orderBy]: orderDir } : { updatedAt: 'desc' },
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
   * This method performs a simple insertion and will fail if a role with the same code already exists.
   *
   * @param data The role data, including optional permission IDs.
   * @return The newly created role entity.
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
   *
   * @param id The role ID.
   * @param data The partial data to update.
   * @param updatedBy The user performing the update.
   * @return The updated role.
   */
  async update(
    id: string,
    data: Partial<Omit<Role, 'id' | 'createdAt'>> & {
      permissionIds?: string[];
    },
    updatedBy: string
  ): Promise<Role> {
    const { permissionIds, ...roleData } = data as any;
    const role = await prisma.role.update({
      where: { id },
      data: {
        ...roleData,
        updatedAt: new Date(),
        updater: { connect: { id: updatedBy } },
        /**
         * Sincroniza relacionamentos muitos-para-muitos usando gravações aninhadas do Prisma.
         * O uso de deleteMany + create garante que as associações correspondam exatamente ao array fornecido.
         */
        permission: permissionIds
          ? {
              deleteMany: {},
              create: permissionIds.map((id: string) => ({ permissionId: id })),
            }
          : undefined,
      },
    });
    return role as Role;
  }

  /**
   * Performs a soft delete on a role.
   *
   * @param id The role ID.
   * @param updatedBy The user performing the deletion.
   * @return A promise that resolves when the operation is complete.
   */
  async softDelete(id: string, updatedBy: string): Promise<void> {
    await prisma.role.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updater: { connect: { id: updatedBy } },
      },
    });
  }

  /**
   * Restores a soft-deleted role record.
   *
   * @param id The role ID.
   * @param updatedBy The ID of the user performing the restoration.
   * @return A promise that resolves when the operation is complete.
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
   * Checks if a role has at least one of the requested permissions.
   *
   * @param roleId The role ID.
   * @param codes Array of permission codes.
   * @return True if the role has any of the requested permissions.
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
