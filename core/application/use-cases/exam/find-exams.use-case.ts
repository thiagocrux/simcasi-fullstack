import { examQuerySchema } from '@/core/application/validation/schemas/exam.schema';
import { User } from '@/core/domain/entities/user.entity';
import { ExamRepository } from '@/core/domain/repositories/exam.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  FindExamsInput,
  FindExamsOutput,
} from '../../contracts/exam/find-exams.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to find exams with pagination and filters.
 */
export class FindExamsUseCase implements UseCase<
  FindExamsInput,
  FindExamsOutput
> {
  constructor(
    private readonly examRepository: ExamRepository,
    private readonly userRepository: UserRepository,
    private readonly patientRepository: PatientRepository
  ) {}

  /**
   * Executes the use case to find exams.
   */
  async execute(input: FindExamsInput): Promise<FindExamsOutput> {
    const validatedInput = examQuerySchema.parse(input) as FindExamsInput;

    const { items, total } = await this.examRepository.findAll(validatedInput);

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
