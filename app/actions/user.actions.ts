'use server';

import { revalidatePath } from 'next/cache';

import { FindUsersOutput } from '@/core/application/contracts/user/find-users.contract';
import { GetUserOutput } from '@/core/application/contracts/user/get-user-by-id.contract';
import { RegisterUserOutput } from '@/core/application/contracts/user/register-user.contract';
import { UpdateUserOutput } from '@/core/application/contracts/user/update-user.contract';
import {
  IdSchema,
  QueryInput,
  QuerySchema,
} from '@/core/application/validation/schemas/common.schema';
import {
  CreateUserInput,
  UpdateUserInput,
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

export async function findUsers(
  query?: QueryInput & { roleId?: string }
): Promise<ActionResponse<FindUsersOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:user'], async () => {
    // 1. Validate query input.
    const parsed = QuerySchema.extend({
      roleId: IdSchema.optional(),
    }).safeParse(query);

    // 2. Initialize use case.
    const findUsersUseCase = makeFindUsersUseCase();

    // 3. Execute use case.
    return await findUsersUseCase.execute(parsed.data || {});
  });
}

export async function getUser(
  id: string
): Promise<ActionResponse<GetUserOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:user'], async () => {
    // 1. Validate ID input.
    const parsed = IdSchema.safeParse(id);

    if (!parsed.success) {
      throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
    }

    // 2. Initialize use case.
    const getUserByIdUseCase = makeGetUserByIdUseCase();

    // 3. Execute use case.
    return await getUserByIdUseCase.execute({ id: parsed.data });
  });
}

export async function createUser(
  input: CreateUserInput
): Promise<ActionResponse<RegisterUserOutput>> {
  return withSecuredActionAndAutomaticRetry(
    ['create:user'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate form input.
      const parsed = userSchema.safeParse(input);

      if (!parsed.success) {
        throw new ValidationError(
          'Dados do usuário inválidos',
          formatZodError(parsed.error)
        );
      }

      // 2. Initialize use case.
      const registerUserUseCase = makeRegisterUserUseCase();

      // 3. Execute use case with audit data.
      const user = await registerUserUseCase.execute({
        ...parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath('/users');

      return user;
    }
  );
}

export async function updateUser(
  id: string,
  input: UpdateUserInput
): Promise<ActionResponse<UpdateUserOutput>> {
  return withSecuredActionAndAutomaticRetry(
    ['update:user'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate form/ID input.
      const parsedId = IdSchema.safeParse(id);
      const parsedData = userSchema.partial().safeParse(input);

      if (!parsedId.success) {
        throw new ValidationError(
          'Invalid ID.',
          formatZodError(parsedId.error)
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados do usuário inválidos',
          formatZodError(parsedData.error)
        );
      }

      // 2. Initialize use case.
      const updateUserUseCase = makeUpdateUserUseCase();

      // 3. Execute use case with audit data.
      const user = await updateUserUseCase.execute({
        id: parsedId.data,
        data: parsedData.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath('/users');

      return user;
    }
  );
}

export async function deleteUser(
  id: string
): Promise<ActionResponse<{ success: boolean }>> {
  return withSecuredActionAndAutomaticRetry(
    ['delete:user'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate ID input.
      const parsed = IdSchema.safeParse(id);

      if (!parsed.success) {
        throw new ValidationError('Invalid ID.', formatZodError(parsed.error));
      }

      // 2. Initialize use case.
      const deleteUserUseCase = makeDeleteUserUseCase();

      // 3. Execute use case with audit data.
      await deleteUserUseCase.execute({
        id: parsed.data,
        userId,
        ipAddress,
        userAgent,
      });

      // 4. Revalidate cache.
      revalidatePath('/users');

      return { success: true };
    }
  );
}
