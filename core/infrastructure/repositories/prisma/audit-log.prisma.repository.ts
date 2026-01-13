import { AuditLog } from '@/core/domain/entities/audit-log.entity';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { Prisma } from '@/prisma/generated/client';
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
    search?: string;
    userId?: string;
    action?: string;
    entityName?: string;
    entityId?: string;
  }): Promise<{ items: AuditLog[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 20;
    const search = params?.search;
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

    if (search) {
      where.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { entityName: { contains: search, mode: 'insensitive' } },
        { ipAddress: { contains: search } },
        { userAgent: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
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
      data,
    });
    return log as AuditLog;
  }
}
