import { userSchema } from '@/core/application/validation/schemas/user.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
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
  UpdateUserInput,
  UpdateUserOutput,
} from '../../contracts/user/update-user.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to update user information, including password hashing if provided.
 */
export class UpdateUserUseCase implements UseCase<
  UpdateUserInput,
  UpdateUserOutput
> {
  /**
   * Creates an instance of UpdateUserUseCase.
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
   * Executes the use case to update a user.
   * @param input The user update data and audit info.
   * @return A promise that resolves to the updated user.
   * @throws {ValidationError} If the update data is invalid.
   * @throws {NotFoundError} If the user or role is not found.
   * @throws {ConflictError} If the new email is already in use.
   */
  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const { id, data, userId, ipAddress, userAgent } = input;

    // 1. Validate input.
    const validation = userSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid update user data.',
        formatZodError(validation.error)
      );
    }

    // 2. Check if the user exists.
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('User');
    }

    // 3. Check if the role exists (if provided).
    if (data.roleId) {
      const role = await this.roleRepository.findById(data.roleId);
      if (!role) {
        throw new NotFoundError('Role');
      }
    }

    // 4. Check for duplicates if the email is being changed.
    if (data.email && data.email !== existing.email) {
      const duplicate = await this.userRepository.findByEmail(data.email);
      if (duplicate) {
        throw new ConflictError(`Email ${data.email} is already in use.`);
      }
    }

    // 4. Hash the password if it is being changed.
    const updateData = {
      ...data,
    };
    if (data.password) {
      updateData.password = await this.hashProvider.hash(data.password);
    }

    // 5. Update the user.
    const updatedUser = await this.userRepository.update(
      id,
      updateData,
      userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
    );

    // 6. Create audit log.
    const { password: __, ...oldValuesWithoutPassword } = existing;
    const { password: ___, ...newValuesWithoutPassword } = updatedUser;

    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'UPDATE',
      entityName: 'USER',
      entityId: id,
      oldValues: oldValuesWithoutPassword,
      newValues: newValuesWithoutPassword,
      ipAddress,
      userAgent,
    });

    return newValuesWithoutPassword;
  }
}
