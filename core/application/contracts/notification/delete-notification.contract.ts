export interface DeleteNotificationInput {
  id: string;
  deletedBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type DeleteNotificationOutput = void;
