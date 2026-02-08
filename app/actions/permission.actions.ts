'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreatePermissionInput,
  PermissionQueryInput,
  UpdatePermissionInput,
  permissionQuerySchema,
  permissionSchema,
} from '@/core/application/validation/schemas/permission.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { ValidationError } from '@/core/domain/errors/app.error';
import {
  makeDeletePermissionUseCase,
  makeFindPermissionsUseCase,
  makeGetPermissionByIdUseCase,
  makeRegisterPermissionUseCase,
  makeRestorePermissionUseCase,
  makeUpdatePermissionUseCase,
} from '@/core/infrastructure/factories/permission.factory';
import { withSecuredActionAndAutomaticRetry } from '@/lib/actions.utils';

/**
 * Fetch a paginated list of all permissions available in the system.
 */
export async function findPermissions(query?: PermissionQueryInput) {
  return withSecuredActionAndAutomaticRetry(['read:permission'], async () => {
    const parsed = permissionQuerySchema.safeParse(query);
    const useCase = makeFindPermissionsUseCase();
    return await useCase.execute(parsed.data || {});
  });
}

/**
 * Retrieve detailed information about a single permission by its unique ID.
 */
export async function getPermission(id: string) {
  return withSecuredActionAndAutomaticRetry(['read:permission'], async () => {
    const parsed = IdSchema.safeParse(id);

    if (!parsed.success) {
      throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
    }

    const useCase = makeGetPermissionByIdUseCase();
    return await useCase.execute({ id: parsed.data });
  });
}

/**
 * Register a new permission in the system.
 * Handles automatic restoration if the permission code was previously soft-deleted.
 */
export async function createPermission(input: CreatePermissionInput) {
  return withSecuredActionAndAutomaticRetry(
    ['create:permission'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = permissionSchema.safeParse(input);

      if (!parsed.success) {
        throw new ValidationError(
          'Dados da permissão inválidos',
          formatZodError(parsed.error)
        );
      }

      const useCase = makeRegisterPermissionUseCase();
      const permission = await useCase.execute({
        ...parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/permissions');
      return permission;
    }
  );
}

/**
 * Update an existing permission's code or its associated roles.
 */
export async function updatePermission(
  id: string,
  input: UpdatePermissionInput
) {
  return withSecuredActionAndAutomaticRetry(
    ['update:permission'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsedId = IdSchema.safeParse(id);
      const parsedData = permissionSchema.partial().safeParse(input);

      if (!parsedId.success) {
        throw new ValidationError(
          'Invalid ID.',
          formatZodError(parsedId.error)
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados de atualização inválidos',
          formatZodError(parsedData.error)
        );
      }

      const useCase = makeUpdatePermissionUseCase();
      const permission = await useCase.execute({
        id: parsedId.data,
        ...parsedData.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/permissions');
      return permission;
    }
  );
}

/**
 * Delete a permission record (soft-delete).
 */
export async function deletePermission(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['delete:permission'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = IdSchema.safeParse(id);

      if (!parsed.success) {
        throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
      }

      const useCase = makeDeletePermissionUseCase();
      await useCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/permissions');
    }
  );
}

/**
 * Restore a previously soft-deleted permission back to its active state.
 */
export async function restorePermission(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['update:permission'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = IdSchema.safeParse(id);

      if (!parsed.success) {
        throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
      }

      const useCase = makeRestorePermissionUseCase();
      await useCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/permissions');
    }
  );
}
