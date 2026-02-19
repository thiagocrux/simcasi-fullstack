import {
  ValidatePasswordResetTokenInput,
  ValidatePasswordResetTokenOutput,
} from '@/core/application/contracts/user/validate-password-reset-token.contract';
import { PasswordResetTokenRepository } from '@/core/domain/repositories/password-reset-token.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import { UseCase } from '../use-case.interface';

/**
 * Use case to validate if a password reset token is still valid (not used/expired).
 */
export class ValidatePasswordResetTokenUseCase implements UseCase<
  ValidatePasswordResetTokenInput,
  ValidatePasswordResetTokenOutput
> {
  /**
   * Initializes the validation use case.
   * @param tokenRepository The token repository for lookup.
   * @param userRepository The user repository to confirm ownership (optional validation).
   */
  constructor(
    private readonly tokenRepository: PasswordResetTokenRepository,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Checks if a token is valid before rendering the reset form.
   * @param input Contains the token to check.
   * @returns Validation result with boolean flag and associated user email.
   */
  async execute(
    input: ValidatePasswordResetTokenInput
  ): Promise<ValidatePasswordResetTokenOutput> {
    const { token } = input;

    // 1. Locate the token through the repository.
    // findByToken logic in infra should handle "isExpired" and "isUsed" filtering.
    const tokenRecord = await this.tokenRepository.findByToken(token);

    if (!tokenRecord) {
      return { isValid: false };
    }

    // 2. Locate the user to provide context (like email) for the UI.
    const user = await this.userRepository.findById(tokenRecord.userId);

    if (!user) {
      return { isValid: false };
    }

    return {
      isValid: true,
      email: user.email,
    };
  }
}
