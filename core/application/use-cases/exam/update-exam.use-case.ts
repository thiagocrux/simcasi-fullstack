import { examSchema } from '@/core/application/validation/schemas/exam.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import {
  UpdateExamInput,
  UpdateExamOutput,
} from '../../contracts/exam/update-exam.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to update an existing exam.
 */
export class UpdateExamUseCase implements UseCase<
  UpdateExamInput,
  UpdateExamOutput
> {
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: UpdateExamInput): Promise<UpdateExamOutput> {
    const { id, userId, ipAddress, userAgent, ...data } = input;

    // 1. Validate input.
    const validation = examSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid update exam data.',
        formatZodError(validation.error)
      );
    }

    // 2. Check if the exam exists.
    const existing = await this.examRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Exam not found');
    }

    // 3. Update the exam.
    const updatedExam = await this.examRepository.update(id, {
      ...validation.data,
      updatedBy: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      treponemalTestDate: validation.data.treponemalTestDate
        ? new Date(validation.data.treponemalTestDate)
        : undefined,
      nontreponemalTestDate: validation.data.nontreponemalTestDate
        ? new Date(validation.data.nontreponemalTestDate)
        : undefined,
      otherNontreponemalTestDate: validation.data.otherNontreponemalTestDate
        ? new Date(validation.data.otherNontreponemalTestDate)
        : undefined,
    });

    // 4. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'UPDATE',
      entityName: 'EXAM',
      entityId: id,
      oldValues: existing,
      newValues: updatedExam,
      ipAddress,
      userAgent,
    });

    return updatedExam;
  }
}
