'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { resetPassword } from '@/app/actions/session.actions';
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from '@/core/application/validation/schemas/session.schema';
import { logger } from '@/lib/logger.utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FieldError } from '../../common/FieldError';
import { PasswordInput } from '../../common/PasswordInput';
import { Button } from '../../ui/button';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Spinner } from '../../ui/spinner';

interface ResetPasswordProps {
  className?: string;
}

export function PasswordResetForm({ className }: ResetPasswordProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      newPasswordConfirmation: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (input: ResetPasswordInput) => resetPassword(input),
    onSuccess: (data) => {
      if (data.success) {
        logger.success(`The password reset was successful!`);
        toast.success(`A senha foi redefinida com sucesso!`);
      } else {
        // FIXME: Fix after use case implementation.
        logger.error('[PASSWORD_RESET_FORM_ERROR]', data.message);
        toast.error('A tentativa de redefinição de senha falhou.');
      }
      reset();
      router.push('/users');
    },
  });

  async function onSubmit(input: ResetPasswordInput) {
    mutate(input);
  }

  const isFormBusy = isPending || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <FieldGroup>
        <Field>
          <FieldLabel>Nova senha</FieldLabel>
          <PasswordInput
            {...register('newPassword')}
            name="newPassword"
            placeholder="Insira a sua nova senha"
            aria-invalid={!!formErrors.newPassword}
          />
          {formErrors.newPassword && (
            <FieldError message={formErrors.newPassword.message} />
          )}
        </Field>

        <Field>
          <FieldLabel>Confirmação de nova senha</FieldLabel>
          <PasswordInput
            {...register('newPasswordConfirmation')}
            name="newPasswordConfirmation"
            placeholder="Confirme a sua nova senha"
            aria-invalid={!!formErrors.newPasswordConfirmation}
          />
          {formErrors.newPasswordConfirmation && (
            <FieldError message={formErrors.newPasswordConfirmation.message} />
          )}
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        className="w-full cursor-pointer select-none"
        disabled={isFormBusy}
      >
        {isSubmitting && <Spinner />}
        Redefinir senha
      </Button>
    </form>
  );
}
