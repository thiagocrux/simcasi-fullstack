import { examSchema } from '@/core/application/validation/schemas/exam.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import {
  RegisterExamInput,
  RegisterExamOutput,
} from '../../contracts/exam/register-exam.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new exam for a patient.
 */
export class RegisterExamUseCase implements UseCase<
  RegisterExamInput,
  RegisterExamOutput
> {
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly patientRepository: PatientRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: RegisterExamInput): Promise<RegisterExamOutput> {
    const { userId, ipAddress, userAgent, ...examData } = input;

    // 1. Validate input.
    const validation = examSchema.safeParse(examData);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid register exam data.',
        formatZodError(validation.error)
      );
    }

    // 2. Verify that the patient exists.
    const patient = await this.patientRepository.findById(examData.patientId);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // 3. Delegate to the repository.
    const exam = await this.examRepository.create({
      ...validation.data,
      treponemalTestDate: new Date(validation.data.treponemalTestDate),
      nontreponemalTestDate: new Date(validation.data.nontreponemalTestDate),
      otherNontreponemalTestDate: validation.data.otherNontreponemalTestDate
        ? new Date(validation.data.otherNontreponemalTestDate)
        : undefined,
      createdBy: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      updatedBy: null,
    });

    // 4. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'CREATE',
      entityName: 'EXAM',
      entityId: exam.id,
      newValues: exam,
      ipAddress,
      userAgent,
    });

    return exam;
  }
}
