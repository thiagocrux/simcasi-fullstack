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
import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
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
        reset();
        router.push('/auth/sign-in');
      } else {
        toast.error(
          data.message || 'A tentativa de redefinição de senha falhou.'
        );

        // If the error indicates token issues, we could redirect to the expired page.
        if (
          data.message?.toLowerCase().includes('token') ||
          data.message?.toLowerCase().includes('expirado')
        ) {
          router.push('/auth/password-recovery?variant=expired');
        }
      }
    },
  });

  async function onSubmit(input: ResetPasswordInput) {
    mutate(input);
  }

  const isFormBusy = isPending || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={className ?? 'flex flex-col gap-6'}
    >
      <input type="hidden" {...register('token')} />
      <FieldGroup className="flex flex-col gap-4">
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
