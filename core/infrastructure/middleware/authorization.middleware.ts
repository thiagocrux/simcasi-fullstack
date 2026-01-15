import { ForbiddenError } from '@/core/domain/errors/app.error';
import { makeValidatePermissionsUseCase } from '../factories/permission.factory';

/**
 * Checks if a specific role has a permission.
 * @param roleId The ID of the role.
 * @param permissionCode The code of the permission (e.g., 'create:patient').
 * @returns True if the role has the permission, false otherwise.
 */
export async function checkPermission(
  roleId: string,
  permissionCode: string
): Promise<boolean> {
  const validatePermissions = makeValidatePermissionsUseCase();
  const { isAuthorized } = await validatePermissions.execute({
    roleId,
    requiredPermissions: [permissionCode],
  });

  return isAuthorized;
}

/**
 * Ensures the user has at least one of the required permissions.
 */
export async function authorize(
  roleId: string,
  requiredPermissions: string[]
): Promise<void> {
  // If no permissions required, skip
  if (requiredPermissions.length === 0) return;

  const validatePermissions = makeValidatePermissionsUseCase();
  const { isAuthorized } = await validatePermissions.execute({
    roleId,
    requiredPermissions,
  });

  if (!isAuthorized) {
    throw new ForbiddenError(
      'You do not have permission to perform this action.'
    );
  }
}
