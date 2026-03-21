/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { cookies } from 'next/headers';

import { FindSessionsOutput } from '@/core/application/contracts/session/find-sessions.contract';
import { GetSessionByIdOutput } from '@/core/application/contracts/session/get-session-by-id.contract';
import { RevokeAllSessionsOutput } from '@/core/application/contracts/session/revoke-all-sessions.contract';
import { RevokeSessionOutput } from '@/core/application/contracts/session/revoke-session.contract';
import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreateSessionInput,
  RequestPasswordResetInput,
  RequestPasswordResetSchema,
  ResetPasswordInput,
  resetPasswordSchema,
  SessionQueryInput,
  sessionQuerySchema,
  sessionSchema,
} from '@/core/application/validation/schemas/session.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { ValidationError } from '@/core/domain/errors/app.error';
import { makeTokenProvider } from '@/core/infrastructure/factories/security.factory';
import {
  makeFindSessionsUseCase,
  makeGetSessionByIdUseCase,
  makeLoginUseCase,
  makeLogoutUseCase,
  makeRevokeAllSessionsUseCase,
  makeRevokeSessionUseCase,
  makeValidateSessionUseCase,
} from '@/core/infrastructure/factories/session.factory';
import {
  makeRequestPasswordResetUseCase,
  makeResetPasswordUseCase,
} from '@/core/infrastructure/factories/user.factory';
import { env } from '@/core/infrastructure/lib/env.config';
import { requestContextStore } from '@/core/infrastructure/lib/request-context';
import {
  ActionResponse,
  getAuditMetadata,
  handleActionError,
  withSecuredActionAndAutomaticRetry,
} from '@/lib/actions.utils';
import { logger } from '@/lib/logger.utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Authenticates a user and establishes a persistent session via cookies.
 * Handles credential validation and token storage.
 * @param input The user's login credentials and session preferences.
 * @return A success object with user and permission data, or an error response.
 */
