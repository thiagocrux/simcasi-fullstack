import { Exam } from '@/core/domain/entities/exam.entity';
import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import { Prisma } from '@/prisma/generated/client';
import { prisma } from '../../lib/prisma';

export class PrismaExamRepository implements ExamRepository {
  /**
   * Finds an exam by its ID.
   * @param id The exam ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @returns The exam or null if not found.
   */
  async findById(id: string, includeDeleted = false): Promise<Exam | null> {
    const exam = await prisma.exam.findFirst({
      where: {
        id,
        deletedAt: includeDeleted ? undefined : null,
      },
    });
    return (exam as Exam) || null;
  }

  /**
   * Retrieves a paginated list of exams with optional filters.
   * @param params Filtering and pagination parameters.
   * @returns An object containing the list of exams and the total count.
   */
  async findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    patientId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Exam[]; total: number }> {
    const skip = params?.skip || 0;
    const take = params?.take || 20;
    const search = params?.search;
    const patientId = params?.patientId;
    const includeDeleted = params?.includeDeleted || false;

    const where: Prisma.ExamWhereInput = {
      deletedAt: includeDeleted ? undefined : null,
      patientId: patientId,
    };

    if (search) {
      where.OR = [
        { treponemalTestType: { contains: search, mode: 'insensitive' } },
        { nontreponemalVdrlTest: { contains: search, mode: 'insensitive' } },
        {
          nontreponemalTestTitration: { contains: search, mode: 'insensitive' },
        },
        { referenceObservations: { contains: search, mode: 'insensitive' } },
        { otherNontreponemalTest: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.exam.count({ where }),
    ]);

    return {
      items: items as Exam[],
      total,
    };
  }

  /**
   * Creates a new exam record.
   * @param data The exam data.
   * @returns The newly created exam.
   */
  async create(
    data: Omit<Exam, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Exam> {
    const exam = await prisma.exam.create({
      data,
    });
    return exam as Exam;
  }

  /**
   * Updates an existing exam record.
   * @param id The exam ID.
   * @param data The partial data to update.
   * @returns The updated exam.
   */
  async update(
    id: string,
    data: Partial<Omit<Exam, 'id' | 'createdAt'>>
  ): Promise<Exam> {
    const exam = await prisma.exam.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return exam as Exam;
  }

  /**
   * Performs a soft delete on an exam.
   * @param id The exam ID.
   */
  async softDelete(id: string): Promise<void> {
    await prisma.exam.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Performs a soft delete on all exams associated with a patient.
   * @param patientId The patient ID.
   */
  async softDeleteByPatientId(patientId: string): Promise<void> {
    await prisma.exam.updateMany({
      where: { patientId, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Restores a soft-deleted exam.
   * @param id The exam ID.
   */
  async restore(id: string): Promise<void> {
    await prisma.exam.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }

  /**
   * Restores soft-deleted exams for a specific patient, deleted after a certain date.
   * @param patientId The patient ID.
   * @param since The date after which deletions should be restored.
   */
  async restoreByPatientId(patientId: string, since: Date): Promise<void> {
    await prisma.exam.updateMany({
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
