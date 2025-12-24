'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { FieldErrorMessage } from '../../common/FieldErrorMessage';
import { Button } from '../../ui/button';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';
import { Textarea } from '../../ui/textarea';

import {
  createNotification,
  updateNotification,
} from '@/app/actions/notification.actions';

import {
  CreateNotificationInput,
  notificationSchema,
} from '@/core/domain/validation/schemas/notification.schema';

interface NotificationFormProps {
  isEditMode: boolean;
  className?: string;
}

export function NotificationForm({
  isEditMode,
  className,
}: NotificationFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<CreateNotificationInput>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      sinan: '',
      observations: '',
    },
  });

  const notificationMutation = useMutation({
    mutationFn: (input: CreateNotificationInput) =>
      isEditMode ? updateNotification(input) : createNotification(input),
    onSuccess: () => {
      // TODO: Implement success case
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  async function onSubmit(input: CreateNotificationInput) {
    notificationMutation.mutate(input);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <FieldGroup className="grid grid-cols-1">
        <Field>
          <FieldLabel htmlFor="sinan">SINAN</FieldLabel>
          <Input
            {...register('sinan')}
            name="sinan"
            placeholder="Insira o SINAN"
            aria-invalid={!!formErrors.sinan}
          />
          {formErrors.sinan && (
            <FieldErrorMessage message={formErrors.sinan.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="observations">Observações (opcional)</FieldLabel>
          <Textarea
            {...register('observations')}
            name="observations"
            placeholder="Insira as observações"
            aria-invalid={!!formErrors.observations}
          />
          {formErrors.observations && (
            <FieldErrorMessage message={formErrors.observations.message} />
          )}
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        className="mt-8 w-full cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting && <Spinner />}
        Salvar
      </Button>
    </form>
  );
}
