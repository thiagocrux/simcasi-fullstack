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
    return await this.userRepository.findAll(input);
  }
}
