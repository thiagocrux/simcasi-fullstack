import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import {
  RestoreExamInput,
  RestoreExamOutput,
} from '../../contracts/exam/restore-exam.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a soft-deleted exam.
 */
export class RestoreExamUseCase implements UseCase<
  RestoreExamInput,
  RestoreExamOutput
> {
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: RestoreExamInput): Promise<RestoreExamOutput> {
    const { id, userId, ipAddress, userAgent } = input;

    // 1. Check if the exam exists (including deleted).
    const exam = await this.examRepository.findById(id, true);
    if (!exam) {
      throw new NotFoundError('Exam not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (exam.deletedAt) {
      await this.examRepository.restore(
        id,
        userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
      );
      exam.deletedAt = null;
      exam.updatedBy = userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID;

      // 3. Create audit log.
      await this.auditLogRepository.create({
        userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
        action: 'RESTORE',
        entityName: 'EXAM',
        entityId: id,
        newValues: exam,
        ipAddress,
        userAgent,
      });
    }

    return exam as RestoreExamOutput;
  }
}
