'use server';

import { revalidatePath } from 'next/cache';

import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import {
  makeDeleteUserUseCase,
  makeFindUsersUseCase,
  makeGetUserByIdUseCase,
  makeRegisterUserUseCase,
  makeUpdateUserUseCase,
} from '@/core/infrastructure/factories/user.factory';
import { handleActionError, protectAction } from '@/lib/action-utils';

import {
  CreateUserInput,
  UpdateUserInput,
  userSchema,
} from '@/core/application/validation/schemas/user.schema';

export async function getAllUsers() {
  try {
    // 1. Protect action with required permissions.
    await protectAction(['read:user']);

    // 2. Initialize use case.
    const findUsersUseCase = makeFindUsersUseCase();

    // 3. Execute use case.
    const users = await findUsersUseCase.execute({});

    // 4. Return success result.
    return { success: true, data: users };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function getUser(id: string) {
  // 1. Validate ID input.
  const parsed = IdSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // 2. Protect action with required permissions.
    await protectAction(['read:user']);

    // 3. Initialize use case.
    const getUserByIdUseCase = makeGetUserByIdUseCase();

    // 4. Execute use case.
    const user = await getUserByIdUseCase.execute({ id: parsed.data });

    // 5. Return success result.
    return { success: true, data: user };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function createUser(input: CreateUserInput) {
  try {
    // 1. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'create:user',
    ]);

    // 2. Validate form input.
    const parsed = userSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    // 3. Initialize use case.
    const registerUserUseCase = makeRegisterUserUseCase();

    // 4. Execute use case with audit data.
    const user = await registerUserUseCase.execute({
      ...parsed.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return result.
    revalidatePath('/users');
    return { success: true, data: user };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function updateUser(id: string, input: UpdateUserInput) {
  try {
    // 1. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'update:user',
    ]);

    // 2. Validate form/ID input.
    const parsedId = IdSchema.safeParse(id);
    const parsedData = userSchema.partial().safeParse(input);

    if (!parsedId.success) {
      return { success: false, errors: parsedId.error.flatten().fieldErrors };
    }

    if (!parsedData.success) {
      return { success: false, errors: parsedData.error.flatten().fieldErrors };
    }

    // 3. Initialize use case.
    const updateUserUseCase = makeUpdateUserUseCase();

    // 4. Execute use case with audit data.
    const user = await updateUserUseCase.execute({
      id: parsedId.data,
      data: parsedData.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return result.
    revalidatePath('/users');
    return { success: true, data: user };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}

export async function deleteUser(id: string) {
  // 1. Validate ID input.
  const parsed = IdSchema.safeParse(id);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // 2. Protect action and get audit metadata.
    const { userId, ipAddress, userAgent } = await protectAction([
      'delete:user',
    ]);

    // 3. Initialize use case.
    const deleteUserUseCase = makeDeleteUserUseCase();

    // 4. Execute use case with audit data.
    await deleteUserUseCase.execute({
      id: parsed.data,
      userId,
      ipAddress,
      userAgent,
    });

    // 5. Revalidate cache and return result.
    revalidatePath('/users');
    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleActionError(error);
  }
}
