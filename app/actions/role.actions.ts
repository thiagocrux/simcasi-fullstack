'use server';

import { revalidatePath } from 'next/cache';

import {
  IdSchema,
  QueryInput,
  QuerySchema,
} from '@/core/application/validation/schemas/common.schema';
import {
  CreateRoleInputSchema,
  UpdateRoleInputSchema,
  roleSchema,
} from '@/core/application/validation/schemas/role.schema';
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
 * Fetch a paginated list of all roles.
 * Useful for administrative views and role selection components.
 */
export async function findRoles(query?: QueryInput) {
  return withSecuredActionAndAutomaticRetry(['read:role'], async () => {
    const parsed = QuerySchema.safeParse(query);
    const useCase = makeFindRolesUseCase();
    return await useCase.execute(parsed.data || {});
  });
}

/**
 * Retrieve detailed information about a single role by its unique ID.
 */
export async function getRole(id: string) {
  return withSecuredActionAndAutomaticRetry(['read:role'], async () => {
    const parsed = IdSchema.safeParse(id);

    if (!parsed.success) {
      throw new ValidationError(
        'ID inválido',
        parsed.error.flatten().fieldErrors
      );
    }

    const useCase = makeGetRoleByIdUseCase();
    return await useCase.execute({ id: parsed.data });
  });
}

/**
 * Register a new role in the system.
 * This will also handle automatic restoration if the role code was previously soft-deleted.
 */
export async function createRole(input: CreateRoleInputSchema) {
  return withSecuredActionAndAutomaticRetry(
    ['create:role'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = roleSchema.safeParse(input);

      if (!parsed.success) {
        throw new ValidationError(
          'Dados do cargo inválidos',
          parsed.error.flatten().fieldErrors
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
 * Update an existing role's code or its associated permissions.
 */
export async function updateRole(id: string, input: UpdateRoleInputSchema) {
  return withSecuredActionAndAutomaticRetry(
    ['update:role'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsedId = IdSchema.safeParse(id);
      const parsedData = roleSchema.partial().safeParse(input);

      if (!parsedId.success) {
        throw new ValidationError(
          'ID inválido',
          parsedId.error.flatten().fieldErrors
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados de atualização inválidos',
          parsedData.error.flatten().fieldErrors
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
 * Perform a soft delete on a role using its ID.
 */
export async function deleteRole(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['delete:role'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = IdSchema.safeParse(id);

      if (!parsed.success) {
        throw new ValidationError(
          'ID inválido',
          parsed.error.flatten().fieldErrors
        );
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
 * Restore a previously soft-deleted role.
 */
export async function restoreRole(id: string) {
  return withSecuredActionAndAutomaticRetry(
    ['update:role'],
    async ({ userId, ipAddress, userAgent }) => {
      const parsed = IdSchema.safeParse(id);

      if (!parsed.success) {
        throw new ValidationError(
          'ID inválido',
          parsed.error.flatten().fieldErrors
        );
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
