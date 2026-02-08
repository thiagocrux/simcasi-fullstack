import { observationQuerySchema } from '@/core/application/validation/schemas/observation.schema';
import { User } from '@/core/domain/entities/user.entity';
import { ObservationRepository } from '@/core/domain/repositories/observation.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  FindObservationsInput,
  FindObservationsOutput,
} from '../../contracts/observation/find-observations.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to find observations with pagination and filters.
 */
export class FindObservationsUseCase implements UseCase<
  FindObservationsInput,
  FindObservationsOutput
> {
  constructor(
    private readonly observationRepository: ObservationRepository,
    private readonly userRepository: UserRepository,
    private readonly patientRepository: PatientRepository
  ) {}

  /**
   * Executes the use case to find observations.
   */
  async execute(input: FindObservationsInput): Promise<FindObservationsOutput> {
    const validatedInput = observationQuerySchema.parse(
      input
    ) as FindObservationsInput;

    const { items, total } =
      await this.observationRepository.findAll(validatedInput);

    const userIds = new Set<string>();
    const patientIds = new Set<string>();

    items.forEach((item) => {
      if (validatedInput.includeRelatedUsers) {
        if (item.createdBy) userIds.add(item.createdBy);
        if (item.updatedBy) userIds.add(item.updatedBy);
      }
      if (validatedInput.includeRelatedPatients) {
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
      ...(validatedInput.includeRelatedUsers && {
        relatedUsers: sanitizedUsers,
      }),
      ...(validatedInput.includeRelatedPatients && { relatedPatients }),
    };
  }
}
