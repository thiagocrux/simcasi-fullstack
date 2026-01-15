import { NotFoundError } from '@/core/domain/errors/app.error';
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
    private readonly patientRepository: PatientRepository
  ) {}

  async execute(input: RegisterExamInput): Promise<RegisterExamOutput> {
    // 1. Verify that the patient exists.
    const patient = await this.patientRepository.findById(input.patientId);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    // 2. Delegate to the repository.
    return this.examRepository.create(input);
  }
}
