import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  FindUsersInput,
  FindUsersOutput,
} from '../../contracts/user/find-users.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to find users with pagination and search.
 */
export class FindUsersUseCase implements UseCase<
  FindUsersInput,
  FindUsersOutput
> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: FindUsersInput): Promise<FindUsersOutput> {
    // 1. Find all users based on input criteria.
    const result = await this.userRepository.findAll(input);

    // 2. Security: Ensure passwords are removed from the output.
    return {
      total: result.total,
      items: result.items.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
    };
  }
}
