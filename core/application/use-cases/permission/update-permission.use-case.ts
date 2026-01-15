import { ConflictError, NotFoundError } from '@/core/domain/errors/app.error';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import {
  UpdatePermissionInput,
  UpdatePermissionOutput,
} from '../../contracts/permission/update-permission.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to update an existing permission.
 */
export class UpdatePermissionUseCase implements UseCase<
  UpdatePermissionInput,
  UpdatePermissionOutput
> {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(input: UpdatePermissionInput): Promise<UpdatePermissionOutput> {
    const { id, ...data } = input;

    // 1. Check if the permission exists.
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new NotFoundError('Permission not found');
    }

    // 2. Check for duplicate code if it is being changed.
    if (data.code) {
      const permissionWithCode = await this.permissionRepository.findByCode(
        data.code
      );
      if (permissionWithCode && permissionWithCode.id !== id) {
        throw new ConflictError('Permission code already exists');
      }
    }

    // 3. Update the permission.
    return this.permissionRepository.update(id, data);
  }
}
