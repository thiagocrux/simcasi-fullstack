'use server';

import { IdSchema } from '@/core/domain/validation/schemas/common.schema';
import { mockApiCall } from '@/lib/mock';

import {
  CreateTreatmentInput,
  UpdateTreatmentInput,
  treatmentSchema,
} from '@/core/domain/validation/schemas/treatment.schema';

export async function getAllTreatments() {
  try {
    // TODO: Replace with the real request and increment logic if needed.
    const response = await mockApiCall();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, ...error.response?.data.error };
  }
}

export async function getTreatment(id: string) {
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

export async function createTreatment(input: CreateTreatmentInput) {
  try {
    const parsed = treatmentSchema.safeParse({
      medication: input.medication,
      healthCenter: input.healthCenter,
      startDate: input.startDate,
      dosage: input.dosage,
      observations: input.observations,
      partnerInformation: input.partnerInformation,
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

export async function updateTreatment(input: UpdateTreatmentInput) {
  try {
    const parsed = treatmentSchema.safeParse({
      medication: input.medication,
      healthCenter: input.healthCenter,
      startDate: input.startDate,
      dosage: input.dosage,
      observations: input.observations,
      partnerInformation: input.partnerInformation,
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

export async function deleteTreatment(id: string) {
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
