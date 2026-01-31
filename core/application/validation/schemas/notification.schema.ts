import * as z from 'zod';

import { messages } from '../messages';

/**
 * Main schema for notification entity validation.
 *
 * Defines all required and optional fields for a notification record, including patient, SINAN code, and observations.
 * Used for validating notification creation, update, and form data throughout the application.
 */
export const notificationSchema = z.object({
  patientId: z.string().nonempty(messages.REQUIRED_FIELD('Paciente')),
  sinan: z.string().nonempty(messages.REQUIRED_FIELD('SINAN')),
  observations: z.string().optional(),
});

/**
 * Type for notification creation.
 *
 * - Based on the main schema (`notificationSchema`), including all required fields for creation.
 * - Adds the `createdBy` field to track the author of the creation (auditing and control).
 * - Used in server actions, use cases, and repositories when creating a new notification.
 */
export type CreateNotificationInput = z.infer<typeof notificationSchema> & {
  createdBy: string;
};

/**
 * Type for notification update.
 *
 * - All notification fields are optional (via `Partial`), allowing partial updates.
 * - Adds the `updatedBy` field to track the author of the change (auditing and control).
 * - Used in server actions, use cases, and repositories when updating an existing notification.
 */
export type UpdateNotificationInput = Partial<
  z.infer<typeof notificationSchema>
> & {
  updatedBy: string;
};

/**
 * Type for notification form usage.
 *
 * - Based on the main schema (`notificationSchema`).
 * - Used to type notification creation/edit forms (e.g., with React Hook Form).
 */
export type NotificationFormInput = z.infer<typeof notificationSchema>;
