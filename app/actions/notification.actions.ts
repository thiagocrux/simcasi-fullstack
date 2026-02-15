'use server';

import { revalidatePath } from 'next/cache';

import { FindNotificationsOutput } from '@/core/application/contracts/notification/find-notifications.contract';
import { GetNotificationByIdOutput } from '@/core/application/contracts/notification/get-notification-by-id.contract';
import { RegisterNotificationOutput } from '@/core/application/contracts/notification/register-notification.contract';
import { UpdateNotificationOutput } from '@/core/application/contracts/notification/update-notification.contract';
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
import {
  ActionResponse,
  withSecuredActionAndAutomaticRetry,
} from '@/lib/actions.utils';

/**
 * Retrieves a paginated list of notification records with optional filtering.
 * @param query Optional filtering and pagination criteria for notifications.
 * @return A promise resolving to the list of notifications and metadata.
 */
export async function findNotifications(
  query?: NotificationQueryInput
): Promise<ActionResponse<FindNotificationsOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:notification'], async () => {
    const parsed = notificationQuerySchema.safeParse(query);
    const useCase = makeFindNotificationsUseCase();
    return await useCase.execute(parsed.data || {});
  });
}

/**
 * Retrieves a single notification record by its unique identifier.
 * @param id The UUID of the notification.
 * @return A promise resolving to the notification details.
 * @throws ValidationError If the ID format is invalid.
 */
export async function getNotification(
  id: string
): Promise<ActionResponse<GetNotificationByIdOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:notification'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsed.error));
    }

    const useCase = makeGetNotificationByIdUseCase();
    return await useCase.execute({
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
export async function createNotification(
  input: CreateNotificationInput
): Promise<ActionResponse<RegisterNotificationOutput>> {
  return withSecuredActionAndAutomaticRetry(
    ['create:notification'],
    async () => {
      const parsed = notificationSchema.safeParse(input);
      if (!parsed.success) {
        throw new ValidationError(
          'Dados da notificação inválidos',
          formatZodError(parsed.error)
        );
      }

      const useCase = makeRegisterNotificationUseCase();
      const notification = await useCase.execute({
        ...parsed.data,
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
): Promise<ActionResponse<UpdateNotificationOutput>> {
  return withSecuredActionAndAutomaticRetry(
    ['update:notification'],
    async () => {
      const parsedId = IdSchema.safeParse(id);
      const parsedData = notificationSchema.partial().safeParse(input);
      if (!parsedId.success) {
        throw new ValidationError(
          'ID inválido.',
          formatZodError(parsedId.error)
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados da notificação inválidos',
          formatZodError(parsedData.error)
        );
      }

      const useCase = makeUpdateNotificationUseCase();
      const notification = await useCase.execute({
        ...parsedData.data,
        id: parsedId.data,
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
export async function deleteNotification(
  id: string
): Promise<ActionResponse<{ success: boolean }>> {
  return withSecuredActionAndAutomaticRetry(
    ['delete:notification'],
    async () => {
      const parsed = IdSchema.safeParse(id);
      if (!parsed.success) {
        throw new ValidationError('ID inválido.', formatZodError(parsed.error));
      }

      const useCase = makeDeleteNotificationUseCase();
      await useCase.execute({
        id: parsed.data,
      });

      revalidatePath('/notifications');
      return { success: true };
    }
  );
}
