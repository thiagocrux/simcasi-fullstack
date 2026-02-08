import { patientQuerySchema } from '@/core/application/validation/schemas/patient.schema';
import { User } from '@/core/domain/entities/user.entity';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  FindPatientsInput,
  FindPatientsOutput,
} from '../../contracts/patient/find-patients.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve a list of patients with pagination and search.
 */
export class FindPatientsUseCase implements UseCase<
  FindPatientsInput,
  FindPatientsOutput
> {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Executes the use case to find patients.
   */
  async execute(input: FindPatientsInput): Promise<FindPatientsOutput> {
    const validatedInput = patientQuerySchema.parse(input) as FindPatientsInput;

    const { items, total } =
      await this.patientRepository.findAll(validatedInput);

    const userIds = new Set<string>();
    if (validatedInput.includeRelatedUsers) {
      items.forEach((item) => {
        if (item.createdBy) userIds.add(item.createdBy);
        if (item.updatedBy) userIds.add(item.updatedBy);
      });
    }

    // Fetch and sanitize related users if requested
    const relatedUsers =
      userIds.size > 0
        ? await this.userRepository.findByIds(Array.from(userIds))
        : [];

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
    };
  }
}
