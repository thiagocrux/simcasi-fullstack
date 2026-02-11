/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observation } from '@/core/domain/entities/observation.entity';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import { Prisma } from '@prisma/client';
import { normalizeDateFilter } from '../../lib/date.utils';
import { prisma } from '../../lib/prisma';

export class PrismaObservationRepository implements ObservationRepository {
  /**
   * Finds an observation by its unique ID.
   *
   * @param id The observation ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found observation or null if not found.
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
   * Retrieves a paginated list of observations with optional filtering.
   *
   * @param params Filtering and pagination parameters.
   * @return An object containing the list of observations and the total count.
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
   *
   * @param data The observation data.
   * @return The newly created observation.
   */
  async create(
    data: Omit<Observation, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Observation> {
    const { patientId, createdBy, updatedBy, ...rest } = data;

    const observation = await prisma.observation.create({
      data: {
        ...rest,
        patient: { connect: { id: patientId } },
        creator: { connect: { id: createdBy } },
        updater: updatedBy ? { connect: { id: updatedBy } } : undefined,
      },
    });

    return observation as Observation;
  }

  /**
   * Updates an existing observation record.
   *
   * @param id The observation ID.
   * @param data The partial data to update.
   * @param updatedBy The user performing the update.
   * @return The updated observation.
   */
  async update(
    id: string,
    data: Partial<Omit<Observation, 'id' | 'createdAt'>>,
    updatedBy: string
  ): Promise<Observation> {
    const { patientId, ...updateData } = data as any;

    const observation = await prisma.observation.update({
      where: { id },
      data: {
        ...updateData,
        patient: patientId ? { connect: { id: patientId } } : undefined,
        updater: { connect: { id: updatedBy } },
        updatedAt: new Date(),
      },
    });
    return observation as Observation;
  }

  /**
   * Performs a soft delete on a single observation.
   *
   * @param id The observation ID.
   * @param updatedBy The user performing the deletion.
   * @return A promise that resolves when the operation is complete.
   */
  async softDelete(id: string, updatedBy: string): Promise<void> {
    await prisma.observation.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updater: { connect: { id: updatedBy } },
      },
    });
  }

  /**
   * Performs a soft delete on all observations of a patient.
   *
   * @param patientId The patient ID.
   * @param updatedBy The user performing the deletion.
   * @return A promise that resolves when the operation is complete.
   */
  async softDeleteByPatientId(
    patientId: string,
    updatedBy: string
  ): Promise<void> {
    await prisma.observation.updateMany({
      where: { patientId, deletedAt: null },
      data: {
        updatedBy,
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Restores a soft-deleted observation record.
   *
   * @param id The observation ID.
   * @param updatedBy The user performing the restoration.
   * @return A promise that resolves when the operation is complete.
   */
  async restore(id: string, updatedBy: string): Promise<void> {
    await prisma.observation.update({
      where: { id },
      data: {
        deletedAt: null,
        updater: { connect: { id: updatedBy } },
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Restores multiple soft-deleted observations for a patient.
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
    await prisma.observation.updateMany({
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
