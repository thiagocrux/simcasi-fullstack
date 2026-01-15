export interface ValidatePermissionsInput {
  roleId: string;
  requiredPermissions: string[];
}

export interface ValidatePermissionsOutput {
  isAuthorized: boolean;
}
