import { treatmentQuerySchema } from '@/core/application/validation/schemas/treatment.schema';
import { User } from '@/core/domain/entities/user.entity';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { TreatmentRepository } from '@/core/domain/repositories/treatment.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  FindTreatmentsInput,
  FindTreatmentsOutput,
} from '../../contracts/treatment/find-treatments.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to find treatments with pagination and filters.
 */
export class FindTreatmentsUseCase implements UseCase<
  FindTreatmentsInput,
  FindTreatmentsOutput
> {
  /**
   * Creates an instance of FindTreatmentsUseCase.
   * @param treatmentRepository The repository for treatment data operations.
   * @param userRepository The repository for user data operations.
   * @param patientRepository The repository for patient data operations.
   */
  constructor(
    private readonly treatmentRepository: TreatmentRepository,
    private readonly userRepository: UserRepository,
    private readonly patientRepository: PatientRepository
  ) {}

  /**
   * Executes the use case to find treatments.
   * @param input The pagination and filter criteria.
   * @return A promise that resolves to the list of treatments and total count.
   */
  async execute(input: FindTreatmentsInput): Promise<FindTreatmentsOutput> {
    const validatedInput = treatmentQuerySchema.parse(
      input
    ) as FindTreatmentsInput;

    const { items, total } =
      await this.treatmentRepository.findAll(validatedInput);

    const userIds = new Set<string>();
    const patientIds = new Set<string>();

    items.forEach((item) => {
      if (input.includeRelatedUsers) {
        if (item.createdBy) userIds.add(item.createdBy);
        if (item.updatedBy) userIds.add(item.updatedBy);
      }
      if (input.includeRelatedPatients) {
        if (item.patientId) patientIds.add(item.patientId);
      }
    });

    // Fetch related users and patients in parallel for enrichment
    const [relatedUsers, relatedPatients] = await Promise.all([
      userIds.size > 0
        ? this.userRepository.findByIds(Array.from(userIds))
        : Promise.resolve([]),
      patientIds.size > 0
        ? this.patientRepository.findByIds(Array.from(patientIds))
        : Promise.resolve([]),
    ]);

    const sanitizedUsers = relatedUsers.map((user) => {
      const { password: _, ...rest } = user;
      return rest;
    }) as Omit<User, 'password'>[];

    return {
      items,
      total,
      ...(input.includeRelatedUsers && { relatedUsers: sanitizedUsers }),
      ...(input.includeRelatedPatients && { relatedPatients }),
    };
  }
}
