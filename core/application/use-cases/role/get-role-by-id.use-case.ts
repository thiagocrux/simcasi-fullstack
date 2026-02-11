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
  /**
   * Initializes a new instance of the GetRoleByIdUseCase class.
   *
   * @param roleRepository The repository for role persistence.
   */
  constructor(private readonly roleRepository: RoleRepository) {}

  /**
   * Executes the use case to get a role by its ID.
   *
   * @param input The data containing the role ID.
   * @return A promise that resolves to the found role.
   * @throws {NotFoundError} If the role is not found.
   */
  async execute(input: GetRoleByIdInput): Promise<GetRoleByIdOutput> {
    // 1. Find the role by ID.
    const role = await this.roleRepository.findById(input.id);
    if (!role) {
      throw new NotFoundError('Role not found');
    }

    return role;
  }
}
