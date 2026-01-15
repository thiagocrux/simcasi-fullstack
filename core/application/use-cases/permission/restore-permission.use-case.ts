import { NotFoundError } from '@/core/domain/errors/app.error';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import {
  RestorePermissionInput,
  RestorePermissionOutput,
} from '../../contracts/permission/restore-permission.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a soft-deleted permission.
 */
export class RestorePermissionUseCase implements UseCase<
  RestorePermissionInput,
  RestorePermissionOutput
> {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(
    input: RestorePermissionInput
  ): Promise<RestorePermissionOutput> {
    // 1. Check if the permission exists (including deleted).
    const permission = await this.permissionRepository.findById(input.id, true);
    if (!permission) {
      throw new NotFoundError('Permission not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (permission.deletedAt) {
      await this.permissionRepository.restore(input.id);
    }

    return (await this.permissionRepository.findById(
      input.id
    )) as RestorePermissionOutput;
  }
}
