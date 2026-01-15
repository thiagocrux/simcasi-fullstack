import { NotFoundError } from '@/core/domain/errors/app.error';
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
    const { id, updatedBy, ipAddress, userAgent, ...data } = input;

    // 1. Check if the exam exists.
    const existing = await this.examRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Exam not found');
    }

    // 2. Update the exam.
    const updatedExam = await this.examRepository.update(id, data);

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: updatedBy || 'SYSTEM',
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
