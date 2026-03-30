import { AuditLog } from '@/core/domain/entities/audit-log.entity';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import {
  buildDateRangeFilter,
  buildOrderByClause,
} from '../../lib/query.utils';

export class PrismaAuditLogRepository implements AuditLogRepository {
  /**
   * Finds an audit log by its unique ID.
   *
   * @param id The audit log ID to search for.
   * @return The found audit log or null if not found.
   */
  async findById(id: string): Promise<AuditLog | null> {
    const log = await prisma.auditLog.findUnique({
      where: { id },
    });
    return (log as AuditLog) || null;
  }

  /**
   * Retrieves a paginated list of audit logs with optional filters.
   *
   * @param params Filtering and pagination parameters.
   * @return An object containing the list of audit logs and the total count.
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    search?: string;
    searchBy?: string;
    userId?: string;
    action?: string;
    entityName?: string;
    entityId?: string;
    startDate?: string;
    endDate?: string;
    timezoneOffset?: string;
  }): Promise<{ items: AuditLog[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 20;
    const orderBy = params?.orderBy;
    const orderDir = params?.orderDir || 'asc';
    const search = params?.search?.trim();
    const searchBy = params?.searchBy;
    const startDate = params?.startDate;
    const endDate = params?.endDate;
    const timezoneOffset = params?.timezoneOffset;
    const userId = params?.userId;
    const action = params?.action;
    const entityName = params?.entityName;
    const entityId = params?.entityId;

    const where: Prisma.AuditLogWhereInput = {
      userId,
      action,
      entityName,
      entityId,
    };

    // Add date range filter only if dates are provided.
    const dateFilter = buildDateRangeFilter(startDate, endDate, timezoneOffset);
    if (dateFilter) {
      where.createdAt = dateFilter;
    }

    if (search) {
      const allowedFields = [
        'action',
        'entityName',
        'userId',
        'ipAddress',
        'userAgent',
      ];
      if (searchBy && allowedFields.includes(searchBy)) {
        if (searchBy === 'userId') {
          // Search by user name or email (UUID field doesn't support contains operator).
          where.OR = [
            { user: { name: { contains: search, mode: 'insensitive' } } },
            { user: { email: { contains: search, mode: 'insensitive' } } },
          ];
        } else {
          // Field-specific search (case-insensitive for tracked names and actions).
          const isInsensitive = [
            'action',
            'entityName',
            'ipAddress',
            'userAgent',
          ].includes(searchBy);
          where[searchBy as keyof Prisma.AuditLogWhereInput] = {
            contains: search,
            ...(isInsensitive ? { mode: 'insensitive' } : {}),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any;
        }
      } else {
        // Default behavior: Generic OR search across common string fields.
        where.OR = [
          { action: { contains: search, mode: 'insensitive' } },
          { entityName: { contains: search, mode: 'insensitive' } },
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { ipAddress: { contains: search, mode: 'insensitive' } },
          { userAgent: { contains: search, mode: 'insensitive' } },
        ];
      }
    }
    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: buildOrderByClause(orderBy, orderDir),
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      items: items as AuditLog[],
      total,
    };
  }

  /**
   * Creates a new audit log entry.
   *
   * @param data The audit log data to create.
   * @return The newly created audit log.
   */
  async create(data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    const log = await prisma.auditLog.create({
      data: {
        ...data,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        oldValues: data.oldValues as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newValues: data.newValues as any,
      },
    });
    return log as AuditLog;
  }
}
