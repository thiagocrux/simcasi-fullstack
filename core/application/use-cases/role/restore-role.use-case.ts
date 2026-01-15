import { NotFoundError } from '@/core/domain/errors/app.error';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import {
  RestoreRoleInput,
  RestoreRoleOutput,
} from '../../contracts/role/restore-role.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a soft-deleted role.
 */
export class RestoreRoleUseCase implements UseCase<
  RestoreRoleInput,
  RestoreRoleOutput
> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(input: RestoreRoleInput): Promise<RestoreRoleOutput> {
    // 1. Check if the role exists (including deleted).
    const role = await this.roleRepository.findById(input.id, true);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (role.deletedAt) {
      await this.roleRepository.restore(input.id);
    }

    return (await this.roleRepository.findById(input.id)) as RestoreRoleOutput;
  }
}
