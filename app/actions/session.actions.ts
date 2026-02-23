/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { cookies } from 'next/headers';

import { GetSessionByIdOutput } from '@/core/application/contracts/session/get-session-by-id.contract';
import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreateSessionInput,
  RequestPasswordResetInput,
  RequestPasswordResetSchema,
  ResetPasswordInput,
  resetPasswordSchema,
  sessionSchema,
} from '@/core/application/validation/schemas/session.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { ValidationError } from '@/core/domain/errors/app.error';
import { makeTokenProvider } from '@/core/infrastructure/factories/security.factory';
import {
  makeGetSessionByIdUseCase,
  makeLoginUseCase,
  makeLogoutUseCase,
  makeValidateSessionUseCase,
} from '@/core/infrastructure/factories/session.factory';
import {
  makeRequestPasswordResetUseCase,
  makeResetPasswordUseCase,
} from '@/core/infrastructure/factories/user.factory';
import { requestContextStore } from '@/core/infrastructure/lib/request-context';
import {
  ActionResponse,
  getAuditMetadata,
  handleActionError,
  withSecuredActionAndAutomaticRetry,
} from '@/lib/actions.utils';
import { logger } from '@/lib/logger.utils';

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
