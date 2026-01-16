'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  CreateSessionInput,
  RequestNewPasswordInput,
  ResetPasswordInput,
  requestNewPasswordSchema,
  resetPasswordSchema,
  sessionSchema,
} from '@/core/application/validation/schemas/session.schema';
import {
  makeLoginUseCase,
  makeLogoutUseCase,
  makeValidateSessionUseCase,
} from '@/core/infrastructure/factories/session.factory';
import { getAuditMetadata, handleActionError } from '@/lib/actions.utils';

export async function signInUser(input: CreateSessionInput) {
  try {
    // 1. Validate form input.
    const parsed = sessionSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    // 2. Get audit metadata.
    const { ipAddress, userAgent } = await getAuditMetadata();

    // 3. Initialize use case.
    const loginUseCase = makeLoginUseCase();

    // 4. Execute use case.
    const { accessToken, refreshToken } = await loginUseCase.execute({
      ...parsed.data,
      ipAddress,
      userAgent,
    });

    // 5. Set authentication cookies.
    const cookieStore = await cookies();

    cookieStore.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15, // 15 minutes
    });

    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // 6. Return success status.
    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function signOutUser() {
  try {
    // 1. Access cookie store and get current token.
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    if (token) {
      // 2. Validate token to get session ID.
      const validateSessionUseCase = makeValidateSessionUseCase();
      const { sessionId } = await validateSessionUseCase.execute({ token });

      // 3. Initialize and execute logout use case.
      const logoutUseCase = makeLogoutUseCase();
      await logoutUseCase.execute({ sessionId });
    }

    // 4. Delete authentication cookies.
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('[SIGNOUT_ERROR]', error);
  } finally {
    // 5. Redirect to sign-in page.
    redirect('/auth/sign-in');
  }
}

export async function requestNewPassword(input: RequestNewPasswordInput) {
  try {
    const parsed = requestNewPasswordSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    // TODO: Implement new password request logic in a Use Case if available
    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function resetPassword(input: ResetPasswordInput) {
  try {
    const parsed = resetPasswordSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    // TODO: Implement password reset logic in a Use Case if available
    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}
