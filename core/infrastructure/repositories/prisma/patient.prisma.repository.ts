import { Patient } from '@/core/domain/entities/patient.entity';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export class PrismaPatientRepository implements PatientRepository {
  /**
   * Finds a patient by their unique ID.
   * @param id The patient ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @returns The patient or null if not found.
   */
  async findById(id: string, includeDeleted = false): Promise<Patient | null> {
    const patient = await prisma.patient.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return (patient as Patient) || null;
  }

  /**
   * Finds a patient by their CPF.
   * @param cpf The CPF to search for.
   * @param includeDeleted Whether to include soft-deleted records.
   * @returns The patient or null if not found.
   */
  async findByCpf(
    cpf: string,
    includeDeleted = false
  ): Promise<Patient | null> {
    const patient = await prisma.patient.findFirst({
      where: {
        cpf,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return (patient as Patient) || null;
  }

  /**
   * Finds a patient by their SUS card number.
   * @param susCardNumber The SUS card number to search for.
   * @param includeDeleted Whether to include soft-deleted records.
   * @returns The patient or null if not found.
   */
  async findBySusCardNumber(
    susCardNumber: string,
    includeDeleted = false
  ): Promise<Patient | null> {
    const patient = await prisma.patient.findFirst({
      where: {
        susCardNumber,
        deletedAt: includeDeleted ? undefined : null,
      },
    });

    return (patient as Patient) || null;
  }

  /**
   * Retrieves a paginated list of patients with optional search filtering.
   * @param params Filtering and pagination parameters.
   * @returns An object containing the list of patients and the total count.
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    startDate?: Date;
    endDate?: Date;
    includeDeleted?: boolean;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
  }): Promise<{ items: Patient[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 20;
    const orderBy = params?.orderBy;
    const orderDir = params?.orderDir || 'asc';
    const search = params?.search;
    const includeDeleted = params?.includeDeleted || false;
    const startDate = params?.startDate;
    const endDate = params?.endDate;

    const where: Prisma.PatientWhereInput = {
      deletedAt: includeDeleted ? undefined : null,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: search } },
        { susCardNumber: { contains: search } },
        { motherName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take,
        orderBy: orderBy ? { [orderBy]: orderDir } : { name: 'asc' },
      }),
      prisma.patient.count({ where }),
    ]);

    return {
      items: items as Patient[],
      total,
    };
  }

  /**
   * Creates a new patient record in the database.
   * @param data The patient data to create.
   * @returns The newly created patient.
   */
  async create(
    data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Patient> {
    const patient = await prisma.patient.create({
      data,
    });

    return patient as Patient;
  }

  /**
   * Updates an existing patient record.
   * @param id The patient ID.
   * @param data The partial data to update.
   * @returns The updated patient.
   */
  async update(
    id: string,
    data: Partial<Omit<Patient, 'id' | 'createdAt'>>
  ): Promise<Patient> {
    const patient = await prisma.patient.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return patient as Patient;
  }

  /**
   * Performs a soft delete on a patient.
   * @param id The patient ID.
   */
  async softDelete(id: string): Promise<void> {
    await prisma.patient.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Restores a soft-deleted patient.
   * @param id The patient ID.
   */
  async restore(id: string, updatedBy: string): Promise<void> {
    await prisma.patient.update({
      where: { id },
      data: {
        deletedAt: null,
        updatedBy,
      },
    });
  }
}
