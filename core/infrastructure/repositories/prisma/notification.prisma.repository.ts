/* eslint-disable @typescript-eslint/no-explicit-any */
import { Notification } from '@/core/domain/entities/notification.entity';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class PrismaNotificationRepository implements NotificationRepository {
  /**
   * Finds a notification by its ID.
   * @param id The notification ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @returns The notification or null if not found.
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
   * Retrieves a paginated list of notifications with optional filters.
   * @param params Filtering and pagination parameters.
   * @returns An object containing the list of notifications and the total count.
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    search?: string;
    searchBy?: string;
    startDate?: Date;
    endDate?: Date;
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
    const patientId = params?.patientId;
    const includeDeleted = params?.includeDeleted || false;

    const where: Prisma.NotificationWhereInput = {
      deletedAt: includeDeleted ? undefined : null,
      patientId: patientId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

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
   * @param data The notification data.
   * @returns The newly created notification.
   */
  async create(
    data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Notification> {
    const notification = await prisma.notification.create({
      data,
    });
    return notification as Notification;
  }

  /**
   * Updates an existing notification record.
   * @param id The notification ID.
   * @param data The partial data to update.
   * @returns The updated notification.
   */
  async update(
    id: string,
    data: Partial<Omit<Notification, 'id' | 'createdAt'>>
  ): Promise<Notification> {
    const notification = await prisma.notification.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return notification as Notification;
  }

  /**
   * Performs a soft delete on a notification.
   * @param id The notification ID.
   */
  async softDelete(id: string): Promise<void> {
    await prisma.notification.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Performs a soft delete on all notifications associated with a patient.
   * @param patientId The patient ID.
   */
  async softDeleteByPatientId(patientId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: { patientId, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Restores a soft-deleted notification.
   * @param id The notification ID.
   */
  /**
   * Restores a soft-deleted notification record.
   * @param id The notification ID.
   * @param updatedBy The ID of the user performing the restoration.
   */
  async restore(id: string, updatedBy: string): Promise<void> {
    await prisma.notification.update({
      where: { id },
      data: {
        deletedAt: null,
        updatedBy,
      },
    });
  }

  /**
   * Restores soft-deleted notifications for a specific patient, deleted after a certain date.
   * @param patientId The patient ID.
   * @param updatedBy The ID of the user performing the restoration.
   * @param since The date after which deletions should be restored (optional).
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
      },
    });
  }
}
