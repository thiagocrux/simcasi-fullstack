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
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly tokenProvider: TokenProvider
  ) {}

  async execute(input: ValidateSessionInput): Promise<ValidateSessionOutput> {
    // 1. Cryptographic Validation
    const decoded = await this.tokenProvider.verifyToken<{
      sub: string;
      roleId: string;
      sid: string;
    }>(input.token);

    if (!decoded || !decoded.sub || !decoded.sid) {
      throw new InvalidTokenError('Invalid or expired token.');
    }

    // 2. Stateful Validation (Database check)
    const session = await this.sessionRepository.findById(decoded.sid);

    if (!session || session.deletedAt) {
      throw new SessionExpiredError('Session has been revoked or expired.');
    }

    return {
      userId: decoded.sub,
      roleId: decoded.roleId,
      sessionId: decoded.sid,
    };
  }
}
