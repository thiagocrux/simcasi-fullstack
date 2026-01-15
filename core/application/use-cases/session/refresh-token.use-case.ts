import { UnauthorizedError } from '@/core/domain/errors/app.error';
import {
  InvalidTokenError,
  SecurityBreachError,
  SessionExpiredError,
} from '@/core/domain/errors/session.error';
import { TokenProvider } from '@/core/domain/providers/token.provider';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import { RefreshTokenInput } from '../../contracts/session/refresh-token.contract';
import { SessionOutput } from '../../contracts/session/session-output.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to refresh an access token using a valid refresh token and active session.
 */
export class RefreshTokenUseCase implements UseCase<
  RefreshTokenInput,
  SessionOutput
> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly tokenProvider: TokenProvider
  ) {}

  async execute(input: RefreshTokenInput): Promise<SessionOutput> {
    // 1. Verify the refresh token.
    const decoded = await this.tokenProvider.verifyToken<{
      sub: string;
      sid: string;
    }>(input.refreshToken);

    if (!decoded || !decoded.sub || !decoded.sid) {
      throw new InvalidTokenError('Invalid refresh token.');
    }

    // 2. Find the session in the repository.
    const existingSession = await this.sessionRepository.findById(
      decoded.sid,
      true
    );

    if (!existingSession) {
      throw new SessionExpiredError('Session not found or expired.');
    }

    // 3. Detect token reuse (if the session is already deleted, it indicates a breach).
    if (existingSession.deletedAt) {
      await this.sessionRepository.revokeAllByUserId(decoded.sub);
      throw new SecurityBreachError(
        'Security breach detected. All sessions revoked.'
      );
    }

    // 4. Load the user and verify their status.
    const user = await this.userRepository.findById(decoded.sub);
    if (!user || user.deletedAt) {
      throw new UnauthorizedError('User no longer exists or is inactive.');
    }

    // 5. Perform token rotation (invalidate the old session and create a new one).
    await this.sessionRepository.softDelete(decoded.sid);

    const newSession = await this.sessionRepository.create({
      userId: user.id,
      issuedAt: new Date(),
      expiresAt: this.tokenProvider.getRefreshExpiryDate(),
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });

    // 6. Generate new tokens with the new session ID.
    const newAccessToken = await this.tokenProvider.generateAccessToken({
      sub: user.id,
      roleId: user.roleId,
      sid: newSession.id,
    });
    const newRefreshToken = await this.tokenProvider.generateRefreshToken({
      sub: user.id,
      sid: newSession.id,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      },
    };
  }
}
