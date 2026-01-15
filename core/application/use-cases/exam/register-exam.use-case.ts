import { NotFoundError } from '@/core/domain/errors/app.error';
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
    const { ipAddress, userAgent, ...examData } = input;

    // 1. Verify that the patient exists.
    const patient = await this.patientRepository.findById(examData.patientId);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // 2. Delegate to the repository.
    const exam = await this.examRepository.create({
      ...examData,
      createdBy: examData.createdBy || 'SYSTEM',
    });

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: examData.createdBy || 'SYSTEM',
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
