'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { requestNewPassword } from '@/app/actions/session.actions';
import { FieldErrorMessage } from '../../common/FieldErrorMessage';
import { Button } from '../../ui/button';
import { Field, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';

import {
  RequestNewPasswordInput,
  requestNewPasswordSchema,
} from '@/core/domain/validation/schemas/session.schema';

interface RequestNewPasswordFormProps {
  className?: string;
}

export function RequestNewPasswordForm({
  className,
}: RequestNewPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<RequestNewPasswordInput>({
    resolver: zodResolver(requestNewPasswordSchema),
    defaultValues: { registeredEmail: '' },
  });

  const requestNewPasswordMutation = useMutation({
    mutationFn: (input: RequestNewPasswordInput) => requestNewPassword(input),
    onSuccess: () => {
      // TODO: Implement success case.
    },
    onError: (error: unknown) => {
      // TODO: Implement error case.
      console.error('Submit error:', error);
    },
  });

  async function onSubmit(input: RequestNewPasswordInput) {
    requestNewPasswordMutation.mutate(input);
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
          <FieldErrorMessage message={formErrors.registeredEmail.message} />
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
