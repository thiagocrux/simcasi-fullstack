import * as z from 'zod';

import { messages } from '../messages';

export const observationSchema = z.object({
  patientId: z.string().nonempty(messages.REQUIRED_FIELD('Paciente')),
  observations: z.string().optional(),
  hasPartnerBeingTreated: z.boolean(),
});

export type CreateObservationInput = z.infer<typeof observationSchema>;
export type UpdateObservationInput = Partial<CreateObservationInput>;
