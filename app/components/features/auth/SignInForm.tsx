'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { signInUser } from '@/app/actions/session.actions';
import {
  CreateSessionInput,
  sessionSchema,
} from '@/core/domain/validation/schemas/session.schema';
import { FieldError } from '../../common/FieldError';
import { PasswordInput } from '../../common/PasswordInput';
import { Button } from '../../ui/button';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';

interface SignInFormProps {
  className?: string;
}

export function SignInForm({ className }: SignInFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(sessionSchema),
    defaultValues: { email: '', password: '' },
  });

  const signInUserMutation = useMutation({
    mutationFn: (input: CreateSessionInput) => signInUser(input),
    onSuccess: () => {
      // TODO: Implement success case.
    },
    onError: (error: unknown) => {
      // TODO: Implement error case.
      console.error('Submit error:', error);
    },
  });

  async function onSubmit(input: CreateSessionInput) {
    signInUserMutation.mutate(input);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <FieldGroup>
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
      </FieldGroup>

      <Button
        type="button"
        variant="link"
        className="self-end p-0 w-min cursor-pointer"
        onClick={() => router.push('/auth/password-recovery')}
      >
        Esqueceu a senha?
      </Button>

      <Button
        type="submit"
        size="lg"
        className="w-full cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner />}
        Entrar
      </Button>
    </form>
  );
}
