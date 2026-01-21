import { userSchema } from '@/core/application/validation/schemas/user.schema';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@/core/domain/errors/app.error';
import { HashProvider } from '@/core/domain/providers/hash.provider';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
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
    private readonly roleRepository: RoleRepository,
    private readonly hashProvider: HashProvider,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    // 1. Validate input.
    const validation = userSchema.safeParse(input);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid register user data.',
        validation.error.flatten().fieldErrors
      );
    }

    // 2. Check if the role exists.
    const role = await this.roleRepository.findById(input.roleId);
    if (!role) {
      throw new NotFoundError('Role', input.roleId);
    }

    // 3. Check if the email is already in use (by an active user).
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError(`Email ${input.email} is already in use.`);
    }

    // 4. Hash the password.
    const { password, ipAddress, userAgent, userId, ...userData } = input;
    const hashedPassword = await this.hashProvider.hash(password);

    // 5. Delegate to the repository (handles restoration if the email was soft-deleted).
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // 6. Create audit log.
    const { password: _, ...userWithoutPassword } = user;
    await this.auditLogRepository.create({
      userId: userId || 'SYSTEM',
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
