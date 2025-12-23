import * as z from 'zod';

export const observationSchema = z.object({
  observations: z.string().optional(),
  partnerBeingTreated: z.boolean(),
});

export type CreateObservationInput = z.infer<typeof observationSchema>;
export type UpdateObservationInput = Partial<CreateObservationInput>;
