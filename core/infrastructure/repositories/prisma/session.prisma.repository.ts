import { Session } from '@/core/domain/entities/session.entity';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class PrismaSessionRepository implements SessionRepository {
  /**
   * Finds a session by its unique ID.
   * @param id The session ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @returns The session or null if not found.
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
   * @param params Filtering and pagination parameters.
   * @returns An object containing the list of sessions and the total count.
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    userId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Session[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 20;
    const search = params?.search;
    const userId = params?.userId;
    const includeDeleted = params?.includeDeleted || false;

    const where: Prisma.SessionWhereInput = {
      deletedAt: includeDeleted ? undefined : null,
      userId: userId,
    };

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
        orderBy: { createdAt: 'desc' },
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
   * @param data The session data.
   * @returns The newly created session.
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
   * Updates an existing session (e.g., refreshing expiration).
   * @param id The session ID.
   * @param data The partial data to update.
   * @returns The updated session.
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
   * @param id The session ID.
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
   * @param userId The user ID.
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
   * Revokes all active sessions for an user EXCEPT for the specified one.
   * @param sessionId The session ID to keep active.
   * @param userId The user ID.
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
   * @returns The number of deleted sessions.
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
