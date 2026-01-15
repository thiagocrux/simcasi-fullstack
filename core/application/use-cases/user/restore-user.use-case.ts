import { NotFoundError } from '@/core/domain/errors/app.error';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  RestoreUserInput,
  RestoreUserOutput,
} from '../../contracts/user/restore-user.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a soft-deleted user.
 */
export class RestoreUserUseCase implements UseCase<
  RestoreUserInput,
  RestoreUserOutput
> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RestoreUserInput): Promise<RestoreUserOutput> {
    // 1. Check if the user exists (including deleted).
    const user = await this.userRepository.findById(input.id, true);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (user.deletedAt) {
      await this.userRepository.restore(input.id);
      user.deletedAt = null;
    }

    delete user.password;

    return user as RestoreUserOutput;
  }
}
