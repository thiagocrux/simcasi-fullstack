/* eslint-disable @typescript-eslint/no-explicit-any */
import { Notification } from '@/core/domain/entities/notification.entity';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import { Prisma } from '@prisma/client';
import { normalizeDateFilter } from '../../lib/date.utils';
import { prisma } from '../../lib/prisma';

export class PrismaNotificationRepository implements NotificationRepository {
  /**
   * Finds a notification by its unique ID.
   *
   * @param id The notification ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found notification or null if not found.
   */
  async findById(
    id: string,
    includeDeleted = false
  ): Promise<Notification | null> {
    const notification = await prisma.notification.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });
    return (notification as Notification) || null;
  }

  /**
   * Retrieves a paginated list of notifications with optional filtering.
   *
   * @param params Filtering and pagination parameters.
   * @return An object containing the list of notifications and the total count.
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
    patientId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Notification[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 20;
    const orderBy = params?.orderBy;
    const orderDir = params?.orderDir || 'asc';
    const search = params?.search;
    const searchBy = params?.searchBy;
    const startDate = params?.startDate;
    const endDate = params?.endDate;
    const timezoneOffset = params?.timezoneOffset;
    const patientId = params?.patientId;
    const includeDeleted = params?.includeDeleted || false;

    const where: Prisma.NotificationWhereInput = {
      deletedAt: includeDeleted ? undefined : null,
      patientId: patientId,
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
        // Field-specific search (case-insensitive for string fields).
        where[searchBy as keyof Prisma.NotificationWhereInput] = {
          contains: search,
          mode: 'insensitive',
        } as any;
      } else {
        // Default behavior: Generic OR search across common fields.
        where.OR = [
          { sinan: { contains: search, mode: 'insensitive' } },
          { observations: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take,
        orderBy: orderBy ? { [orderBy]: orderDir } : { updatedAt: 'desc' },
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      items: items as Notification[],
      total,
    };
  }

  /**
   * Creates a new notification record.
   *
   * @param data The notification data.
   * @return The newly created notification.
   */
  async create(
    data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Notification> {
    const { patientId, createdBy, updatedBy, ...rest } = data;

    const notification = await prisma.notification.create({
      data: {
        ...rest,
        patient: { connect: { id: patientId } },
        creator: { connect: { id: createdBy } },
        updater: updatedBy ? { connect: { id: updatedBy } } : undefined,
      },
    });

    return notification as Notification;
  }

  /**
   * Updates an existing notification record.
   *
   * @param id The notification ID.
   * @param data The partial data to update.
   * @param updatedBy The user performing the update.
   * @return The updated notification.
   */
  async update(
    id: string,
    data: Partial<Omit<Notification, 'id' | 'createdAt'>>,
    updatedBy: string
  ): Promise<Notification> {
    const { patientId, ...updateData } = data as any;

    const notification = await prisma.notification.update({
      where: { id },
      data: {
        ...updateData,
        patient: patientId ? { connect: { id: patientId } } : undefined,
        updater: { connect: { id: updatedBy } },
        updatedAt: new Date(),
      },
    });
    return notification as Notification;
  }

  /**
   * Performs a soft delete on a single notification.
   *
   * @param id The notification ID.
   * @param updatedBy The user performing the deletion.
   * @return A promise that resolves when the operation is complete.
   */
  async softDelete(id: string, updatedBy: string): Promise<void> {
    await prisma.notification.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updater: { connect: { id: updatedBy } },
      },
    });
  }

  /**
   * Performs a soft delete on all notifications of a patient.
   *
   * @param patientId The patient ID.
   * @param updatedBy The user performing the deletion.
   * @return A promise that resolves when the operation is complete.
   */
  async softDeleteByPatientId(
    patientId: string,
    updatedBy: string
  ): Promise<void> {
    await prisma.notification.updateMany({
      where: { patientId, deletedAt: null },
      data: {
        deletedAt: new Date(),
        updatedBy: updatedBy,
      },
    });
  }

  /**
   * Restores a soft-deleted notification record.
   *
   * @param id The notification ID.
   * @param updatedBy The user performing the restoration.
   * @return A promise that resolves when the operation is complete.
   */
  async restore(id: string, updatedBy: string): Promise<void> {
    await prisma.notification.update({
      where: { id },
      data: {
        deletedAt: null,
        updater: { connect: { id: updatedBy } },
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Restores multiple soft-deleted notifications for a patient.
   *
   * @param patientId The patient ID.
   * @param updatedBy The user performing the restoration.
   * @param since Optional date to restore deletions from.
   * @return A promise that resolves when the operation is complete.
   */
  async restoreByPatientId(
    patientId: string,
    updatedBy: string,
    since?: Date
  ): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        patientId,
        deletedAt: since ? { gte: since } : { not: null },
      },
      data: {
        deletedAt: null,
        updatedBy,
        updatedAt: new Date(),
      },
    });
  }
}
