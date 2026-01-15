import { ConflictError } from '@/core/domain/errors/app.error';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import {
  RegisterPermissionInput,
  RegisterPermissionOutput,
} from '../../contracts/permission/register-permission.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new permission.
 */
export class RegisterPermissionUseCase implements UseCase<
  RegisterPermissionInput,
  RegisterPermissionOutput
> {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(
    input: RegisterPermissionInput
  ): Promise<RegisterPermissionOutput> {
    // 1. Check if the permission code already exists.
    const permissionExists = await this.permissionRepository.findByCode(
      input.code
    );
    if (permissionExists) {
      throw new ConflictError('Permission code already exists');
    }

    // 2. Delegate to the repository (handles restoration if the code was soft-deleted).
    return this.permissionRepository.create(input);
  }
}
