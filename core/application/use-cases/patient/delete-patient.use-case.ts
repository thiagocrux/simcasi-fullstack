import { NotFoundError } from '@/core/domain/errors/app.error';
import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import {
  DeletePatientInput,
  DeletePatientOutput,
} from '../../contracts/patient/delete-patient.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to logically delete a patient and cascade the deletion to their medical records.
 */
export class DeletePatientUseCase implements UseCase<
  DeletePatientInput,
  DeletePatientOutput
> {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly examRepository: ExamRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly observationRepository: ObservationRepository,
    private readonly treatmentRepository: TreatmentRepository
  ) {}

  async execute(input: DeletePatientInput): Promise<DeletePatientOutput> {
    // 1. Check if patient exists.
    const patient = await this.patientRepository.findById(input.id);

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // 2. Soft delete the patient.
    await this.patientRepository.softDelete(input.id);

    // 3. Cascade soft delete to all related medical records.
    await Promise.all([
      this.examRepository.softDeleteByPatientId(input.id),
      this.notificationRepository.softDeleteByPatientId(input.id),
      this.observationRepository.softDeleteByPatientId(input.id),
      this.treatmentRepository.softDeleteByPatientId(input.id),
    ]);
  }
}
