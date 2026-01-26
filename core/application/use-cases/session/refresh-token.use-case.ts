import { SECURITY_CONSTANTS } from '@/core/domain/constants/security.constants';
import { UnauthorizedError } from '@/core/domain/errors/app.error';
import {
  InvalidTokenError,
  SecurityBreachError,
  SessionExpiredError,
} from '@/core/domain/errors/session.error';
import { TokenProvider } from '@/core/domain/providers/token.provider';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import { logger } from '@/lib/logger.utils';
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
    private readonly permissionRepository: PermissionRepository,
    private readonly tokenProvider: TokenProvider
  ) {}

  async execute(input: RefreshTokenInput): Promise<SessionOutput> {
    // 1. Verify the refresh token.
    const decoded = await this.tokenProvider.verifyToken<{
      sub: string;
      sid: string;
      rememberMe?: boolean;
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

    // 3. Detect token reuse (with a generous grace period for concurrent requests and multi-tabs).
    // If the session is already deleted, it indicates a breach.
    if (existingSession.deletedAt) {
      const deletedAtTime = existingSession.deletedAt.getTime();
      const nowTime = Date.now();

      if (
        nowTime - deletedAtTime >
        SECURITY_CONSTANTS.REFRESH_TOKEN_GRACE_PERIOD_MS
      ) {
        // Only if it was deleted longer ago than the grace period, we treat it as a breach.
        logger.error(
          `[SECURITY] Token reuse detected for session ${decoded.sid}. Revoking all sessions for user ${decoded.sub}. Deleted at: ${existingSession.deletedAt.toISOString()}, Now: ${new Date().toISOString()}`
        );

        await this.sessionRepository.revokeAllByUserId(decoded.sub);
        throw new SecurityBreachError(
          'Security breach detected. All sessions revoked.'
        );
      }

      logger.warn(
        `[AUTH] Concurrent refresh detected for session ${decoded.sid} within ${
          SECURITY_CONSTANTS.REFRESH_TOKEN_GRACE_PERIOD_MS / 1000
        }s grace period. Allowing rotation to continue.`
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
      ipAddress: input.ipAddress || 'unknown',
      userAgent: input.userAgent || 'unknown',
    });

    // 6. Fetch permissions for the user's role.
    const permissions = await this.permissionRepository.findByRoleId(
      user.roleId
    );
    const permissionCodes = permissions.map((p) => p.code);

    // 7. Generate new tokens with the new session ID.
    const newAccessToken = await this.tokenProvider.generateAccessToken({
      sub: user.id,
      roleId: user.roleId,
      sid: newSession.id,
    });
    const newRefreshToken = await this.tokenProvider.generateRefreshToken({
      sub: user.id,
      sid: newSession.id,
      rememberMe: decoded.rememberMe,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      rememberMe: decoded.rememberMe,
      accessTokenExpiresIn: this.tokenProvider.getAccessExpirationInSeconds(),
      refreshTokenExpiresIn: this.tokenProvider.getRefreshExpirationInSeconds(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      },
      permissions: permissionCodes,
    };
  }
}
