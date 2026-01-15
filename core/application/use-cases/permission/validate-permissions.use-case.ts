import { RoleRepository } from '@/core/domain/repositories/role.repository';
import {
  ValidatePermissionsInput,
  ValidatePermissionsOutput,
} from '../../contracts/permission/validate-permissions.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to validate if a role has the required permissions.
 */
export class ValidatePermissionsUseCase implements UseCase<
  ValidatePermissionsInput,
  ValidatePermissionsOutput
> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(
    input: ValidatePermissionsInput
  ): Promise<ValidatePermissionsOutput> {
    const isAuthorized = await this.roleRepository.hasPermissions(
      input.roleId,
      input.requiredPermissions
    );

    return { isAuthorized };
  }
}
