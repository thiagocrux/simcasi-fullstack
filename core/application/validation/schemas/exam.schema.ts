import * as z from 'zod';

import { messages } from '../messages';

export const examSchema = z.object({
  patientId: z.string().nonempty(messages.REQUIRED_FIELD('Paciente')),
  treponemalTestType: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Tipo de teste treponêmico')),
  treponemalTestResult: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Resultado do teste treponêmico')),
  treponemalTestDate: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Data do teste treponêmico')),
  treponemalTestLocation: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Local do teste treponêmico')),
  nontreponemalVdrlTest: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Teste VDRL não treponêmico')),
  nontreponemalTestTitration: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Titulação do teste não treponêmico')),
  nontreponemalTestDate: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Data do teste não treponêmico')),
  otherNontreponemalTest: z.string().optional(),
  otherNontreponemalTestDate: z.string().optional(),
  referenceObservations: z
    .string()
    .nonempty(messages.REQUIRED_FIELD('Observações de referência')),
});

export type CreateExamInput = z.infer<typeof examSchema>;
export type UpdateExamInput = Partial<CreateExamInput>;
