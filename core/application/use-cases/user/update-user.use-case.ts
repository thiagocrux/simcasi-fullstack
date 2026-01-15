import { ConflictError, NotFoundError } from '@/core/domain/errors/app.error';
import { HashProvider } from '@/core/domain/providers/hash.provider';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
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
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const { id, data, updatedBy, ipAddress, userAgent } = input;

    // 1. Check if the user exists.
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('User');
    }

    // 2. Check for duplicates if the email is being changed.
    if (data.email && data.email !== existing.email) {
      const duplicate = await this.userRepository.findByEmail(data.email);
      if (duplicate) {
        throw new ConflictError(`Email ${data.email} is already in use.`);
      }
    }

    // 3. Hash the password if it is being changed.
    const updateData = { ...data };
    if (data.password) {
      updateData.password = await this.hashProvider.hash(data.password);
    }

    // 4. Update the user.
    const updatedUser = await this.userRepository.update(id, updateData);

    // 5. Create audit log.
    const { password: __, ...oldValuesWithoutPassword } = existing;
    const { password: ___, ...newValuesWithoutPassword } = updatedUser;

    await this.auditLogRepository.create({
      userId: updatedBy || 'SYSTEM',
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
