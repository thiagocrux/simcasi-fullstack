import { RoleRepository } from '@/core/domain/repositories/role.repository';
import {
  FindRolesInput,
  FindRolesOutput,
} from '../../contracts/role/find-roles.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to find roles with pagination and search.
 */
export class FindRolesUseCase implements UseCase<
  FindRolesInput,
  FindRolesOutput
> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(input: FindRolesInput): Promise<FindRolesOutput> {
    // 1. Find all roles based on input criteria.
    return this.roleRepository.findAll({
      ...input,
    });
  }
}
