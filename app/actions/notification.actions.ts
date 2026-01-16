'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  makeDeleteNotificationUseCase,
  makeFindNotificationsUseCase,
  makeGetNotificationByIdUseCase,
  makeRegisterNotificationUseCase,
  makeUpdateNotificationUseCase,
} from '@/core/infrastructure/factories/notification.factory';
import { handleActionError, protectAction } from '@/lib/action-utils';

import {
  CreateNotificationInput,
  UpdateNotificationInput,
  notificationSchema,
} from '@/core/application/validation/schemas/notification.schema';

export async function getAllNotifications() {
  try {
    // 1. Protect action with required permissions.
    await protectAction(['read:notification']);

    // 2. Initialize use case.
    const findNotificationsUseCase = makeFindNotificationsUseCase();

    // 3. Execute use case.
    const notifications = await findNotificationsUseCase.execute({});

    // 4. Return success result.
    return { success: true, data: notifications };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function getNotification(id: string) {
  // 1. Validate ID input.
  const parsed = IdSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // 2. Protect action with required permissions.
    await protectAction(['read:notification']);

    // 3. Initialize use case.
    const getNotificationByIdUseCase = makeGetNotificationByIdUseCase();

    // 4. Execute use case.
    const notification = await getNotificationByIdUseCase.execute({
      id: parsed.data,
    });

    // 5. Return success result.
    return { success: true, data: notification };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function createNotification(input: CreateNotificationInput) {
  try {
    // 1. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'create:notification',
    ]);

    // 2. Validate form input.
    const parsed = notificationSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    // 3. Initialize use case.
    const registerNotificationUseCase = makeRegisterNotificationUseCase();

    // 4. Execute use case with audit data.
    const notification = await registerNotificationUseCase.execute({
      ...parsed.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return.
    revalidatePath(`/patients/${input.patientId}/notifications`);
    revalidatePath('/notifications');
    return { success: true, data: notification };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function updateNotification(
  id: string,
  input: UpdateNotificationInput
) {
  try {
    // 1. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'update:notification',
    ]);

    // 2. Validate form/ID input.
    const parsedId = IdSchema.safeParse(id);
    const parsedData = notificationSchema.partial().safeParse(input);

    if (!parsedId.success) {
      return { success: false, errors: parsedId.error.flatten().fieldErrors };
    }

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.flatten().fieldErrors };
    }

    // 3. Initialize use case.
    const updateNotificationUseCase = makeUpdateNotificationUseCase();

    // 4. Execute use case with audit data.
    const notification = await updateNotificationUseCase.execute({
      ...parsedData.data,
      id: parsedId.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return.
    revalidatePath('/notifications');
    return { success: true, data: notification };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function deleteNotification(id: string) {
  // 1. Validate ID input.
  const parsed = IdSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // 2. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'delete:notification',
    ]);

    // 3. Initialize use case.
    const deleteNotificationUseCase = makeDeleteNotificationUseCase();

    // 4. Execute use case with audit data.
    await deleteNotificationUseCase.execute({
      id: parsed.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return result.
    revalidatePath('/notifications');
    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}
