'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { createUser, updateUser } from '@/app/actions/user.actions';
import {
  CreateUserFormInput,
  userFormSchema,
} from '@/core/application/validation/schemas/user.schema';
import { ROLE_OPTIONS } from '@/core/domain/constants/role.constants';
import { FieldError } from '../../common/FieldError';
import { FieldGroupHeading } from '../../common/FieldGroupHeading';
import { PasswordInput } from '../../common/PasswordInput';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Spinner } from '../../ui/spinner';

interface UserFormProps {
  isEditMode?: boolean;
  userId?: string | null;
  className?: string;
}

export function UserForm({
  isEditMode = false,
  userId = null,
  className,
}: UserFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    control,
  } = useForm<CreateUserFormInput>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      roleId: '',
    },
  });

  const userMutation = useMutation({
    mutationFn: (input: CreateUserFormInput) =>
      isEditMode && userId ? updateUser(userId, input) : createUser(input),
    onSuccess: () => {
      // TODO: Implement success case.
    },
    onError: (error: unknown) => {
      // TODO: Implement error case.
      console.error('Submit error:', error);
    },
  });

  async function onSubmit(input: CreateUserFormInput) {
    userMutation.mutate(input);
  }

  return (
    <Card className="flex flex-col px-4 sm:px-8 py-8 sm:py-12">
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <FieldGroup className="gap-8 grid grid-cols-1">
          <FieldGroupHeading text="Dados do usuário" />

          <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field className="col-span-full">
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input
                {...register('name')}
                name="name"
                placeholder="Maria Silva"
                aria-invalid={!!formErrors.name}
              />
              {formErrors.name && (
                <FieldError message={formErrors.name.message} />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                {...register('email')}
                name="email"
                placeholder="exemplo@email.com"
                aria-invalid={!!formErrors.email}
              />
              {formErrors.email && (
                <FieldError message={formErrors.email.message} />
              )}
            </Field>

            <Field>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="role">Cargo</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={
                          formErrors.roleId
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
                    {formErrors.roleId && (
                      <FieldError message={formErrors.roleId.message} />
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <PasswordInput
                {...register('password')}
                name="password"
                placeholder="********"
                aria-invalid={!!formErrors.password}
              />
              {formErrors.password && (
                <FieldError message={formErrors.password.message} />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="passwordConfirmation">
                Confirmação de senha
              </FieldLabel>
              <PasswordInput
                {...register('passwordConfirmation')}
                name="passwordConfirmation"
                placeholder="********"
                aria-invalid={!!formErrors.passwordConfirmation}
              />
              {formErrors.passwordConfirmation && (
                <FieldError message={formErrors.passwordConfirmation.message} />
              )}
            </Field>
          </div>
        </FieldGroup>

        <Button
          type="submit"
          size="lg"
          className="mt-8 w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : <Save />}
          {isEditMode ? 'Atualizar' : 'Salvar'}
        </Button>
      </form>
    </Card>
  );
}
