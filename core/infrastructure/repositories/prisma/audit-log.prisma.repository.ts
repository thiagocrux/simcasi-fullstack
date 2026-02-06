/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuditLog } from '@/core/domain/entities/audit-log.entity';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { Prisma } from '@prisma/client';
import { normalizeDateFilter } from '../../lib/date.utils';
import { prisma } from '../../lib/prisma';

export class PrismaAuditLogRepository implements AuditLogRepository {
  /**
   * Finds an audit log by its unique ID.
   * @param id The ID of the audit log to find.
   * @returns The audit log or null if not found.
   */
  async findById(id: string): Promise<AuditLog | null> {
    const log = await prisma.auditLog.findUnique({
      where: { id },
    });
    return (log as AuditLog) || null;
  }

  /**
   * Retrieves a paginated list of audit logs with optional filters.
   * @param params Filtering and pagination parameters.
   * @returns An object containing the list of audit logs and the total count.
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
    const search = params?.search;
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
      const allowedFields = ['action', 'entityName', 'ipAddress', 'userAgent'];
      if (searchBy && allowedFields.includes(searchBy)) {
        // Field-specific search (case-insensitive for string fields).
        const isInsensitive = ['action', 'entityName'].includes(searchBy);
        where[searchBy as keyof Prisma.AuditLogWhereInput] = {
          contains: search,
          ...(isInsensitive ? { mode: 'insensitive' } : {}),
        } as any;
      } else {
        // Default behavior: Generic OR search across common fields.
        where.OR = [
          { action: { contains: search, mode: 'insensitive' } },
          { entityName: { contains: search, mode: 'insensitive' } },
          { ipAddress: { contains: search } },
          { userAgent: { contains: search } },
        ];
      }
    }
    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take,
        // Uses 'createdAt' as the default ordering field because audit logs are immutable.
        // Ordering by 'updatedAt' or similar fields is not applicable for immutable records.
        orderBy: orderBy ? { [orderBy]: orderDir } : { createdAt: 'desc' },
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
   * @param data The audit log data to create.
   * @returns The newly created audit log.
   */
  async create(data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    const log = await prisma.auditLog.create({
      data: {
        ...data,
        oldValues: data.oldValues as any,
        newValues: data.newValues as any,
      },
    });
    return log as AuditLog;
  }
}
