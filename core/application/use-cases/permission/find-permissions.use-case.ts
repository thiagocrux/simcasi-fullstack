import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import {
  FindPermissionsInput,
  FindPermissionsOutput,
} from '../../contracts/permission/find-permissions.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to find permissions with pagination and search.
 */
export class FindPermissionsUseCase implements UseCase<
  FindPermissionsInput,
  FindPermissionsOutput
> {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async execute(input: FindPermissionsInput): Promise<FindPermissionsOutput> {
    // 1. Find all permissions based on input criteria.
    return this.permissionRepository.findAll(input);
  }
}
