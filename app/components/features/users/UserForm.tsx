'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save, Undo2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { createUser, getUser, updateUser } from '@/app/actions/user.actions';
import {
  CreateUserInput,
  getUserFormSchema,
  UpdateUserInput,
  UserFormInput,
} from '@/core/application/validation/schemas/user.schema';
import { useLogout } from '@/hooks/useLogout';
import { usePermission } from '@/hooks/usePermission';
import { useRole } from '@/hooks/useRole';
import { useUser } from '@/hooks/useUser';
import { logger } from '@/lib/logger.utils';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Combobox } from '../../common/Combobox';
import { FieldError } from '../../common/FieldError';
import { FieldGroupHeading } from '../../common/FieldGroupHeading';
import { MaskedInput } from '../../common/MaskedInput';
import { PasswordInput } from '../../common/PasswordInput';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Separator } from '../../ui/separator';
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
  const { user: loggedUser, isUserAdmin } = useUser();
  const { roles: ROLE_OPTIONS } = useRole();
  const { handleLogout } = useLogout();
  const { can } = usePermission();

  const userFormSchema = getUserFormSchema(isEditMode);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isSubmitting },
    control,
  } = useForm<UserFormInput>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      enrollmentNumber: '',
      professionalRegistration: '',
      cpf: '',
      workplace: '',
      password: '',
      passwordConfirmation: '',
      roleId: '',
    },
  });

  const { data: user, isPending: isFetchingUser } = useQuery({
    queryKey: ['find-users', userId],
    queryFn: async () => await getUser(userId as string),
    enabled: isEditMode,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (input: UserFormInput) => {
      return isEditMode && userId
        ? updateUser(userId, input as UpdateUserInput)
        : createUser(input as CreateUserInput);
    },
    onSuccess: (data) => {
      if (data.success) {
        logger.success(
          `User ${isEditMode ? 'updated' : 'created'} successfully`
        );
        toast.success(
          `O usuário foi ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`
        );
      } else {
        logger.error('User submission failed', {
          cause: 'Server returned an error response during user submission.',
          details: data.message,
          errors: data.errors,
          action: 'user_form_submit',
        });
        toast.error(
          `A tentativa de ${isEditMode ? 'atualizar' : 'criar'} o usuário falhou.`
        );
      }
      reset();
      router.push('/users');
    },
  });

  const isFormBusy =
    isPending || isSubmitting || (isEditMode && isFetchingUser);

  // Only administrators can update user roles.
  const canUpdateRole = !isFormBusy || isUserAdmin;

  async function onSubmit(input: UserFormInput) {
    if (!loggedUser?.id) {
      logger.error('User submission blocked', {
        cause: 'Missing user context. Session may have expired.',
        action: 'user_form_submit',
      });
      toast.error('Sessão expirada ou usuário inválido.');
      handleLogout();
      return;
    }

    const selectedRole = ROLE_OPTIONS.find((role) => role.id === input.roleId);
    if (!selectedRole) {
      logger.error('Invalid role selected', {
        cause: 'The role ID provided does not match any available roles.',
        action: 'user_form_submit',
      });
      toast.error('O cargo selecionado é inválido ou não foi encontrado.');
      return;
    }

    const {
      name,
      email,
      phone,
      enrollmentNumber,
      professionalRegistration,
      cpf,
      workplace,
      roleId,
    } = input;
    mutate(
      isEditMode
        ? {
            name,
            email,
            phone,
            enrollmentNumber,
            professionalRegistration,
            cpf,
            workplace,
            roleId,
          }
        : input
    );
  }

  useEffect(() => {
    if (user && user.success) {
      const {
        name,
        email,
        phone,
        enrollmentNumber,
        professionalRegistration,
        cpf,
        workplace,
        roleId,
      } = user.data;
      reset({
        name,
        email,
        phone,
        enrollmentNumber,
        professionalRegistration,
        cpf,
        workplace,
        roleId,
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (!can('create:user')) {
      router.replace('/dashboard'); // ou outra rota segura
    }
  }, [can, router]);

  return (
    <Card className="flex flex-col px-4 sm:px-8 py-8 sm:py-12">
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <FieldGroup className="gap-8 grid grid-cols-1">
          <FieldGroupHeading text="Identificação pessoal" />

          <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input
                {...register('name')}
                name="name"
                placeholder="Maria Silva"
                aria-invalid={!!formErrors.name}
                disabled={isFormBusy}
              />
              {formErrors.name && (
                <FieldError message={formErrors.name.message} />
              )}
            </Field>

            <Field>
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                    <MaskedInput
                      {...field}
                      onValueChange={field.onChange}
                      variant="cpf"
                      placeholder="000.000.000-00"
                      hasError={!!formErrors.cpf}
                      disabled={isFormBusy}
                    />
                    {formErrors.cpf && (
                      <FieldError message={formErrors.cpf.message} />
                    )}
                  </>
                )}
              />
            </Field>
          </div>

          <FieldGroupHeading text="Contato" />

          <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                {...register('email')}
                name="email"
                placeholder="exemplo@email.com"
                aria-invalid={!!formErrors.email}
                disabled={isFormBusy}
              />
              {formErrors.email && (
                <FieldError message={formErrors.email.message} />
              )}
            </Field>

            <Field>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="phone">Telefone</FieldLabel>
                    <MaskedInput
                      {...field}
                      onValueChange={field.onChange}
                      variant="phone"
                      placeholder="(99) 99999-9999"
                      hasError={!!formErrors.phone}
                      disabled={isFormBusy}
                    />
                    {formErrors.phone && (
                      <FieldError message={formErrors.phone.message} />
                    )}
                  </>
                )}
              />
            </Field>
          </div>

          <FieldGroupHeading text="Vínculo profissional" />

          <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field>
              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="role">Cargo</FieldLabel>
                    <Combobox
                      {...field}
                      data={ROLE_OPTIONS.map((role) => ({
                        value: role.id,
                        label: role.label,
                      }))}
                      onChange={field.onChange}
                      placeholder="Selecione o cargo"
                      searchPlaceholder="Pesquisar..."
                      emptySearchMessage="Nenhum resultado encontrado."
                      disabled={!canUpdateRole}
                      aria-invalid={!!formErrors.roleId}
                    />
                    {formErrors.roleId && (
                      <FieldError message={formErrors.roleId.message} />
                    )}
                  </>
                )}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="enrollmentNumber">Matrícula</FieldLabel>
              <Input
                {...register('enrollmentNumber')}
                name="enrollmentNumber"
                placeholder="MAT-000001"
                aria-invalid={!!formErrors.enrollmentNumber}
                disabled={isFormBusy}
              />
              {formErrors.enrollmentNumber && (
                <FieldError message={formErrors.enrollmentNumber.message} />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="professionalRegistration">
                Registro profissional
              </FieldLabel>
              <Input
                {...register('professionalRegistration')}
                name="professionalRegistration"
                placeholder="CRM-000001"
                aria-invalid={!!formErrors.professionalRegistration}
                disabled={isFormBusy}
              />
              {formErrors.professionalRegistration && (
                <FieldError
                  message={formErrors.professionalRegistration.message}
                />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="workplace">Local de trabalho</FieldLabel>
              <Input
                {...register('workplace')}
                name="workplace"
                placeholder="Hospital Central"
                aria-invalid={!!formErrors.workplace}
                disabled={isFormBusy}
              />
              {formErrors.workplace && (
                <FieldError message={formErrors.workplace.message} />
              )}
            </Field>
          </div>

          {!isEditMode && (
            <>
              <FieldGroupHeading text="Segurança" />

              <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <PasswordInput
                    {...register('password')}
                    name="password"
                    placeholder="********"
                    aria-invalid={!!formErrors.password}
                    disabled={isFormBusy}
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
                    disabled={isFormBusy}
                  />
                  {formErrors.passwordConfirmation && (
                    <FieldError
                      message={formErrors.passwordConfirmation.message}
                    />
                  )}
                </Field>
              </div>
            </>
          )}
        </FieldGroup>

        <Separator className="col-span-full my-8" />
        <div className="gap-4 grid sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="cursor-pointer select-none"
            onClick={() => router.back()}
          >
            <Undo2 />
            Cancelar
          </Button>
          <Button
            type="submit"
            size="lg"
            className="cursor-pointer select-none"
            disabled={isFormBusy}
          >
            {isSubmitting ? <Spinner /> : <Save />}
            {isEditMode ? 'Atualizar' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
