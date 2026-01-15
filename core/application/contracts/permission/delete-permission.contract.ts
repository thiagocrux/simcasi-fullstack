export interface DeletePermissionInput {
  id: string;
  deletedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type DeletePermissionOutput = void;
