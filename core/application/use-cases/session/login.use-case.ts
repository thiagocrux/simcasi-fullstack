import { UnauthorizedError } from '@/core/domain/errors/app.error';
import { HashProvider } from '@/core/domain/providers/hash.provider';
import { TokenProvider } from '@/core/domain/providers/token.provider';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import { LoginInput } from '../../contracts/session/login.contract';
import { SessionOutput } from '../../contracts/session/session-output.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to authenticate an user and generate tokens.
 */
export class LoginUseCase implements UseCase<LoginInput, SessionOutput> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly hashProvider: HashProvider,
    private readonly tokenProvider: TokenProvider
  ) {}

  async execute(input: LoginInput): Promise<SessionOutput> {
    // 1. Find user by email.
    const user = await this.userRepository.findByEmail(input.email);
    if (!user || user.deletedAt) {
      throw new UnauthorizedError('Invalid credentials.');
    }

    // 2. Validate password.
    if (!user.password) {
      throw new UnauthorizedError('Invalid credentials.');
    }
    const isPasswordValid = await this.hashProvider.compare(
      input.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials.');
    }

    // 3. Create session in database.
    const session = await this.sessionRepository.create({
      userId: user.id,
      issuedAt: new Date(),
      expiresAt: this.tokenProvider.getRefreshExpiryDate(),
      ipAddress: input.ipAddress || 'unknown',
      userAgent: input.userAgent || 'unknown',
    });

    // 4. Generate tokens including Session ID (sid).
    const accessToken = await this.tokenProvider.generateAccessToken({
      sub: user.id,
      roleId: user.roleId,
      sid: session.id,
    });
    const refreshToken = await this.tokenProvider.generateRefreshToken({
      sub: user.id,
      sid: session.id,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      },
    };
  }
}
