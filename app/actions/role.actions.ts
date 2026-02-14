'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreateRoleInput,
  RoleQueryInput,
  UpdateRoleInput,
  roleQuerySchema,
  roleSchema,
} from '@/core/application/validation/schemas/role.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { ValidationError } from '@/core/domain/errors/app.error';
import {
  makeDeleteRoleUseCase,
  makeFindRolesUseCase,
  makeGetRoleByIdUseCase,
  makeRegisterRoleUseCase,
  makeRestoreRoleUseCase,
  makeUpdateRoleUseCase,
} from '@/core/infrastructure/factories/role.factory';
import { withSecuredActionAndAutomaticRetry } from '@/lib/actions.utils';

/**
 * Retrieves a paginated list of role records with optional filtering.
 * Useful for administrative views and role selection components.
 * @param query Criteria for filtering and pagination.
 * @return A promise resolving to the list of roles and metadata.
 */
export async function findRoles(query?: RoleQueryInput) {
  return withSecuredActionAndAutomaticRetry(['read:role'], async () => {
    const parsed = roleQuerySchema.safeParse(query);
    const useCase = makeFindRolesUseCase();
    return await useCase.execute(parsed.data || {});
  });
}

/**
 * Retrieves a single role record by its unique identifier.
 * @param id The UUID of the role.
 * @return A promise resolving to the role data.
 * @throws ValidationError If the ID is invalid.
 */
export async function getRole(id: string) {
  return withSecuredActionAndAutomaticRetry(['read:role'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsed.error));
    }

    const useCase = makeGetRoleByIdUseCase();
    return await useCase.execute({ id: parsed.data });
  });
}

/**
 * Registers a new role record in the system.
 * Handles automatic restoration if the role code was previously soft-deleted.
 * @param input The role name and associated permission slugs.
 * @return A promise resolving to the created/restored role.
 * @throws ValidationError If the role data is invalid.
 */
export async function createRole(input: CreateRoleInput) {
  return withSecuredActionAndAutomaticRetry(
    ['create:role'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = roleSchema.safeParse(input);
      if (!parsed.success) {
        throw new ValidationError(
          'Dados do cargo inválidos',
          formatZodError(parsed.error)
        );
      }

      const useCase = makeRegisterRoleUseCase();
      const role = await useCase.execute({
        ...parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/roles');
      return role;
    }
  );
}

/**
 * Updates an existing role record.
 * @param id The UUID of the role to update.
 * @param input The partial fields to update.
 * @return A promise resolving to the updated role.
 * @throws ValidationError If the update data or ID is invalid.
 */
export async function updateRole(id: string, input: UpdateRoleInput) {
  return withSecuredActionAndAutomaticRetry(
    ['update:role'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsedId = IdSchema.safeParse(id);
      const parsedData = roleSchema.partial().safeParse(input);
      if (!parsedId.success) {
        throw new ValidationError(
          'ID inválido.',
          formatZodError(parsedId.error)
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados de atualização inválidos',
          formatZodError(parsedData.error)
        );
      }

      const useCase = makeUpdateRoleUseCase();
      const role = await useCase.execute({
        id: parsedId.data,
        ...parsedData.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/roles');
      return role;
    }
  );
}

/**
 * Performs a soft delete on a role record.
 * @param id The UUID of the role to delete.
 * @return A promise resolving to void.
 * @throws ValidationError If the ID is invalid.
 */
export async function deleteRole(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['delete:role'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = IdSchema.safeParse(id);
      if (!parsed.success) {
        throw new ValidationError('ID inválido.', formatZodError(parsed.error));
      }

      const useCase = makeDeleteRoleUseCase();
      await useCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/roles');
    }
  );
}

/**
 * Restores a previously soft-deleted role record.
 * @param id The UUID of the role to restore.
 * @return A promise resolving to void.
 * @throws ValidationError If the ID is invalid.
 */
export async function restoreRole(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['update:role'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = IdSchema.safeParse(id);
      if (!parsed.success) {
        throw new ValidationError('ID inválido.', formatZodError(parsed.error));
      }

      const useCase = makeRestoreRoleUseCase();
      await useCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      revalidatePath('/roles');
    }
  );
}
