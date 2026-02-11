import { ForbiddenError } from '@/core/domain/errors/app.error';
import { makeValidatePermissionsUseCase } from '../factories/permission.factory';

/**
 * Checks if a specific role has the specified permission.
 *
 * @param roleId The unique identifier of the role to check.
 * @param permissionCode The code representing the permission (e.g., 'create:patient').
 * @return A promise that resolves to true if the role has the permission, false otherwise.
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
 * Authorizes a role by ensuring it has at least one of the required permissions.
 *
 * If the `requiredPermissions` array is empty, the authorization check is skipped.
 *
 * @param roleId The unique identifier of the role to authorize.
 * @param requiredPermissions An array of permission codes required for the action.
 * @return A promise that resolves if the role is authorized.
 * @throws {ForbiddenError} If the role does not have any of the required permissions.
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
