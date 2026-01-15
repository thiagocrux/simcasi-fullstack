import { NotFoundError } from '@/core/domain/errors/app.error';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  GetUserInput,
  GetUserOutput,
} from '../../contracts/user/get-user-by-id.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve a user by ID.
 */
export class GetUserByIdUseCase implements UseCase<
  GetUserInput,
  GetUserOutput
> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: GetUserInput): Promise<GetUserOutput> {
    const user = await this.userRepository.findById(
      input.id,
      input.includeDeleted
    );

    if (!user) {
      throw new NotFoundError('User not found');
    }

    delete user.password; // Security: Never return the password from the use case.

    return user;
  }
}
