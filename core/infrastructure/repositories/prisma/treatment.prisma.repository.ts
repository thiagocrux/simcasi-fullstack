/* eslint-disable @typescript-eslint/no-explicit-any */
import { Treatment } from '@/core/domain/entities/treatment.entity';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import { Prisma } from '@prisma/client';
import { normalizeDateFilter } from '../../lib/date.utils';
import { prisma } from '../../lib/prisma';

export class PrismaTreatmentRepository implements TreatmentRepository {
  /**
   * Finds a treatment record by its unique ID.
   *
   * @param id The treatment ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found treatment or null if not found.
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
   *
   * @param params Filtering and pagination parameters.
   * @return An object containing the list of treatments and the total count.
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
  }): Promise<{ items: Treatment[]; total: number }> {
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

    const where: Prisma.TreatmentWhereInput = {
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
        where[searchBy as keyof Prisma.TreatmentWhereInput] = {
          contains: search,
          mode: 'insensitive',
        } as any;
      } else {
        // Default generic search
        where.OR = [
          { medication: { contains: search, mode: 'insensitive' } },
          { dosage: { contains: search, mode: 'insensitive' } },
          { healthCenter: { contains: search, mode: 'insensitive' } },
          { observations: { contains: search, mode: 'insensitive' } },
          { partnerInformation: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    const [items, total] = await Promise.all([
      prisma.treatment.findMany({
        where,
        skip,
        take,
        orderBy: orderBy ? { [orderBy]: orderDir } : { updatedAt: 'desc' },
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
   *
   * @param data The treatment data.
   * @return The newly created treatment.
   */
  async create(
    data: Omit<Treatment, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Treatment> {
    const { patientId, createdBy, updatedBy, ...treatmentData } = data;

    const treatment = await prisma.treatment.create({
      data: {
        ...treatmentData,
        patient: { connect: { id: patientId } },
        creator: { connect: { id: createdBy } },
        updater: updatedBy ? { connect: { id: updatedBy } } : undefined,
      },
    });
    return treatment as Treatment;
  }

  /**
   * Updates an existing treatment record.
   *
   * @param id The treatment ID.
   * @param data The partial data to update.
   * @param updatedBy The user performing the update.
   * @return The updated treatment.
   */
  async update(
    id: string,
    data: Partial<Omit<Treatment, 'id' | 'createdAt'>>,
    updatedBy: string
  ): Promise<Treatment> {
    const { patientId, ...updateData } = data as any;

    const treatment = await prisma.treatment.update({
      where: { id },
      data: {
        ...updateData,
        patient: patientId ? { connect: { id: patientId } } : undefined,
        updater: { connect: { id: updatedBy } },
        updatedAt: new Date(),
      },
    });
    return treatment as Treatment;
  }

  /**
   * Performs a soft delete on a treatment.
   *
   * @param id The treatment ID.
   * @param updatedBy The user performing the deletion.
   * @return A promise that resolves when the operation is complete.
   */
  async softDelete(id: string, updatedBy: string): Promise<void> {
    await prisma.treatment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updater: { connect: { id: updatedBy } },
      },
    });
  }

  /**
   * Performs a soft delete on all treatments associated with a patient.
   *
   * @param patientId The patient ID.
   * @param updatedBy The user performing the deletion.
   * @return A promise that resolves when the operation is complete.
   */
  async softDeleteByPatientId(
    patientId: string,
    updatedBy: string
  ): Promise<void> {
    await prisma.treatment.updateMany({
      where: { patientId, deletedAt: null },
      data: {
        deletedAt: new Date(),
        updatedBy,
      },
    });
  }

  /**
   * Restores a soft-deleted treatment record.
   *
   * @param id The treatment ID.
   * @param updatedBy The ID of the user performing the restoration.
   * @return A promise that resolves when the operation is complete.
   */
  async restore(id: string, updatedBy: string): Promise<void> {
    await prisma.treatment.update({
      where: { id },
      data: {
        deletedAt: null,
        updater: { connect: { id: updatedBy } },
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Restores soft-deleted treatments for a specific patient, deleted after a certain date.
   *
   * @param patientId The patient ID.
   * @param updatedBy The ID of the user performing the restoration.
   * @param since The date after which deletions should be restored (optional).
   * @return A promise that resolves when the operation is complete.
   */
  async restoreByPatientId(
    patientId: string,
    updatedBy: string,
    since?: Date
  ): Promise<void> {
    await prisma.treatment.updateMany({
      where: {
        patientId,
        deletedAt: since ? { gte: since } : { not: null },
      },
      data: {
        deletedAt: null,
        updatedBy: updatedBy,
      },
    });
  }
}
