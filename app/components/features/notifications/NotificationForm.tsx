'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import {
  createNotification,
  updateNotification,
} from '@/app/actions/notification.actions';
import { FieldError } from '../../common/FieldError';
import { FieldGroupHeading } from '../../common/FieldGroupHeading';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';
import { Textarea } from '../../ui/textarea';

import {
  CreateNotificationInput,
  notificationSchema,
} from '@/core/application/validation/schemas/notification.schema';

interface NotificationFormProps {
  isEditMode?: boolean;
  notificationId?: string | null;
  patientId: string;
  className?: string;
}

export function NotificationForm({
  isEditMode = false,
  notificationId = null,
  patientId,
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
      patientId,
      sinan: '',
      observations: '',
    },
  });

  const notificationMutation = useMutation({
    mutationFn: (input: CreateNotificationInput) =>
      isEditMode && notificationId
        ? updateNotification(notificationId, input)
        : createNotification(input),
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
    <Card className="flex flex-col px-4 sm:px-8 py-8 sm:py-12">
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <FieldGroup className="gap-8 grid grid-cols-1">
          <FieldGroupHeading text="Dados da notificação" />

          <FieldGroup className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="sinan">SINAN</FieldLabel>
              <Input
                {...register('sinan')}
                name="sinan"
                placeholder="000000"
                aria-invalid={!!formErrors.sinan}
              />
              {formErrors.sinan && (
                <FieldError message={formErrors.sinan.message} />
              )}
            </Field>

            <Field className="col-span-full">
              <FieldLabel htmlFor="observations">
                Observações (opcional)
              </FieldLabel>
              <Textarea
                {...register('observations')}
                name="observations"
                placeholder="Ex: Paciente apresentou reação alérgica leve."
                aria-invalid={!!formErrors.observations}
              />
              {formErrors.observations && (
                <FieldError message={formErrors.observations.message} />
              )}
            </Field>
          </FieldGroup>
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
