import { ConflictError, NotFoundError } from '@/core/domain/errors/app.error';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import {
  UpdateRoleInput,
  UpdateRoleOutput,
} from '../../contracts/role/update-role.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to update an existing role.
 */
export class UpdateRoleUseCase implements UseCase<
  UpdateRoleInput,
  UpdateRoleOutput
> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(input: UpdateRoleInput): Promise<UpdateRoleOutput> {
    const { id, ...data } = input;

    // 1. Check if the role exists.
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    // 2. Check for duplicate code if it is being changed.
    if (data.code) {
      const roleWithCode = await this.roleRepository.findByCode(data.code);
      if (roleWithCode && roleWithCode.id !== id) {
        throw new ConflictError('Role code already exists');
      }
    }

    // 3. Update the role.
    return this.roleRepository.update(id, data);
  }
}
