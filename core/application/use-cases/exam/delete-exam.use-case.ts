import {
  AUDIT_LOG_ACTION,
  AUDIT_LOG_ENTITY,
} from '@/core/domain/constants/audit-log.constants';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
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
  /**
   * Initializes a new instance of the DeleteExamUseCase class.
   *
   * @param examRepository The repository for exam persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to soft delete an exam.
   *
   * @param input The data containing the exam ID and auditor info.
   * @return A promise that resolves when the deletion is complete.
   * @throws {NotFoundError} If the exam is not found.
   */
  async execute(input: DeleteExamInput): Promise<DeleteExamOutput> {
    const { id, userId, ipAddress, userAgent } = input;

    // 1. Check if the exam exists.
    const exam = await this.examRepository.findById(id);
    if (!exam) {
      throw new NotFoundError('Exame');
    }

    // 2. Soft delete the exam.
    await this.examRepository.softDelete(
      id,
      userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
    );

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: AUDIT_LOG_ACTION.DELETE,
      entityName: AUDIT_LOG_ENTITY.EXAM,
      entityId: id,
      oldValues: exam,
      ipAddress,
      userAgent,
    });
  }
}
