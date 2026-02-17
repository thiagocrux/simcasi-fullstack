'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { changePassword } from '@/app/actions/user.actions';
import {
  ChangePasswordInput,
  changePasswordSchema,
} from '@/core/application/validation/schemas/user.schema';
import { useLogout } from '@/hooks/useLogout';
import { useUser } from '@/hooks/useUser';
import { logger } from '@/lib/logger.utils';
import { Save, Undo2 } from 'lucide-react';
import { toast } from 'sonner';
import { FieldError } from '../../common/FieldError';
import { PasswordInput } from '../../common/PasswordInput';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Separator } from '../../ui/separator';
import { Spinner } from '../../ui/spinner';

interface PasswordChangeFormProps {
  className?: string;
}

export function PasswordChangeForm({ className }: PasswordChangeFormProps) {
  const router = useRouter();
  const { user: loggedUser } = useUser();
  const { handleLogout } = useLogout();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (input: ChangePasswordInput) => changePassword(input),
    onSuccess: (data) => {
      if (data.success) {
        logger.success(`The password change was successful!`);
        toast.success(`O senha foi atualizada com sucesso!`);
      } else {
        logger.error('[CHANGE_PASSWORD_FORM_ERROR]', data.message);
        toast.error('A tentativa de atualizar a senha falhou.');
      }
      reset();
      router.push('/users');
    },
  });

  async function onSubmit(input: ChangePasswordInput) {
    if (!loggedUser?.id) {
      logger.error('[EXAM_FORM_ERROR] Expired session or invalid user.');
      toast.error(`Sessão expirada ou usuário inválido.`);
      handleLogout();
      return;
    }

    mutate(input);
  }

  const isFormBusy = isPending || isSubmitting;

  return (
    <Card className="flex flex-col px-4 sm:px-8 py-8 sm:py-12">
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <FieldGroup className="gap-8 grid grid-cols-1">
          <Field>
            <FieldLabel htmlFor="currentPassword">Senha atual</FieldLabel>
            <PasswordInput
              {...register('currentPassword')}
              name="currentPassword"
              placeholder="Insira a sua senha atual"
              aria-invalid={!!formErrors.currentPassword}
            />
            {formErrors.currentPassword && (
              <FieldError message={formErrors.currentPassword.message} />
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="newPassword">Nova senha</FieldLabel>
            <PasswordInput
              {...register('newPassword')}
              name="newPassword"
              placeholder="Insira a nova senha"
              aria-invalid={!!formErrors.newPassword}
            />
            {formErrors.newPassword && (
              <FieldError message={formErrors.newPassword.message} />
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="newPasswordConfirmation">
              Confirmação da nova senha
            </FieldLabel>
            <PasswordInput
              {...register('newPasswordConfirmation')}
              name="newPasswordConfirmation"
              placeholder="Confirme a nova senha"
              aria-invalid={!!formErrors.newPasswordConfirmation}
            />
            {formErrors.newPasswordConfirmation && (
              <FieldError
                message={formErrors.newPasswordConfirmation.message}
              />
            )}
          </Field>
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
            Confirmar
          </Button>
        </div>
      </form>
    </Card>
  );
}
