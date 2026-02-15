'use server';

import { revalidatePath } from 'next/cache';

import { DeletePermissionOutput } from '@/core/application/contracts/permission/delete-permission.contract';
import { FindPermissionsOutput } from '@/core/application/contracts/permission/find-permissions.contract';
import { GetPermissionByIdOutput } from '@/core/application/contracts/permission/get-permission-by-id.contract';
import { RegisterPermissionOutput } from '@/core/application/contracts/permission/register-permission.contract';
import { RestorePermissionOutput } from '@/core/application/contracts/permission/restore-permission.contract';
import { UpdatePermissionOutput } from '@/core/application/contracts/permission/update-permission.contract';
import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreatePermissionInput,
  PermissionQueryInput,
  UpdatePermissionInput,
  permissionQuerySchema,
  permissionSchema,
} from '@/core/application/validation/schemas/permission.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import {
  makeDeletePermissionUseCase,
  makeFindPermissionsUseCase,
  makeGetPermissionByIdUseCase,
  makeRegisterPermissionUseCase,
  makeRestorePermissionUseCase,
  makeUpdatePermissionUseCase,
} from '@/core/infrastructure/factories/permission.factory';
import {
  ActionResponse,
  withSecuredActionAndAutomaticRetry,
} from '@/lib/actions.utils';

/**
 * Retrieves a paginated list of permission records with optional filtering.
 * Useful for RBAC (Role-Based Access Control) configuration.
 * @param query Criteria for filtering and pagination.
 * @return A promise resolving to the list of permissions.
 */
export async function findPermissions(
  query?: PermissionQueryInput
): Promise<ActionResponse<FindPermissionsOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:permission'], async () => {
    const parsed = permissionQuerySchema.safeParse(query);
    const useCase = makeFindPermissionsUseCase();
    return await useCase.execute(parsed.data || {});
  });
}

/**
 * Retrieves a single permission record by its unique identifier.
 * @param id The UUID of the permission.
 * @return A promise resolving to the permission data.
 * @throws ValidationError If the ID is invalid.
 */
export async function getPermission(
  id: string
): Promise<ActionResponse<GetPermissionByIdOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:permission'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsed.error));
    }

    const useCase = makeGetPermissionByIdUseCase();
    return await useCase.execute({ id: parsed.data });
  });
}

/**
 * Registers a new permission record in the system.
 * Handles automatic restoration if the permission code was previously soft-deleted.
 * @param input The permission code and resource mapping data.
 * @return A promise resolving to the created/restored permission record.
 * @throws ValidationError If the permission data is invalid.
 */
export async function createPermission(
  input: CreatePermissionInput
): Promise<ActionResponse<RegisterPermissionOutput>> {
  return withSecuredActionAndAutomaticRetry(['create:permission'], async () => {
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
    });

    revalidatePath('/permissions');
    return permission;
  });
}

/**
 * Updates an existing permission record.
 * @param id The UUID of the permission record.
 * @param input The partial update fields.
 * @return A promise resolving to the updated permission.
 * @throws ValidationError If input data or ID is invalid.
 */
export async function updatePermission(
  id: string,
  input: UpdatePermissionInput
): Promise<ActionResponse<UpdatePermissionOutput>> {
  return withSecuredActionAndAutomaticRetry(['update:permission'], async () => {
    const parsedId = IdSchema.safeParse(id);
    const parsedData = permissionSchema.partial().safeParse(input);
    if (!parsedId.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsedId.error));
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
    });

    revalidatePath('/permissions');
    return permission;
  });
}

/**
 * Performs a soft delete on a permission record.
 * @param id The UUID of the permission to delete.
 * @return A promise resolving to void.
 * @throws ValidationError If the ID is invalid.
 */
export async function deletePermission(
  id: string
): Promise<ActionResponse<DeletePermissionOutput>> {
  return withSecuredActionAndAutomaticRetry(['delete:permission'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsed.error));
    }

    const useCase = makeDeletePermissionUseCase();
    await useCase.execute({
      id: parsed.data,
    });

    revalidatePath('/permissions');
  });
}

/**
 * Restores a previously soft-deleted permission record.
 * @param id The UUID of the permission record to restore.
 * @return A promise resolving to void.
 * @throws ValidationError If the ID is invalid.
 */
export async function restorePermission(
  id: string
): Promise<ActionResponse<RestorePermissionOutput>> {
  return withSecuredActionAndAutomaticRetry(['update:permission'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsed.error));
    }

    const useCase = makeRestorePermissionUseCase();
    const permission = await useCase.execute({
      id: parsed.data,
    });

    if (!permission) {
      throw new NotFoundError('Permissão');
    }

    revalidatePath('/permissions');
    return permission;
  });
}
