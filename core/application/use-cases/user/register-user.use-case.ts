import { ConflictError } from '@/core/domain/errors/app.error';
import { HashProvider } from '@/core/domain/providers/hash.provider';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  RegisterUserInput,
  RegisterUserOutput,
} from '../../contracts/user/register-user.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new user with hashed password.
 */
export class RegisterUserUseCase implements UseCase<
  RegisterUserInput,
  RegisterUserOutput
> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    // 1. Check if the email is already in use (by an active user).
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError(`Email ${input.email} is already in use.`);
    }

    // 2. Hash the password.
    const hashedPassword = await this.hashProvider.hash(input.password);

    // 3. Delegate to the repository (handles restoration if the email was soft-deleted).
    return await this.userRepository.create({
      ...input,
      password: hashedPassword,
    });
  }
}
