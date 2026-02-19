/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { cookies } from 'next/headers';

import {
  CreateSessionInput,
  RequestPasswordResetInput,
  RequestPasswordResetSchema,
  ResetPasswordInput,
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
import {
  makeRequestPasswordResetUseCase,
  makeResetPasswordUseCase,
} from '@/core/infrastructure/factories/user.factory';
import { requestContextStore } from '@/core/infrastructure/lib/request-context';
import { getAuditMetadata, handleActionError } from '@/lib/actions.utils';
import { logger } from '@/lib/logger.utils';

/**
 * Authenticates a user and establishes a persistent session via cookies.
 * Handles credential validation and token storage.
 * @param input The user's login credentials and session preferences.
 * @return A success object with user and permission data, or an error response.
 */
export async function signInUser(input: CreateSessionInput) {
  try {
    const parsed = sessionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: 'Credenciais inválidas',
        errors: formatZodError(parsed.error),
      };
    }

    const { ipAddress, userAgent } = await getAuditMetadata();
    const useCase = makeLoginUseCase();

    // Identity fields are intentionally set to empty strings because the authentication
    // is currently in progress. This ensures the Audit System (via AsyncLocalStorage)
    // has a valid context to record the event, documenting an anonymous or
    // pending-identity operation as required by the system governance.
    const result = await requestContextStore.run(
      {
        userId: '',
        roleId: '',
        roleCode: '',
        ipAddress,
        userAgent,
      },
      () => useCase.execute(parsed.data)
    );

    const { accessToken, refreshToken, user, permissions } = result;
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

/**
 * Terminates the current user session.
 * Clears authentication cookies and attempts to invalidate the session record in the database.
 * @return A promise that resolves to a success indicator.
 */
export async function signOutUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    if (token) {
      try {
        const validateSessionUseCase = makeValidateSessionUseCase();
        const { sessionId } = await validateSessionUseCase.execute({
          token,
        });

        const useCase = makeLogoutUseCase();
        await useCase.execute({ sessionId });

        logger.info(`[AUTH] Session ${sessionId} revoked during logout.`);
      } catch (error: any) {
        logger.warn(
          '[AUTH] Could not revoke session in DB, but cookies were cleared.',
          error
        );
      }
    }
    return { success: true };
  } catch (error: any) {
    logger.error('[SIGNOUT_ERROR]', error);
    return { success: false, error };
  }
}

/**
 * Initiates the password recovery process for a user.
 * @param input The user's identification (e.g., email or username) to request a reset.
 * @return A success indicator or detailed error messages.
 */
export async function requestPasswordReset(input: RequestPasswordResetInput) {
  try {
    const parsed = RequestPasswordResetSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: 'E-mail inválido',
        errors: formatZodError(parsed.error),
      };
    }

    const { ipAddress, userAgent } = await getAuditMetadata();
    const useCase = makeRequestPasswordResetUseCase();

    const response = await requestContextStore.run(
      {
        userId: '',
        roleId: '',
        roleCode: '',
        ipAddress,
        userAgent,
      },
      () => useCase.execute({ email: parsed.data.registeredEmail })
    );

    return { success: true, message: response.message };
  } catch (error: any) {
    return handleActionError(error);
  }
}

/**
 * Completes the password reset process using a recovery token.
 * @param input The new password and the verification token.
 * @return A success indicator or detailed error messages.
 */
export async function resetPassword(input: ResetPasswordInput) {
  try {
    const parsed = resetPasswordSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        message: 'A redefinição de senha falhou',
        errors: formatZodError(parsed.error),
      };
    }

    const { ipAddress, userAgent } = await getAuditMetadata();
    const useCase = makeResetPasswordUseCase();

    await requestContextStore.run(
      {
        userId: '',
        roleId: '',
        roleCode: '',
        ipAddress,
        userAgent,
      },
      () =>
        useCase.execute({
          token: parsed.data.token,
          newPassword: parsed.data.newPassword,
        })
    );

    return {
      success: true,
      message: 'Sua senha foi redefinida com sucesso!',
    };
  } catch (error: any) {
    return handleActionError(error);
  }
}
