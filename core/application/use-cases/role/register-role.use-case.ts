import { ConflictError } from '@/core/domain/errors/app.error';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import {
  RegisterRoleInput,
  RegisterRoleOutput,
} from '../../contracts/role/register-role.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new role.
 */
export class RegisterRoleUseCase implements UseCase<
  RegisterRoleInput,
  RegisterRoleOutput
> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(input: RegisterRoleInput): Promise<RegisterRoleOutput> {
    // 1. Check if the role code already exists.
    const roleExists = await this.roleRepository.findByCode(input.code);
    if (roleExists) {
      throw new ConflictError('Role code already exists');
    }

    // 2. Delegate to the repository (handles restoration if the code was soft-deleted).
    return this.roleRepository.create(input);
  }
}
