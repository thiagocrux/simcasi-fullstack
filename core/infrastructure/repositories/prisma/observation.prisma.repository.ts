import { Observation } from '@/core/domain/entities/observation.entity';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import { Prisma } from '@/prisma/generated/client';
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
    search?: string;
    patientId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Observation[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 20;
    const search = params?.search;
    const patientId = params?.patientId;
    const includeDeleted = params?.includeDeleted || false;

    const where: Prisma.ObservationWhereInput = {
      deletedAt: includeDeleted ? undefined : null,
      patientId: patientId,
    };

    if (search) {
      where.observations = { contains: search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      prisma.observation.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
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
   * Restores a soft-deleted observation.
   * @param id The observation ID.
   */
  async restore(id: string): Promise<void> {
    await prisma.observation.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }

  /**
   * Restores soft-deleted observations for a specific patient, deleted after a certain date.
   * @param patientId The patient ID.
   * @param since The date after which deletions should be restored.
   */
  async restoreByPatientId(patientId: string, since: Date): Promise<void> {
    await prisma.observation.updateMany({
      where: {
        patientId,
        deletedAt: { gte: since },
      },
      data: {
        deletedAt: null,
      },
    });
  }
}
