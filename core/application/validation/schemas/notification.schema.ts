import * as z from 'zod';

import { messages } from '../messages';

export const notificationSchema = z.object({
  patientId: z.string().nonempty(messages.REQUIRED_FIELD('Paciente')),
  sinan: z.string().nonempty(messages.REQUIRED_FIELD('SINAN')),
  observations: z.string().optional(),
});

export type CreateNotificationInput = z.infer<typeof notificationSchema>;
export type UpdateNotificationInput = Partial<CreateNotificationInput>;
