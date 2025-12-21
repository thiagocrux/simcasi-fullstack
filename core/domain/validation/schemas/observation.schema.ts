import * as z from 'zod';

export const createObservationSchema = z.object({
  observations: z.string().optional(),
  partnerBeingTreated: z.boolean(),
});

export type CreateObservationInput = z.infer<typeof createObservationSchema>;
export type UpdateObservationInput = Partial<CreateObservationInput>;
