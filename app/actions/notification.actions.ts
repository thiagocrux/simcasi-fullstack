'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreateNotificationInput,
  NotificationQueryInput,
  UpdateNotificationInput,
  notificationQuerySchema,
  notificationSchema,
} from '@/core/application/validation/schemas/notification.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { ValidationError } from '@/core/domain/errors/app.error';
import {
  makeDeleteNotificationUseCase,
  makeFindNotificationsUseCase,
  makeGetNotificationByIdUseCase,
  makeRegisterNotificationUseCase,
  makeUpdateNotificationUseCase,
} from '@/core/infrastructure/factories/notification.factory';
import { withSecuredActionAndAutomaticRetry } from '@/lib/actions.utils';

/**
 * Retrieves a paginated list of notification records with optional filtering.
 * @param query Optional filtering and pagination criteria for notifications.
 * @return A promise resolving to the list of notifications and metadata.
 */
export async function findNotifications(query?: NotificationQueryInput) {
  return withSecuredActionAndAutomaticRetry(['read:notification'], async () => {
    const parsed = notificationQuerySchema.safeParse(query);
    const findNotificationsUseCase = makeFindNotificationsUseCase();
    return await findNotificationsUseCase.execute(parsed.data || {});
  });
}

/**
 * Retrieves a single notification record by its unique identifier.
 * @param id The UUID of the notification.
 * @return A promise resolving to the notification details.
 * @throws ValidationError If the ID format is invalid.
 */
export async function getNotification(id: string) {
  return withSecuredActionAndAutomaticRetry(['read:notification'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
    }

    const getNotificationByIdUseCase = makeGetNotificationByIdUseCase();
    return await getNotificationByIdUseCase.execute({
      id: parsed.data,
    });
  });
}

/**
 * Registers a new notification record in the system.
 * Records a state-mandated health notification (SINAN) for a case.
 * @param input The epidemiological notification data.
 * @return A promise resolving to the created notification record.
 * @throws ValidationError If notification data violates validation rules.
 */
export async function createNotification(input: CreateNotificationInput) {
  return withSecuredActionAndAutomaticRetry(
    ['create:notification'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = notificationSchema.safeParse(input);
      if (!parsed.success) {
        throw new ValidationError(
          'Dados da notificação inválidos',
          formatZodError(parsed.error)
        );
      }

      const registerNotificationUseCase = makeRegisterNotificationUseCase();
      const notification = await registerNotificationUseCase.execute({
        ...parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath(`/patients/${input.patientId}/notifications`);
      revalidatePath('/notifications');

      return notification;
    }
  );
}

/**
 * Updates an existing notification record.
 * Primarily used to correct form data or add supplemental epidemiological information.
 * @param id The UUID of the notification to update.
 * @param input The updated notification fields.
 * @return A promise resolving to the updated notification.
 * @throws ValidationError If the update data is invalid.
 */
export async function updateNotification(
  id: string,
  input: UpdateNotificationInput
) {
  return withSecuredActionAndAutomaticRetry(
    ['update:notification'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsedId = IdSchema.safeParse(id);
      const parsedData = notificationSchema.partial().safeParse(input);
      if (!parsedId.success) {
        throw new ValidationError(
          'Invalid ID.',
          formatZodError(parsedId.error)
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados da notificação inválidos',
          formatZodError(parsedData.error)
        );
      }

      const updateNotificationUseCase = makeUpdateNotificationUseCase();
      const notification = await updateNotificationUseCase.execute({
        ...parsedData.data,
        id: parsedId.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/notifications');

      return notification;
    }
  );
}

/**
 * Performs a soft delete on a notification record.
 * @param id The UUID of the notification to delete.
 * @return A success object upon completion.
 * @throws ValidationError If the ID is invalid.
 */
export async function deleteNotification(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['delete:notification'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = IdSchema.safeParse(id);
      if (!parsed.success) {
        throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
      }

      const deleteNotificationUseCase = makeDeleteNotificationUseCase();
      await deleteNotificationUseCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/notifications');

      return { success: true };
    }
  );
}
