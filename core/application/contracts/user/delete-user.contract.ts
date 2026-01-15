export interface DeleteUserInput {
  id: string;
  deletedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type DeleteUserOutput = void;
