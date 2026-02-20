/** Input parameters for validating permissions. */
export interface ValidatePermissionsInput {
  /** The ID of the role to check. */
  roleId: string;
  /** List of permission codes required. */
  requiredPermissions: string[];
}

/** Output of the validate permissions operation. */
export interface ValidatePermissionsOutput {
  /** Whether the role has all required permissions. */
  isAuthorized: boolean;
}
