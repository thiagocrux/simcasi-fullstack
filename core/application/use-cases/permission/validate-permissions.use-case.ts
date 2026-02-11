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
  /**
   * Initializes a new instance of the ValidatePermissionsUseCase class.
   *
   * @param roleRepository The repository for role and permission validation.
   */
  constructor(private readonly roleRepository: RoleRepository) {}

  /**
   * Executes the use case to validate permissions for a role.
   *
   * @param input The data containing the role ID and required permission codes.
   * @return A promise that resolves to the validation result.
   */
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
