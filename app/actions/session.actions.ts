/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { formatZodError } from '@/core/application/validation/zod.utils';
import { makeTokenProvider } from '@/core/infrastructure/factories/security.factory';
import {
  makeLoginUseCase,
  makeLogoutUseCase,
  makeValidateSessionUseCase,
} from '@/core/infrastructure/factories/session.factory';
import { getAuditMetadata, handleActionError } from '@/lib/actions.utils';
import { logger } from '@/lib/logger.utils';

export async function signInUser(input: CreateSessionInput) {
  try {
    // 1. Validate form input.
    const parsed = sessionSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message: 'Credenciais inválidas',
        errors: formatZodError(parsed.error),
      };
    }

    // 2. Get audit metadata.
    const { ipAddress, userAgent } = await getAuditMetadata();

    // 3. Initialize use case.
    const loginUseCase = makeLoginUseCase();

    // 4. Execute use case.
    const result = await loginUseCase.execute({
      ...parsed.data,
      ipAddress,
      userAgent,
    });

    const { accessToken, refreshToken, user, permissions } = result;

    // 5. Set authentication cookies.
    const cookieStore = await cookies();
    const tokenProvider = makeTokenProvider();

    logger.info('[AUTH] Login successful. Setting cookies...');

    cookieStore.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: tokenProvider.getAccessExpirationInSeconds(),
    });

    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: input.rememberMe
        ? tokenProvider.getRefreshExpirationInSeconds()
        : undefined,
    });

    logger.success(
      `[AUTH] Cookies set. access_token lifetime: ${
        tokenProvider.getAccessExpirationInSeconds() / 60
      }min`
    );

    // 6. Return success status with data for Redux.
    return {
      success: true,
      data: {
        user,
        permissions,
      },
    };
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function signOutUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    // 1. Delete authentication cookies IMMEDIATELY.
    // This is the most important step for the user.
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    // 2. Effort to invalidate session on the server.
    // We do this inside a try/catch to ensure that ANY error here
    // doesn't stop the user from being logged out on the client.
    if (token) {
      try {
        const validateSessionUseCase = makeValidateSessionUseCase();
        // Here we still try to get the sessionId to clean up the DB.
        // We catch terminal errors since we've already cleared cookies.
        const { sessionId } = await validateSessionUseCase.execute({
          token,
        });

        const logoutUseCase = makeLogoutUseCase();
        await logoutUseCase.execute({ sessionId });

        logger.info(`[AUTH] Session ${sessionId} revoked during logout.`);
      } catch (error: any) {
        // We log it but don't throw, as the cookies are already gone.
        logger.warn(
          '[AUTH] Could not revoke session in DB, but cookies were cleared.',
          error
        );
      }
    }
  } catch (error: any) {
    logger.error('[SIGNOUT_ERROR]', error);
  } finally {
    // 3. Redirect to sign-in page is ALWAYS the final destination.
    redirect('/auth/sign-in');
  }
}

export async function requestNewPassword(input: RequestNewPasswordInput) {
  try {
    const parsed = requestNewPasswordSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, errors: formatZodError(parsed.error) };
    }

    // TODO: Implement new password request logic in a Use Case if available.
    return { success: true };
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function resetPassword(input: ResetPasswordInput) {
  try {
    const parsed = resetPasswordSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, errors: formatZodError(parsed.error) };
    }

    // TODO: Implement password reset logic in a Use Case if available.
    return { success: true };
  } catch (error: any) {
    return handleActionError(error);
  }
}
