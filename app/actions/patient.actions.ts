'use server';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import { mockApiCall } from '@/lib/mock';

import {
  CreatePatientInput,
  UpdatePatientInput,
  patientSchema,
} from '@/core/application/validation/schemas/patient.schema';

export async function getAllPatients() {
  try {
    // TODO: Replace with the real request and increment logic if needed.
    const response = await mockApiCall();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, ...error.response?.data.error };
  }
}

export async function getPatient(id: string) {
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

export async function createPatient(input: CreatePatientInput) {
  try {
    const parsed = patientSchema.safeParse({
      susCardNumber: input.susCardNumber,
      name: input.name,
      cpf: input.cpf,
      socialName: input.socialName,
      birthDate: input.birthDate,
      race: input.race,
      sex: input.sex,
      gender: input.gender,
      sexuality: input.sexuality,
      nationality: input.nationality,
      schooling: input.schooling,
      phone: input.phone,
      email: input.email,
      motherName: input.motherName,
      fatherName: input.fatherName,
      isDeceased: input.isDeceased,
      monitoringType: input.monitoringType,
      zipCode: input.zipCode,
      state: input.state,
      city: input.city,
      neighborhood: input.neighborhood,
      street: input.street,
      houseNumber: input.houseNumber,
      complement: input.complement,
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

export async function updatePatient(input: UpdatePatientInput) {
  try {
    const parsed = patientSchema.safeParse({
      susCardNumber: input.susCardNumber,
      name: input.name,
      cpf: input.cpf,
      socialName: input.socialName,
      birthDate: input.birthDate,
      race: input.race,
      sex: input.sex,
      gender: input.gender,
      sexuality: input.sexuality,
      nationality: input.nationality,
      schooling: input.schooling,
      phone: input.phone,
      email: input.email,
      motherName: input.motherName,
      fatherName: input.fatherName,
      isDeceased: input.isDeceased,
      monitoringType: input.monitoringType,
      zipCode: input.zipCode,
      state: input.state,
      city: input.city,
      neighborhood: input.neighborhood,
      street: input.street,
      houseNumber: input.houseNumber,
      complement: input.complement,
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

export async function deletePatient(id: string) {
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
