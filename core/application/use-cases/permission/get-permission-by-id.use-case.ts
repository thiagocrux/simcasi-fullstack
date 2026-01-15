import { NotFoundError } from '@/core/domain/errors/app.error';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import {
  GetPermissionByIdInput,
  GetPermissionByIdOutput,
} from '../../contracts/permission/get-permission-by-id.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve a permission by ID.
 */
export class GetPermissionByIdUseCase implements UseCase<
  GetPermissionByIdInput,
  GetPermissionByIdOutput
> {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(
    input: GetPermissionByIdInput
  ): Promise<GetPermissionByIdOutput> {
    // 1. Find the permission by ID.
    const permission = await this.permissionRepository.findById(input.id);
    if (!permission) {
      throw new NotFoundError('Permission not found');
    }

    return permission;
  }
}
