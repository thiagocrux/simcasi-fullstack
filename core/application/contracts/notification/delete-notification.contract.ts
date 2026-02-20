/**
 * Input parameters for deleting a notification.
 */
export interface DeleteNotificationInput {
  /** Unique identifier of the notification to be deleted. */
  id: string;
}

/**
 * Output of the notification deletion operation.
 * Always returns void.
 */
export type DeleteNotificationOutput = void;
