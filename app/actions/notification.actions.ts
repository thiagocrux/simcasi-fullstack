'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreateNotificationInput,
  UpdateNotificationInput,
  notificationSchema,
} from '@/core/application/validation/schemas/notification.schema';
import { ValidationError } from '@/core/domain/errors/app.error';
import {
  makeDeleteNotificationUseCase,
  makeFindNotificationsUseCase,
  makeGetNotificationByIdUseCase,
  makeRegisterNotificationUseCase,
  makeUpdateNotificationUseCase,
} from '@/core/infrastructure/factories/notification.factory';
import { withRefresh } from '@/lib/actions.utils';

export async function getAllNotifications() {
  return withRefresh(['read:notification'], async () => {
    // 1. Initialize use case.
    const findNotificationsUseCase = makeFindNotificationsUseCase();

    // 2. Execute use case.
    return await findNotificationsUseCase.execute({});
  });
}

export async function getNotification(id: string) {
  return withRefresh(['read:notification'], async () => {
    // 1. Validate ID input.
    const parsed = IdSchema.safeParse(id);

    if (!parsed.success) {
      throw new ValidationError(
        'ID inválido',
        parsed.error.flatten().fieldErrors
      );
    }

    // 2. Initialize use case.
    const getNotificationByIdUseCase = makeGetNotificationByIdUseCase();

    // 3. Execute use case.
    return await getNotificationByIdUseCase.execute({
      id: parsed.data,
    });
  });
}

export async function createNotification(input: CreateNotificationInput) {
  return withRefresh(
    ['create:notification'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate form input.
      const parsed = notificationSchema.safeParse(input);

      if (!parsed.success) {
        throw new ValidationError(
          'Dados da notificação inválidos',
          parsed.error.flatten().fieldErrors
        );
      }

      // 2. Initialize use case.
      const registerNotificationUseCase = makeRegisterNotificationUseCase();

      // 3. Execute use case with audit data.
      const notification = await registerNotificationUseCase.execute({
        ...parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath(`/patients/${input.patientId}/notifications`);
      revalidatePath('/notifications');

      return notification;
    }
  );
}

export async function updateNotification(
  id: string,
  input: UpdateNotificationInput
) {
  return withRefresh(
    ['update:notification'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate form/ID input.
      const parsedId = IdSchema.safeParse(id);
      const parsedData = notificationSchema.partial().safeParse(input);

      if (!parsedId.success) {
        throw new ValidationError(
          'ID inválido',
          parsedId.error.flatten().fieldErrors
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados da notificação inválidos',
          parsedData.error.flatten().fieldErrors
        );
      }

      // 2. Initialize use case.
      const updateNotificationUseCase = makeUpdateNotificationUseCase();

      // 3. Execute use case with audit data.
      const notification = await updateNotificationUseCase.execute({
        ...parsedData.data,
        id: parsedId.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath('/notifications');

      return notification;
    }
  );
}

export async function deleteNotification(id: string) {
  return withRefresh(
    ['delete:notification'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate ID input.
      const parsed = IdSchema.safeParse(id);

      if (!parsed.success) {
        throw new ValidationError(
          'ID inválido',
          parsed.error.flatten().fieldErrors
        );
      }

      // 2. Initialize use case.
      const deleteNotificationUseCase = makeDeleteNotificationUseCase();

      // 3. Execute use case with audit data.
      await deleteNotificationUseCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath('/notifications');

      return { success: true };
    }
  );
}
