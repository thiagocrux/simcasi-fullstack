'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { requestPasswordReset } from '@/app/actions/session.actions';
import { FieldError } from '../../common/FieldError';
import { Button } from '../../ui/button';
import { Field, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';

import {
  RequestPasswordResetInput,
  RequestPasswordResetSchema,
} from '@/core/application/validation/schemas/session.schema';

interface RequestPasswordResetFormProps {
  className?: string;
}

export function RequestPasswordResetForm({
  className,
}: RequestPasswordResetFormProps) {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(RequestPasswordResetSchema),
    defaultValues: { registeredEmail: '' },
  });

  const RequestPasswordResetMutation = useMutation({
    mutationFn: (input: RequestPasswordResetInput) =>
      requestPasswordReset(input),
    onSuccess: (data) => {
      if (data.success) {
        const email = getValues('registeredEmail');
        window.location.href = `/auth/password-recovery?variant=success&email=${encodeURIComponent(
          email
        )}`;
      } else {
        console.error('Submit error:', data.message);
      }
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  async function onSubmit(input: RequestPasswordResetInput) {
    RequestPasswordResetMutation.mutate(input);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <Field>
        <FieldLabel>E-mail cadastrado</FieldLabel>
        <Input
          {...register('registeredEmail')}
          name="registeredEmail"
          placeholder="Insira o e-mail cadastrado"
          className="mt-1 placeholder:text-sm"
          aria-invalid={!!formErrors.registeredEmail}
        />
        {formErrors.registeredEmail && (
          <FieldError message={formErrors.registeredEmail.message} />
        )}
      </Field>

      <Button
        type="submit"
        size="lg"
        className="w-full cursor-pointer select-none"
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner />}
        Enviar instruções
      </Button>
    </form>
  );
}
