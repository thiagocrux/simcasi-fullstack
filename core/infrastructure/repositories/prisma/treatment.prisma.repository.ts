import { Treatment } from '@/core/domain/entities/treatment.entity';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import { Prisma } from '@/prisma/generated/client';
import { prisma } from '../../lib/prisma';

export class PrismaTreatmentRepository implements TreatmentRepository {
  /**
   * Finds a treatment record by its unique ID.
   * @param id The treatment ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @returns The treatment or null if not found.
   */
  async findById(
    id: string,
    includeDeleted = false
  ): Promise<Treatment | null> {
    const treatment = await prisma.treatment.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });
    return (treatment as Treatment) || null;
  }

  /**
   * Retrieves a paginated list of treatments with optional filtering.
   * @param params Filtering and pagination parameters.
   * @returns An object containing the list of treatments and the total count.
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    patientId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Treatment[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 20;
    const search = params?.search;
    const patientId = params?.patientId;
    const includeDeleted = params?.includeDeleted || false;

    const where: Prisma.TreatmentWhereInput = {
      deletedAt: includeDeleted ? undefined : null,
      patientId: patientId,
    };

    if (search) {
      where.OR = [
        { medication: { contains: search, mode: 'insensitive' } },
        { dosage: { contains: search, mode: 'insensitive' } },
        { healthCenter: { contains: search, mode: 'insensitive' } },
        { observations: { contains: search, mode: 'insensitive' } },
        { partnerInformation: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.treatment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.treatment.count({ where }),
    ]);

    return {
      items: items as Treatment[],
      total,
    };
  }

  /**
   * Creates a new treatment record.
   * @param data The treatment data.
   * @returns The newly created treatment.
   */
  async create(
    data: Omit<Treatment, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Treatment> {
    const treatment = await prisma.treatment.create({
      data,
    });
    return treatment as Treatment;
  }

  /**
   * Updates an existing treatment record.
   * @param id The treatment ID.
   * @param data The partial data to update.
   * @returns The updated treatment.
   */
  async update(
    id: string,
    data: Partial<Omit<Treatment, 'id' | 'createdAt'>>
  ): Promise<Treatment> {
    const treatment = await prisma.treatment.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return treatment as Treatment;
  }

  /**
   * Performs a soft delete on a treatment.
   * @param id The treatment ID.
   */
  async softDelete(id: string): Promise<void> {
    await prisma.treatment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Performs a soft delete on all treatments associated with a patient.
   * @param patientId The patient ID.
   */
  async softDeleteByPatientId(patientId: string): Promise<void> {
    await prisma.treatment.updateMany({
      where: { patientId, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Restores a soft-deleted treatment record.
   * @param id The treatment ID.
   */
  async restore(id: string): Promise<void> {
    await prisma.treatment.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }

  /**
   * Restores soft-deleted treatments for a specific patient, deleted after a certain date.
   * @param patientId The patient ID.
   * @param since The date after which deletions should be restored.
   */
  async restoreByPatientId(patientId: string, since: Date): Promise<void> {
    await prisma.treatment.updateMany({
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
