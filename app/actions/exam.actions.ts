'use server';

import { IdSchema } from '@/core/domain/validation/schemas/common.schema';
import { mockApiCall } from '@/lib/mock';

import {
  CreateExamInput,
  UpdateExamInput,
  examSchema,
} from '@/core/domain/validation/schemas/exam.schema';

export async function getAllExams() {
  try {
    // TODO: Replace with the real request and increment logic if needed.
    const response = await mockApiCall();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, ...error.response?.data.error };
  }
}

export async function getExam(id: string) {
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

export async function createExam(input: CreateExamInput) {
  try {
    const parsed = examSchema.safeParse({
      treponemalTestType: input.treponemalTestType,
      treponemalTestResult: input.treponemalTestResult,
      treponemalTestDate: input.treponemalTestDate,
      treponemalTestLocation: input.treponemalTestLocation,
      nontreponemalVdrlTest: input.nontreponemalVdrlTest,
      nontreponemalTestTitration: input.nontreponemalTestTitration,
      nontreponemalTestDate: input.nontreponemalTestDate,
      otherNontreponemalTest: input.otherNontreponemalTest,
      otherNontreponemalTestDate: input.otherNontreponemalTestDate,
      referenceObservations: input.referenceObservations,
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

export async function updateExam(input: UpdateExamInput) {
  try {
    const parsed = examSchema.safeParse({
      treponemalTestType: input.treponemalTestType,
      treponemalTestResult: input.treponemalTestResult,
      treponemalTestDate: input.treponemalTestDate,
      treponemalTestLocation: input.treponemalTestLocation,
      nontreponemalVdrlTest: input.nontreponemalVdrlTest,
      nontreponemalTestTitration: input.nontreponemalTestTitration,
      nontreponemalTestDate: input.nontreponemalTestDate,
      otherNontreponemalTest: input.otherNontreponemalTest,
      otherNontreponemalTestDate: input.otherNontreponemalTestDate,
      referenceObservations: input.referenceObservations,
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

export async function deleteExam(id: string) {
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
