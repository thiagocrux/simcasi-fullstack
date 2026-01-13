'use server';

import { RegisterPatientDto } from '@/core/application/dtos/patient/register-patient.dto';
import { RegisterPatientUseCase } from '@/core/application/use-cases/patient/register-patient.use-case';
import { PrismaPatientRepository } from '@/core/infrastructure/repositories/prisma/patient.prisma.repository';
import { revalidatePath } from 'next/cache';

// Usually, you would have a more robust way to handle dependencies (Injectors/Registry),
// but for now, direct instantiation allows us to move fast with the bridge.
const patientRepository = new PrismaPatientRepository();
const registerPatientUseCase = new RegisterPatientUseCase(patientRepository);

/**
 * Server Action to handle patient registration.
 * Bridges the UI with the Application Layer (Use Cases).
 */
export async function registerPatientAction(dto: RegisterPatientDto) {
  try {
    const patient = await registerPatientUseCase.execute(dto);

    // Recalculate the patient list cache
    revalidatePath('/patients');

    return {
      success: true,
      data: patient,
    };
  } catch (error: any) {
    console.error('Action error [registerPatientAction]:', error);
    return {
      success: false,
      error:
        error.message ||
        'An unexpected error occurred while registering the patient.',
    };
  }
}
