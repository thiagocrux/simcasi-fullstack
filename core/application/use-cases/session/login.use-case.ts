import {
  NotFoundError,
  UnauthorizedError,
} from '@/core/domain/errors/app.error';
import { HashProvider } from '@/core/domain/providers/hash.provider';
import { TokenProvider } from '@/core/domain/providers/token.provider';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import { LoginInput } from '../../contracts/session/login.contract';
import { SessionOutput } from '../../contracts/session/session-output.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to authenticate an user and generate tokens.
 */
export class LoginUseCase implements UseCase<LoginInput, SessionOutput> {
  /**
   * Initializes a new instance of the LoginUseCase class.
   *
   * @param userRepository The repository for user details.
   * @param sessionRepository The repository for session persistence.
   * @param roleRepository The repository for role data operations.
   * @param permissionRepository The repository for permission mapping.
   * @param hashProvider The provider for password hashing and comparison.
   * @param tokenProvider The provider for token generation and validation.
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly hashProvider: HashProvider,
    private readonly tokenProvider: TokenProvider
  ) {}

  /**
   * Executes the use case to authenticate a user.
   *
   * @param input The user credentials and context info.
   * @return A promise that resolves to the authentication tokens and user info.
   * @throws {UnauthorizedError} If the credentials are invalid or user is inactive.
   */
  async execute(input: LoginInput): Promise<SessionOutput> {
    // 1. Find user by email.
    const user = await this.userRepository.findByEmail(input.email);
    if (!user || user.deletedAt || user.isSystem) {
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

    // 4. Fetch permissions and role code for the user.
    const [permissions, role] = await Promise.all([
      this.permissionRepository.findByRoleId(user.roleId),
      this.roleRepository.findById(user.roleId),
    ]);

    if (!role) {
      throw new NotFoundError('Role not found for user.');
    }

    const permissionCodes = permissions.map((permission) => permission.code);

    // 5. Generate tokens including session ID (sid) and role code.
    const accessToken = await this.tokenProvider.generateAccessToken({
      sub: user.id,
      roleId: user.roleId,
      roleCode: role.code,
      sid: session.id,
    });
    const refreshToken = await this.tokenProvider.generateRefreshToken({
      sub: user.id,
      sid: session.id,
      rememberMe: input.rememberMe,
    });

    return {
      accessToken,
      refreshToken,
      rememberMe: input.rememberMe,
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
