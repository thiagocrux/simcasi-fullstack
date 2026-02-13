'use server';

import { revalidatePath } from 'next/cache';

import { FindUsersOutput } from '@/core/application/contracts/user/find-users.contract';
import { GetUserOutput } from '@/core/application/contracts/user/get-user-by-id.contract';
import { RegisterUserOutput } from '@/core/application/contracts/user/register-user.contract';
import { UpdateUserOutput } from '@/core/application/contracts/user/update-user.contract';
import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreateUserInput,
  UpdateUserInput,
  UserQueryInput,
  userQuerySchema,
  userSchema,
} from '@/core/application/validation/schemas/user.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { ValidationError } from '@/core/domain/errors/app.error';
import {
  makeDeleteUserUseCase,
  makeFindUsersUseCase,
  makeGetUserByIdUseCase,
  makeRegisterUserUseCase,
  makeUpdateUserUseCase,
} from '@/core/infrastructure/factories/user.factory';
import {
  ActionResponse,
  withSecuredActionAndAutomaticRetry,
} from '@/lib/actions.utils';

/**
 * Retrieves a paginated list of user records with optional filtering.
 * @param query Criteria for filtering and pagination.
 * @return A promise resolving to the list of users and metadata.
 */
export async function findUsers(
  query?: UserQueryInput
): Promise<ActionResponse<FindUsersOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:user'], async () => {
    const parsed = userQuerySchema.safeParse(query);
    const findUsersUseCase = makeFindUsersUseCase();
    return await findUsersUseCase.execute(parsed.data || {});
  });
}

/**
 * Retrieves a single user record by its unique identifier.
 * @param id The UUID of the user.
 * @return A promise resolving to the user profile data.
 * @throws ValidationError If the ID is invalid.
 */
export async function getUser(
  id: string
): Promise<ActionResponse<GetUserOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:user'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
    }

    const getUserByIdUseCase = makeGetUserByIdUseCase();
    return await getUserByIdUseCase.execute({ id: parsed.data });
  });
}

/**
 * Registers a new user record in the system.
 * @param input The user profile and credential data.
 * @return A promise resolving to the created user record.
 * @throws ValidationError If user data is invalid.
 */
export async function createUser(
  input: CreateUserInput
): Promise<ActionResponse<RegisterUserOutput>> {
  return withSecuredActionAndAutomaticRetry(['create:user'], async () => {
    const parsed = userSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(
        'Dados do usuário são inválidos',
        formatZodError(parsed.error)
      );
    }

    const registerUserUseCase = makeRegisterUserUseCase();
    const user = await registerUserUseCase.execute(parsed.data);

    revalidatePath('/users');
    return user;
  });
}

/**
 * Updates an existing user record.
 * @param id The UUID of the user to update.
 * @param input The partial user fields to modify.
 * @return A promise resolving to the updated user record.
 * @throws ValidationError If the update data or ID is invalid.
 */
export async function updateUser(
  id: string,
  input: UpdateUserInput
): Promise<ActionResponse<UpdateUserOutput>> {
  return withSecuredActionAndAutomaticRetry(['update:user'], async () => {
    const parsedId = IdSchema.safeParse(id);
    const parsedData = userSchema.partial().safeParse(input);
    if (!parsedId.success) {
      throw new ValidationError('Invalid ID.', formatZodError(parsedId.error));
    }

    if (!parsedData.success) {
      throw new ValidationError(
        'Dados do usuário são inválidos.',
        formatZodError(parsedData.error)
      );
    }

    const updateUserUseCase = makeUpdateUserUseCase();
    const user = await updateUserUseCase.execute({
      id: parsedId.data,
      data: parsedData.data,
    });

    revalidatePath('/users');
    return user;
  });
}

/**
 * Performs a soft delete on a user record.
 * @param id The UUID of the user to delete.
 * @return A success object upon completion.
 * @throws ValidationError If the ID is invalid.
 */
export async function deleteUser(
  id: string
): Promise<ActionResponse<{ success: boolean }>> {
  return withSecuredActionAndAutomaticRetry(['delete:user'], async () => {
    const parsed = IdSchema.safeParse(id);
    if (!parsed.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsed.error));
    }

    const deleteUserUseCase = makeDeleteUserUseCase();
    await deleteUserUseCase.execute({
      id: parsed.data,
    });

    revalidatePath('/users');
    return { success: true };
  });
}
