import { NotFoundError } from '@/core/domain/errors/app.error';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import {
  DeleteRoleInput,
  DeleteRoleOutput,
} from '../../contracts/role/delete-role.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to soft delete a role.
 */
export class DeleteRoleUseCase implements UseCase<
  DeleteRoleInput,
  DeleteRoleOutput
> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(input: DeleteRoleInput): Promise<DeleteRoleOutput> {
    // 1. Check if the role exists.
    const role = await this.roleRepository.findById(input.id);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    // 2. Soft delete the role.
    await this.roleRepository.softDelete(input.id);
  }
}
