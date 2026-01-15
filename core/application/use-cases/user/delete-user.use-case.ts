import { NotFoundError } from '@/core/domain/errors/app.error';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  DeleteUserInput,
  DeleteUserOutput,
} from '../../contracts/user/delete-user.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to soft delete a user and revoke all their sessions.
 */
export class DeleteUserUseCase implements UseCase<
  DeleteUserInput,
  DeleteUserOutput
> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository
  ) {}

  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    // 1. Check if the user exists.
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // 2. Soft delete the user.
    await this.userRepository.softDelete(input.id);

    // 3. Revoke all active sessions (force logout everywhere).
    await this.sessionRepository.revokeAllByUserId(input.id);
  }
}
