'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { signInUser } from '@/app/actions/session.actions';
import { ROLE_OPTIONS } from '@/core/domain/constants/role.constants';
import { FieldErrorMessage } from '../../common/FieldErrorMessage';
import { PasswordInput } from '../../common/PasswordInput';
import { Button } from '../../ui/button';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';

import {
  CreateUserInput,
  userSchema,
} from '@/core/domain/validation/schemas/user.schema';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

interface UserFormProps {
  className?: string;
}

export function UserForm({ className }: UserFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    control,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: { email: '', password: '', passwordConfirmation: '' },
  });

  const signInUserMutation = useMutation({
    mutationFn: (input: CreateUserInput) => signInUser(input),
    onSuccess: () => {
      // TODO: Implement success case.
    },
    onError: (error: unknown) => {
      // TODO: Implement error case.
      console.error('Submit error:', error);
    },
  });

  async function onSubmit(input: CreateUserInput) {
    signInUserMutation.mutate(input);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <FieldGroup className="grid grid-cols-1">
        <Field>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <Input
            {...register('name')}
            name="name"
            placeholder="Insira o seu nome completo"
            aria-invalid={!!formErrors.name}
          />
          {formErrors.name && (
            <FieldErrorMessage message={formErrors.name.message} />
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            {...register('email')}
            name="email"
            placeholder="Insira o seu e-mail"
            aria-invalid={!!formErrors.email}
          />
          {formErrors.email && (
            <FieldErrorMessage message={formErrors.email.message} />
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
            <FieldErrorMessage message={formErrors.password.message} />
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="passwordConfirmation">
            Confirmação de senha
          </FieldLabel>
          <PasswordInput
            {...register('passwordConfirmation')}
            name="passwordConfirmation"
            placeholder="Confirme a sua senha"
            aria-invalid={!!formErrors.passwordConfirmation}
          />
          {formErrors.passwordConfirmation && (
            <FieldErrorMessage
              message={formErrors.passwordConfirmation.message}
            />
          )}
        </Field>
        <Field>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <>
                <FieldLabel htmlFor="role">Cargo</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={
                      formErrors.role
                        ? 'border-destructive! focus:ring-destructive/30!'
                        : ''
                    }
                  >
                    <SelectValue placeholder="Selecione o seu cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.role && (
                  <FieldErrorMessage message={formErrors.role.message} />
                )}
              </>
            )}
          />
        </Field>
      </FieldGroup>
      <Button
        type="submit"
        size="lg"
        className="mt-8 w-full cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner />}
        Entrar
      </Button>
    </form>
  );
}
