export interface DeleteRoleInput {
  id: string;
  deletedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type DeleteRoleOutput = void;
