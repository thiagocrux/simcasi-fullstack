import { userSchema } from '@/core/application/validation/schemas/user.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '@/core/domain/errors/app.error';
import { HashProvider } from '@/core/domain/providers/hash.provider';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  getRequestContext,
  isUserAdmin,
} from '@/core/infrastructure/lib/request-context';
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
   * @param input The user update data.
   * @return A promise that resolves to the updated user.
   * @throws {ValidationError} If the update data is invalid.
   * @throws {NotFoundError} If the user or role is not found.
   * @throws {ConflictError} If the new email is already in use.
   */
  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const { userId: executorId, ipAddress, userAgent } = getRequestContext();
    const { id, ...data } = input;

    // 1. Validate input.
    const validation = userSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ValidationError(
        'Dados de atualização de usuário inválidos.',
        formatZodError(validation.error)
      );
    }

    // 2. Check if the user exists.
    const targetUser = await this.userRepository.findById(id);
    if (!targetUser) {
      throw new NotFoundError('Usuário');
    }

    // 3. Authorization check.
    const isAdmin = isUserAdmin();
    const isEditingSelf = id === executorId;
    const isChangingRole = data.roleId && data.roleId !== targetUser.roleId;

    if (!isAdmin) {
      // Non-admins can only edit themselves.
      if (!isEditingSelf) {
        throw new ForbiddenError(
          'Você não tem permissão para atualizar as informações de outros usuários.'
        );
      }

      // Non-admins cannot change their own role.
      if (isChangingRole) {
        throw new ForbiddenError(
          'Você não tem permissão para atualizar o seu próprio cargo.'
        );
      }
    }

    // 4. Check if the role exists (if provided and allowed).
    if (data.roleId) {
      const role = await this.roleRepository.findById(data.roleId);
      if (!role) {
        throw new NotFoundError('Cargo');
      }
    }

    // 5. Check for duplicates if the email is being changed.
    if (data.email && data.email !== targetUser.email) {
      const duplicate = await this.userRepository.findByEmail(data.email);
      if (duplicate) {
        throw new ConflictError(
          `O e-mail ${data.email} já se encontra em uso por outro usuário do sistema.`
        );
      }
    }

    // 6. Handle password hashing.
    const updateData = { ...data };
    if (data.password) {
      updateData.password = await this.hashProvider.hash(data.password);
    }

    // 7. Update the user.
    const updatedUser = await this.userRepository.update(
      id,
      updateData,
      executorId
    );

    // 8. Audit logging.
    const { password: _oldValuesPassword, ...oldValuesWithoutPassword } =
      targetUser;
    const { password: _newValuesPassword, ...newValuesWithoutPassword } =
      updatedUser;

    await this.auditLogRepository.create({
      userId: executorId,
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
