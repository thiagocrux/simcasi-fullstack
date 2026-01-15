import { NotFoundError } from '@/core/domain/errors/app.error';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import {
  DeletePermissionInput,
  DeletePermissionOutput,
} from '../../contracts/permission/delete-permission.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to soft delete a permission.
 */
export class DeletePermissionUseCase implements UseCase<
  DeletePermissionInput,
  DeletePermissionOutput
> {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(input: DeletePermissionInput): Promise<DeletePermissionOutput> {
    // 1. Check if the permission exists.
    const permission = await this.permissionRepository.findById(input.id);
    if (!permission) {
      throw new NotFoundError('Permission not found');
    }

    // 2. Soft delete the permission.
    await this.permissionRepository.softDelete(input.id);
  }
}
