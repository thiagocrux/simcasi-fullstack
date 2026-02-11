import { Session } from '@/core/domain/entities/session.entity';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
import { Prisma } from '@prisma/client';
import { normalizeDateFilter } from '../../lib/date.utils';
import { prisma } from '../../lib/prisma';

export class PrismaSessionRepository implements SessionRepository {
  /**
   * Finds a session by its unique ID.
   *
   * @param id The session ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found session or null if not found.
   */
  async findById(id: string, includeDeleted = false): Promise<Session | null> {
    const session = await prisma.session.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });
    return (session as Session) || null;
  }

  /**
   * Retrieves a paginated list of sessions with optional filtering.
   *
   * @param params Filtering and pagination parameters.
   * @return An object containing the list of sessions and the total count.
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    search?: string;
    startDate?: string;
    endDate?: string;
    timezoneOffset?: string;
    userId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Session[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 20;
    const orderBy = params?.orderBy;
    const orderDir = params?.orderDir || 'asc';
    const search = params?.search;
    const startDate = params?.startDate;
    const endDate = params?.endDate;
    const timezoneOffset = params?.timezoneOffset;
    const userId = params?.userId;
    const includeDeleted = params?.includeDeleted || false;

    const where: Prisma.SessionWhereInput = {
      deletedAt: includeDeleted ? undefined : null,
      userId: userId,
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
      where.OR = [
        { ipAddress: { contains: search } },
        { userAgent: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.session.findMany({
        where,
        skip,
        take,
        orderBy: orderBy ? { [orderBy]: orderDir } : { updatedAt: 'desc' },
      }),
      prisma.session.count({ where }),
    ]);

    return {
      items: items as Session[],
      total,
    };
  }

  /**
   * Creates a new session record.
   *
   * @param data The session data.
   * @return The newly created session.
   */
  async create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Session> {
    const session = await prisma.session.create({
      data,
    });
    return session as Session;
  }

  /**
   * Updates an existing session (e.g., renewing expiration).
   *
   * @param id The session ID.
   * @param data The partial data to update.
   * @return The updated session.
   */
  async update(
    id: string,
    data: Partial<Omit<Session, 'id' | 'issuedAt' | 'createdAt'>>
  ): Promise<Session> {
    const session = await prisma.session.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return session as Session;
  }

  /**
   * Performs a soft delete on a session (logout).
   *
   * @param id The session ID.
   * @return A promise that resolves when the operation is complete.
   */
  async softDelete(id: string): Promise<void> {
    await prisma.session.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Revokes all active sessions for a specific user.
   *
   * @param userId The user ID.
   * @return A promise that resolves when the operation is complete.
   */
  async revokeAllByUserId(userId: string): Promise<void> {
    await prisma.session.updateMany({
      where: {
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Revokes all active sessions for a user EXCEPT the specified one.
   *
   * @param sessionId The session ID that should remain active.
   * @param userId The user ID.
   * @return A promise that resolves when the operation is complete.
   */
  async revokeOtherSessions(sessionId: string, userId: string): Promise<void> {
    await prisma.session.updateMany({
      where: {
        userId,
        id: { not: sessionId },
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Physically deletes expired sessions from the database.
   *
   * @return The number of deleted sessions.
   */
  async deleteExpired(): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    return result.count;
  }
}
