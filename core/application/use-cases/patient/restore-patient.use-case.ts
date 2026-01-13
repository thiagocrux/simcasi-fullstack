import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a logically deleted patient and their medical records.
 */
export class RestorePatientUseCase implements UseCase<string, void> {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly examRepository: ExamRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly observationRepository: ObservationRepository,
    private readonly treatmentRepository: TreatmentRepository
  ) {}

  async execute(patientId: string): Promise<void> {
    // 1. Restore the patient
    await this.patientRepository.restore(patientId);

    // 2. Cascade restore to all related medical records
    await Promise.all([
      this.examRepository.restoreByPatientId(patientId),
      this.notificationRepository.restoreByPatientId(patientId),
      this.observationRepository.restoreByPatientId(patientId),
      this.treatmentRepository.restoreByPatientId(patientId),
    ]);
  }
}
