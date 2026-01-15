import { NotFoundError } from '@/core/domain/errors/app.error';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import {
  GetRoleByIdInput,
  GetRoleByIdOutput,
} from '../../contracts/role/get-role-by-id.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve a role by ID.
 */
export class GetRoleByIdUseCase implements UseCase<
  GetRoleByIdInput,
  GetRoleByIdOutput
> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(input: GetRoleByIdInput): Promise<GetRoleByIdOutput> {
    // 1. Find the role by ID.
    const role = await this.roleRepository.findById(input.id);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    return role;
  }
}