export async function logInUser(input: CreateSessionInput) {
  try {
    const parsedData = sessionSchema.safeParse(input);
    if (!parsedData.success) {
      return {
        success: false,
        message: 'Credenciais inválidas',
        errors: formatZodError(parsedData.error),
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
      () => useCase.execute(parsedData.data)
    );

    const { accessToken, refreshToken, user, permissions } = result;
    const cookieStore = await cookies();
    const tokenProvider = makeTokenProvider();

    logger.info('User logged in successfully.', {
      action: 'login_action',
    });

    cookieStore.set('access_token', accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: tokenProvider.getAccessExpirationInSeconds(),
    });

    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: input.rememberMe
        ? tokenProvider.getRefreshExpirationInSeconds()
        : undefined,
    });

    logger.success('Tokens issued and session cookies established.', {
      action: 'login_action',
    });

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
export async function logOutUser() {
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

        logger.info('User session revoked from database during logout.', {
          sessionId,
          action: 'logout_action',
        });
      } catch (error: any) {
        logger.warn('Session revocation failed during logout.', {
          cause: 'Could not revoke session in DB, but cookies were cleared.',
          error,
          action: 'logout_action',
        });
      }
    }
    return { success: true };
  } catch (error: any) {
    logger.error('Unexpected error during logout process.', {
      error,
      action: 'logout_action',
    });
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
    const parsedData = RequestPasswordResetSchema.safeParse(input);
    if (!parsedData.success) {
      return {
        success: false,
        message: 'E-mail inválido',
        errors: formatZodError(parsedData.error),
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
      () => useCase.execute({ email: parsedData.data.registeredEmail })
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
    const parsedData = resetPasswordSchema.safeParse(input);
    if (!parsedData.success) {
      return {
        success: false,
        message: 'A redefinição de senha falhou',
        errors: formatZodError(parsedData.error),
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
          token: parsedData.data.token,
          newPassword: parsedData.data.newPassword,
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

/**
 * Retrieves a paginated list of session records with optional filtering.
 * @param query Criteria for filtering and pagination.
 * @return A promise resolving to the sessions and metadata.
 */
export async function findSessions(
  query?: SessionQueryInput
): Promise<ActionResponse<FindSessionsOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:session'], async () => {
    const parsedData = sessionQuerySchema.safeParse(query);
    const useCase = makeFindSessionsUseCase();
    return await useCase.execute(parsedData.data || {});
  });
}

/**
 * Revokes an active session by its unique identifier.
 * If the session being revoked belongs to the currently authenticated user,
 * the auth cookies are cleared and the user is redirected to the login page.
 * @param id The UUID of the session to revoke.
 * @return A promise resolving to a success indicator.
 * @throws ValidationError If the provided ID is invalid.
 */
export async function revokeSession(
  id: string
): Promise<ActionResponse<RevokeSessionOutput>> {
  // Capture the current session ID before execution to detect own-session revocation.
  let currentSessionId: string | null = null;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (token) {
      const validateSessionUseCase = makeValidateSessionUseCase();
      const { sessionId } = await validateSessionUseCase.execute({ token });
      currentSessionId = sessionId;
    }
  } catch {
    // Ignore — if we can't read the current session, own-session detection is skipped.
  }

  const result = await withSecuredActionAndAutomaticRetry(
    ['delete:session'],
    async () => {
      const parsedId = IdSchema.safeParse(id);
      if (!parsedId.success) {
        throw new ValidationError(
          'ID inválido.',
          formatZodError(parsedId.error)
        );
      }

      const useCase = makeRevokeSessionUseCase();
      const revokeResult = await useCase.execute({ id: parsedId.data });

      revalidatePath('/sessions');

      return revokeResult;
    }
  );

  // If the revoked session was the caller's own session, clear cookies and redirect.
  if (result.success && currentSessionId === id) {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    redirect('/auth/login?reason=session_revoked');
  }

  return result;
}

/**
 * Revokes all active sessions belonging to a specific user.
 * If the target user is the currently authenticated user,
 * the auth cookies are cleared and the user is redirected to the login page.
 * @param userId The UUID of the user whose sessions will be revoked.
 * @return A promise resolving to a success indicator.
 * @throws ValidationError If the provided user ID is invalid.
 */
export async function revokeAllSessionsByUserId(
  userId: string
): Promise<ActionResponse<RevokeAllSessionsOutput>> {
  // Capture the current user ID before execution to detect own-account revocation.
  let currentUserId: string | null = null;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (token) {
      const validateSessionUseCase = makeValidateSessionUseCase();
      const { userId: uid } = await validateSessionUseCase.execute({ token });
      currentUserId = uid;
    }
  } catch {
    // Ignore — if we can't read the current session, own-account detection is skipped.
  }

  const parsedId = IdSchema.safeParse(userId);
  if (!parsedId.success) {
    return {
      success: false,
      name: 'ValidationError',
      message: 'ID inválido.',
      code: 'VALIDATION_ERROR',
    };
  }

  const result = await withSecuredActionAndAutomaticRetry(
    ['delete:session'],
    async () => {
      const useCase = makeRevokeAllSessionsUseCase();
      const revokeResult = await useCase.execute({ userId: parsedId.data });

      revalidatePath('/sessions');

      return revokeResult;
    }
  );

  // If the current user revoked their own sessions, clear cookies and redirect.
  if (result.success && currentUserId === userId) {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    redirect('/auth/login?reason=all_sessions_revoked');
  }

  return result;
}

/**
 * Retrieves a single session record by its unique identifier.
 * @param id The UUID of the session to retrieve.
 * @return A promise resolving to the session data.
 * @throws ValidationError If the provided ID is invalid.
 */
export async function getSession(
  id: string
): Promise<ActionResponse<GetSessionByIdOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:session'], async () => {
    const parsedId = IdSchema.safeParse(id);
    if (!parsedId.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsedId.error));
    }

    const useCase = makeGetSessionByIdUseCase();
    return await useCase.execute({ id: parsedId.data });
  });
}
