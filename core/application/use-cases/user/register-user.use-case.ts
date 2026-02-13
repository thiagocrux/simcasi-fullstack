import { userSchema } from '@/core/application/validation/schemas/user.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/core/domain/errors/app.error';
import { HashProvider } from '@/core/domain/providers/hash.provider';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
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
  /**
   * Creates an instance of RegisterUserUseCase.
   * @param userRepository The repository for user data operations.
   * @param roleRepository The repository for role data operations.
   * @param hashProvider The provider for password hashing.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly hashProvider: HashProvider,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to register a new user.
   * @param input The user data.
   * @return A promise that resolves to the registered user.
   * @throws {ValidationError} If the user data is invalid.
   * @throws {NotFoundError} If the assigned role is not found.
   * @throws {ConflictError} If the email is already in use.
   */
  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const { userId: executorId, ipAddress, userAgent } = getRequestContext();

    // 1. Validate input.
    const validation = userSchema.safeParse(input);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid register user data.',
        formatZodError(validation.error)
      );
    }

    // 2. Check if the role exists.
    const role = await this.roleRepository.findById(input.roleId);
    if (!role) {
      throw new NotFoundError('Role');
    }

    // 3. Check if the email is already in use (by an active user).
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError(`Email ${input.email} is already in use.`);
    }

    // 4. Hash the password.
    const { password, ...userData } = input;
    const hashedPassword = await this.hashProvider.hash(password);

    // 5. Delegate to the repository (handles restoration if the email was soft-deleted).
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      createdBy: executorId,
      updatedBy: null,
    });

    // 6. Create audit log.
    const { password: _, ...userWithoutPassword } = user;
    await this.auditLogRepository.create({
      userId: executorId,
      action: 'CREATE',
      entityName: 'USER',
      entityId: user.id,
      newValues: userWithoutPassword,
      ipAddress,
      userAgent,
    });

    return userWithoutPassword;
  }
}
