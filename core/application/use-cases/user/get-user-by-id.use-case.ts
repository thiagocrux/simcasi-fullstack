import { NotFoundError } from '@/core/domain/errors/app.error';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  GetUserInput,
  GetUserOutput,
} from '../../contracts/user/get-user-by-id.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve an user by ID.
 */
export class GetUserByIdUseCase implements UseCase<
  GetUserInput,
  GetUserOutput
> {
  /**
   * Creates an instance of GetUserByIdUseCase.
   * @param userRepository The repository for user data operations.
   */
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Executes the use case to retrieve a user by ID.
   * @param input The user ID and options.
   * @return A promise that resolves to the user details.
   * @throws {NotFoundError} If the user is not found.
   */
  async execute(input: GetUserInput): Promise<GetUserOutput> {
    const user = await this.userRepository.findById(
      input.id,
      input.includeDeleted
    );

    if (!user) {
      throw new NotFoundError('Usuário');
    }

    delete user.password; // Security: Never return the password from the use case.

    return user;
  }
}
