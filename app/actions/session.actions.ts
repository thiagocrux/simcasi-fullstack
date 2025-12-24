'use server';

import {
  CreateSessionInput,
  RequestNewPasswordInput,
  ResetPasswordInput,
  resetPasswordSchema,
  sessionSchema,
} from '@/core/domain/validation/schemas/session.schema';

export async function signInUser(input: CreateSessionInput) {
  try {
    const parsed = sessionSchema.safeParse({
      email: input.email ?? '',
      password: input.password ?? '',
    });

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    // TODO: call authentication logic here.
    return { success: true, errors: {} as Record<string, string[]> };
  } catch (error) {
    return { success: false, errors: { _form: ['Erro inesperado.'] } };
  }
}

export async function signOutUser() {
  // TODO: Implement sign out logic here.
}

export async function requestNewPassword(input: RequestNewPasswordInput) {
  try {
    const parsed = sessionSchema.safeParse({
      registeredEmail: input.registeredEmail ?? '',
    });

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    // TODO: Implement new password request logic here.
    return { success: true, errors: {} as Record<string, string[]> };
  } catch (error) {
    return { success: false, errors: { _form: ['Erro inesperado.'] } };
  }
}

export async function resetPassword(input: ResetPasswordInput) {
  try {
    const parsed = resetPasswordSchema.safeParse({
      newPassword: input.newPassword ?? '',
      newPasswordConfirmation: input.newPasswordConfirmation ?? '',
    });

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    // TODO: Implement password reset logic here.
    return { success: true, errors: {} as Record<string, string[]> };
  } catch (error) {
    return { success: false, errors: { _form: ['Erro inesperado.'] } };
  }
}
