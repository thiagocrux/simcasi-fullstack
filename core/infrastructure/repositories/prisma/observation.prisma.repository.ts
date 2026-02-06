/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observation } from '@/core/domain/entities/observation.entity';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import { Prisma } from '@prisma/client';
import { normalizeDateFilter } from '../../lib/date.utils';
import { prisma } from '../../lib/prisma';

export class PrismaObservationRepository implements ObservationRepository {
  /**
   * Finds an observation by its ID.
   * @param id The observation ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @returns The observation or null if not found.
   */
  async findById(
    id: string,
    includeDeleted = false
  ): Promise<Observation | null> {
    const observation = await prisma.observation.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });
    return (observation as Observation) || null;
  }

  /**
   * Retrieves a paginated list of observations with optional filters.
   * @param params Filtering and pagination parameters.
   * @returns An object containing the list of observations and the total count.
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
  }): Promise<{ items: Observation[]; total: number }> {
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

    const where: Prisma.ObservationWhereInput = {
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
        where[searchBy as keyof Prisma.ObservationWhereInput] = {
          contains: search,
          mode: 'insensitive',
        } as any;
      } else {
        // Default behavior: Generic OR search across common fields.
        where.observations = { contains: search, mode: 'insensitive' };
      }
    }

    const [items, total] = await Promise.all([
      prisma.observation.findMany({
        where,
        skip,
        take,
        orderBy: orderBy ? { [orderBy]: orderDir } : { updatedAt: 'desc' },
      }),
      prisma.observation.count({ where }),
    ]);

    return {
      items: items as Observation[],
      total,
    };
  }

  /**
   * Creates a new observation record.
   * @param data The observation data.
   * @returns The newly created observation.
   */
  async create(
    data: Omit<Observation, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Observation> {
    const observation = await prisma.observation.create({
      data,
    });
    return observation as Observation;
  }

  /**
   * Updates an existing observation record.
   * @param id The observation ID.
   * @param data The partial data to update.
   * @returns The updated observation.
   */
  async update(
    id: string,
    data: Partial<Omit<Observation, 'id' | 'createdAt'>>
  ): Promise<Observation> {
    const observation = await prisma.observation.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return observation as Observation;
  }

  /**
   * Performs a soft delete on an observation.
   * @param id The observation ID.
   */
  async softDelete(id: string): Promise<void> {
    await prisma.observation.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Performs a soft delete on all observations associated with a patient.
   * @param patientId The patient ID.
   */
  async softDeleteByPatientId(patientId: string): Promise<void> {
    await prisma.observation.updateMany({
      where: { patientId, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Restores a soft-deleted observation record.
   * @param id The observation ID.
   * @param updatedBy The ID of the user performing the restoration.
   */
  async restore(id: string, updatedBy: string): Promise<void> {
    await prisma.observation.update({
      where: { id },
      data: {
        deletedAt: null,
        updatedBy,
      },
    });
  }

  /**
   * Restores soft-deleted observations for a specific patient, deleted after a certain date.
   * @param patientId The patient ID.
   * @param updatedBy The ID of the user performing the restoration.
   * @param since The date after which deletions should be restored (optional).
   */
  async restoreByPatientId(
    patientId: string,
    updatedBy: string,
    since?: Date
  ): Promise<void> {
    await prisma.observation.updateMany({
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
