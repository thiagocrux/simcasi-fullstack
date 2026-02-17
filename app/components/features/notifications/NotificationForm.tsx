'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save, Undo2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import {
  createNotification,
  getNotification,
  updateNotification,
} from '@/app/actions/notification.actions';
import {
  CreateNotificationInput,
  NotificationFormInput,
  notificationSchema,
  UpdateNotificationInput,
} from '@/core/application/validation/schemas/notification.schema';
import { useLogout } from '@/hooks/useLogout';
import { useUser } from '@/hooks/useUser';
import { logger } from '@/lib/logger.utils';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { FieldError } from '../../common/FieldError';
import { FieldGroupHeading } from '../../common/FieldGroupHeading';
import { MaskedInput } from '../../common/MaskedInput';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Separator } from '../../ui/separator';
import { Spinner } from '../../ui/spinner';
import { Textarea } from '../../ui/textarea';

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
  const { user: loggedUser } = useUser();
  const { handleLogout } = useLogout();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isSubmitting },
    control,
  } = useForm<NotificationFormInput>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      patientId,
      sinan: '',
      observations: '',
    },
  });

  const { data: notification, isPending: isFetchingNotification } = useQuery({
    queryKey: ['get-notification', notificationId],
    queryFn: async () => await getNotification(notificationId as string),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (notification && notification.success) {
      const { observations, ...rest } = notification.data;
      reset({
        ...rest,
        observations: observations ?? '',
      });
    }
  }, [notification, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (input: NotificationFormInput) => {
      return isEditMode && notificationId
        ? updateNotification(notificationId, input as UpdateNotificationInput)
        : createNotification(input as CreateNotificationInput);
    },
    onSuccess: (data) => {
      if (data.success) {
        logger.success(
          `The notification ${isEditMode ? 'update' : 'creation'} was successful!`
        );
        toast.success(
          `A notificação foi ${isEditMode ? 'atualizada' : 'criada'} com sucesso!`
        );
      } else {
        logger.error(`[NOTIFICATION_FORM_ERROR] ${data.message}`, data.errors);
        toast.error(
          `A tentativa de ${isEditMode ? 'atualizar' : 'criar'} a notificação falhou.`
        );
      }
      reset();
      router.push('/notifications');
    },
  });

  const isFormBusy =
    isPending || isSubmitting || (isEditMode && isFetchingNotification);

  async function onSubmit(input: NotificationFormInput) {
    if (!loggedUser?.id) {
      logger.error(
        '[NOTIFICATION_FORM_ERROR] Expired session or invalid user.'
      );
      toast.error(`Sessão expirada ou usuário inválido.`);
      handleLogout();
      return;
    }

    mutate(input);
  }

  return (
    <Card className="flex flex-col px-4 sm:px-8 py-8 sm:py-12">
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <FieldGroup className="gap-8 grid grid-cols-1">
          <FieldGroupHeading text="Dados da notificação" />

          <FieldGroup className="gap-4 grid grid-cols-1">
            <Field>
              {/* <FieldLabel htmlFor="sinan">SINAN</FieldLabel>
              <Input
                {...register('sinan')}
                name="sinan"
                placeholder="0000000"
                aria-invalid={!!formErrors.sinan}
                disabled={isFormBusy}
              />

              {formErrors.sinan && (
                <FieldError message={formErrors.sinan.message} />
              )} */}

              <Controller
                name="sinan"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="sinan">
                      Número do cartão do SUS
                    </FieldLabel>
                    <MaskedInput
                      {...field}
                      onValueChange={field.onChange}
                      variant="sinan"
                      placeholder="0000000"
                      hasError={!!formErrors.sinan}
                      disabled={isFormBusy}
                    />
                    {formErrors.sinan && (
                      <FieldError message={formErrors.sinan.message} />
                    )}
                  </>
                )}
              />
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
                disabled={isFormBusy}
              />
              {formErrors.observations && (
                <FieldError message={formErrors.observations.message} />
              )}
            </Field>
          </FieldGroup>
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
