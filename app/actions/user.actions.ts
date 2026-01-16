'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  CreateUserInput,
  UpdateUserInput,
  userSchema,
} from '@/core/application/validation/schemas/user.schema';
import { ValidationError } from '@/core/domain/errors/app.error';
import {
  makeDeleteUserUseCase,
  makeFindUsersUseCase,
  makeGetUserByIdUseCase,
  makeRegisterUserUseCase,
  makeUpdateUserUseCase,
} from '@/core/infrastructure/factories/user.factory';
import { withAuthentication } from '@/lib/action-utils';

export async function getAllUsers() {
  return withAuthentication(['read:user'], async () => {
    // 1. Initialize use case.
    const findUsersUseCase = makeFindUsersUseCase();

    // 2. Execute use case.
    return await findUsersUseCase.execute({});
  });
}

export async function getUser(id: string) {
  return withAuthentication(['read:user'], async () => {
    // 1. Validate ID input.
    const parsed = IdSchema.safeParse(id);

    if (!parsed.success) {
      throw new ValidationError(
        'ID inválido',
        parsed.error.flatten().fieldErrors
      );
    }

    // 2. Initialize use case.
    const getUserByIdUseCase = makeGetUserByIdUseCase();

    // 3. Execute use case.
    return await getUserByIdUseCase.execute({ id: parsed.data });
  });
}

export async function registerUser(input: CreateUserInput) {
  return withAuthentication(
    ['create:user'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate form input.
      const parsed = userSchema.safeParse(input);

      if (!parsed.success) {
        throw new ValidationError(
          'Dados do usuário inválidos',
          parsed.error.flatten().fieldErrors
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

export async function updateUser(id: string, input: UpdateUserInput) {
  return withAuthentication(
    ['update:user'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate form/ID input.
      const parsedId = IdSchema.safeParse(id);
      const parsedData = userSchema.partial().safeParse(input);

      if (!parsedId.success) {
        throw new ValidationError(
          'ID inválido',
          parsedId.error.flatten().fieldErrors
        );
      }

      if (!parsedData.success) {
        throw new ValidationError(
          'Dados do usuário inválidos',
          parsedData.error.flatten().fieldErrors
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

export async function deleteUser(id: string) {
  return withAuthentication(
    ['delete:user'],
    async ({ userId, ipAddress, userAgent }) => {
      // 1. Validate ID input.
      const parsed = IdSchema.safeParse(id);

      if (!parsed.success) {
        throw new ValidationError(
          'ID inválido',
          parsed.error.flatten().fieldErrors
        );
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
