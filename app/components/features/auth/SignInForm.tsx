'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { findRoles } from '@/app/actions/role.actions';
import { signInUser } from '@/app/actions/session.actions';
import { messages } from '@/core/application/validation/messages';
import {
  CreateSessionInput,
  sessionSchema,
} from '@/core/application/validation/schemas/session.schema';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { useAppDispatch } from '@/hooks/redux.hooks';
import { logger } from '@/lib/logger.utils';
import { setCredentials } from '@/stores/slices/auth.slice';
import { FieldError } from '../../common/FieldError';
import { PasswordInput } from '../../common/PasswordInput';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';

interface SignInFormProps {
  className?: string;
}

export function SignInForm({ className }: SignInFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors: formErrors },
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(sessionSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (input: CreateSessionInput) => signInUser(input),
    onSuccess: async (response) => {
      if (response.success && response.data) {
        const roleList = await findRoles({});
        const roles = roleList.success ? roleList.data.items : [];
        const role = roles.find(
          (role) => role.id === response.data.user.roleId
        );

        if (!role) {
          throw new NotFoundError('Cargo');
        }

        // Dispatch credentials to the Redux store.
        dispatch(
          setCredentials({
            user: response.data.user,
            permissions: response.data.permissions,
            roleCode: role.code,
          })
        );
        router.push('/dashboard');
        return;
      }

      if (response.success === false) {
        const errorMessage =
          response.message === 'Invalid credentials.'
            ? messages.INVALID_CREDENTIALS
            : response.message || 'Ocorreu um erro inesperado.';

        toast.error(errorMessage);
      }
    },
    onError: (error: unknown) => {
      logger.error('[SIGNIN ERROR]', error);
      toast.error('Erro de comunicação com o servidor.');
    },
  });

  async function onSubmit(input: CreateSessionInput) {
    mutate(input);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <FieldGroup className="flex flex-col gap-4 mb-4">
        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            {...register('email')}
            name="email"
            placeholder="Insira o seu e-mail"
            aria-invalid={!!formErrors.email}
          />
          {formErrors.email && (
            <FieldError message={formErrors.email.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <PasswordInput
            {...register('password')}
            name="password"
            placeholder="Insira a sua senha"
            aria-invalid={!!formErrors.password}
          />
          {formErrors.password && (
            <FieldError message={formErrors.password.message} />
          )}
        </Field>

        <Field>
          <div className="flex justify-end items-center gap-2">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <>
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel htmlFor="rememberMe" className="font-normal">
                    Mantenha-me logado
                  </FieldLabel>
                  {formErrors.rememberMe && (
                    <FieldError message={formErrors.rememberMe.message} />
                  )}
                </>
              )}
            />
          </div>
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          size="lg"
          className="w-full cursor-pointer"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          Entrar
        </Button>
        <Button
          type="button"
          variant="link"
          className="self-end p-0 w-min cursor-pointer"
          onClick={() => router.push('/auth/password-recovery')}
        >
          Esqueceu a senha?
        </Button>
      </div>
    </form>
  );
}
