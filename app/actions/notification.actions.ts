'use server';

import { IdSchema } from '@/core/domain/validation/schemas/common.schema';
import { mockApiCall } from '@/lib/mock';

import {
  CreateNotificationInput,
  UpdateNotificationInput,
  notificationSchema,
} from '@/core/domain/validation/schemas/notification.schema';

export async function getAllNotifications() {
  try {
    // TODO: Replace with the real request and increment logic if needed.
    const response = await mockApiCall();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, ...error.response?.data.error };
  }
}

export async function getNotification(id: string) {
  const parsed = IdSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // TODO: Replace with the real request and increment logic if needed.
    const response = await mockApiCall();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, ...error.response?.data.error };
  }
}

export async function createNotification(input: CreateNotificationInput) {
  try {
    const parsed = notificationSchema.safeParse({
      sinan: input.sinan,
      observations: input.observations,
    });

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    // TODO: Replace with the real request and increment logic if needed.
    const response = await mockApiCall();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, ...error.response?.data.error };
  }
}

export async function updateNotification(input: UpdateNotificationInput) {
  try {
    const parsed = notificationSchema.safeParse({
      sinan: input.sinan,
      observations: input.observations,
    });

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    // TODO: Replace with the real request and increment logic if needed.
    const response = await mockApiCall();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, ...error.response?.data.error };
  }
}

export async function deleteNotification(id: string) {
  const parsed = IdSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // TODO: Replace with the real request and increment logic if needed.
    const response = await mockApiCall();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, ...error.response?.data.error };
  }
}
