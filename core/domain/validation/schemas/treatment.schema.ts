import * as z from 'zod';

import { messages } from '../messages';

export const treatmentSchema = z.object({
  medication: z.string().nonempty(messages.REQUIRED_FIELD('Medicação')),
  healthCenter: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Unidade Básica de Saúde')),
  startDate: z.string().nonempty(messages.REQUIRED_FIELD('Data de início')),
  dosage: z.string().nonempty(messages.REQUIRED_FIELD('Dosagem')),
  observations: z.string().optional(),
  partnerInformation: z.string().optional(),
});

export type CreateTreatmentInput = z.infer<typeof treatmentSchema>;
export type UpdateTreatmentInput = Partial<CreateTreatmentInput>;
