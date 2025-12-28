'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { resetPassword } from '@/app/actions/session.actions';
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from '@/core/domain/validation/schemas/session.schema';
import { FieldError } from '../../common/FieldError';
import { PasswordInput } from '../../common/PasswordInput';
import { Button } from '../../ui/button';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Spinner } from '../../ui/spinner';

interface ResetPasswordProps {
  className?: string;
}

export function ResetPasswordForm({ className }: ResetPasswordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', newPasswordConfirmation: '' },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (input: ResetPasswordInput) => resetPassword(input),
    onSuccess: () => {
      // TODO: Implement success case.
    },
    onError: (error: unknown) => {
      // TODO: Implement error case.
      console.error('Submit error:', error);
    },
  });

  async function onSubmit(input: ResetPasswordInput) {
    resetPasswordMutation.mutate(input);
  }

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
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner />}
        Redefinir senha
      </Button>
    </form>
  );
}
