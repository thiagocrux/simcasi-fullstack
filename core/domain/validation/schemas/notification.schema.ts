import * as z from 'zod';

import { messages } from '../messages';

export const createNotificationSchema = z.object({
  sinan: z.string().nonempty(messages.REQUIRED_FIELD('SINAN')),
  observations: z.string().optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = Partial<CreateNotificationInput>;
