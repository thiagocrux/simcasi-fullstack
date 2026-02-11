import {
  InvalidTokenError,
  SessionExpiredError,
} from '@/core/domain/errors/session.error';
import { TokenProvider } from '@/core/domain/providers/token.provider';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
import {
  ValidateSessionInput,
  ValidateSessionOutput,
} from '../../contracts/session/validate-session.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to validate a token and verify if the session is still active.
 */
export class ValidateSessionUseCase implements UseCase<
  ValidateSessionInput,
  ValidateSessionOutput
> {
  /**
   * Initializes a new instance of the ValidateSessionUseCase class.
   *
   * @param sessionRepository The repository for session persistence.
   * @param tokenProvider The provider for token verification.
   */
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly tokenProvider: TokenProvider
  ) {}

  /**
   * Executes the use case to validate a session.
   *
   * @param input The token to validate.
   * @return A promise that resolves to the session validation result.
   * @throws {InvalidTokenError} If the token is invalid or expired.
   * @throws {SessionExpiredError} If the session has been revoked.
   */
  async execute(input: ValidateSessionInput): Promise<ValidateSessionOutput> {
    // 1. Cryptographic Validation
    // The provider now decodes the payload even if expired.
    const decoded = await this.tokenProvider.verifyToken<{
      sub: string;
      roleId: string;
      sid: string;
      exp?: number;
    }>(input.token);

    if (!decoded || !decoded.sub || !decoded.sid) {
      throw new InvalidTokenError('Invalid or malformed token.');
    }

    // 2. Stateful Validation (Database check)
    const session = await this.sessionRepository.findById(decoded.sid);

    if (!session || session.deletedAt) {
      throw new SessionExpiredError('Session has been revoked or expired.');
    }

    // 3. Expiration Validation
    // We check if the access token has expired. If so, we throw an error
    // to trigger the refresh token flow in the infrastructure layer.
    if (decoded.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (now > decoded.exp) {
        throw new InvalidTokenError('Access token has expired.');
      }
    }

    return {
      userId: decoded.sub,
      roleId: decoded.roleId,
      sessionId: decoded.sid,
    };
  }
}
