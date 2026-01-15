import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import {
  DeleteExamInput,
  DeleteExamOutput,
} from '../../contracts/exam/delete-exam.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to soft delete an exam.
 */
export class DeleteExamUseCase implements UseCase<
  DeleteExamInput,
  DeleteExamOutput
> {
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: DeleteExamInput): Promise<DeleteExamOutput> {
    const { id, deletedBy, ipAddress, userAgent } = input;

    // 1. Check if the exam exists.
    const exam = await this.examRepository.findById(id);
    if (!exam) {
      throw new NotFoundError('Exam not found');
    }

    // 2. Soft delete the exam.
    await this.examRepository.softDelete(id);

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: deletedBy || 'SYSTEM',
      action: 'DELETE',
      entityName: 'EXAM',
      entityId: id,
      oldValues: exam,
      ipAddress,
      userAgent,
    });
  }
}
