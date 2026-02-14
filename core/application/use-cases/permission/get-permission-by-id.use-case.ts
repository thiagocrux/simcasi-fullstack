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
  /**
   * Initializes a new instance of the GetPermissionByIdUseCase class.
   *
   * @param permissionRepository The repository for permission persistence.
   */
  constructor(private readonly permissionRepository: PermissionRepository) {}

  /**
   * Executes the use case to get a permission by its ID.
   *
   * @param input The data containing the permission ID.
   * @return A promise that resolves to the found permission.
   * @throws {NotFoundError} If the permission is not found.
   */
  async execute(
    input: GetPermissionByIdInput
  ): Promise<GetPermissionByIdOutput> {
    // 1. Find the permission by ID.
    const permission = await this.permissionRepository.findById(input.id);
    if (!permission) {
      throw new NotFoundError('Permissão');
    }

    return permission;
  }
}
