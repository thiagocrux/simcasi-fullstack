'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save, Undo2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import {
  createObservation,
  getObservation,
  updateObservation,
} from '@/app/actions/observation.actions';
import {
  CreateObservationInput,
  ObservationFormInput,
  observationSchema,
  UpdateObservationInput,
} from '@/core/application/validation/schemas/observation.schema';
import { useLogout } from '@/hooks/useLogout';
import { useUser } from '@/hooks/useUser';
import { logger } from '@/lib/logger.utils';
import { useEffect } from 'react';
import { FieldError } from '../../common/FieldError';
import { FieldGroupHeading } from '../../common/FieldGroupHeading';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Separator } from '../../ui/separator';
import { Spinner } from '../../ui/spinner';

interface ObservationFormProps {
  isEditMode?: boolean;
  observationId?: string | null;
  patientId: string;
  className?: string;
}

export function ObservationForm({
  isEditMode = false,
  observationId = null,
  patientId,
  className,
}: ObservationFormProps) {
  const router = useRouter();
  const { user: loggedUser } = useUser();
  const { handleLogout } = useLogout();

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<ObservationFormInput>({
    resolver: zodResolver(observationSchema),
    defaultValues: {
      patientId,
      observations: '',
      hasPartnerBeingTreated: false,
    },
  });

  const { data: observation, isPending: isFetchingObservation } = useQuery({
    queryKey: ['get-observation', observationId],
    queryFn: async () => await getObservation(observationId as string),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (observation && observation.success) {
      const { observations, ...rest } = observation.data;
      reset({
        ...rest,
        observations: observations ?? '',
      });
    }
  }, [observation, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      input,
      authorId,
    }: {
      input: ObservationFormInput;
      authorId: string;
    }) => {
      const payload = isEditMode
        ? { ...input, updatedBy: authorId }
        : { ...input, createdBy: authorId };

      return isEditMode && observationId
        ? updateObservation(observationId, payload as UpdateObservationInput)
        : createObservation(payload as CreateObservationInput);
    },
    onSuccess: () => {
      logger.success(
        `The observation ${isEditMode ? 'update' : 'creation'} was successfull!`
      );
      reset();
      router.push('/observations');
    },
    onError: (error: unknown) => {
      logger.error('[FORM_ERROR]', error);
    },
  });

  const isFormBusy =
    isPending || isSubmitting || (isEditMode && isFetchingObservation);

  async function onSubmit(input: ObservationFormInput) {
    if (!loggedUser?.id) {
      logger.error('[FORM_ERROR] Expired session or invalid user.');
      handleLogout();
      return;
    }

    mutate({
      input,
      authorId: loggedUser?.id,
    });
  }

  return (
    <Card className="flex flex-col px-4 sm:px-8 py-8 sm:py-12">
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <FieldGroup className="gap-8 grid grid-cols-1">
          <FieldGroupHeading text="Observações gerais" />

          <FieldGroup className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field className="col-span-full">
              <FieldLabel htmlFor="observations">
                Observações (opcional)
              </FieldLabel>
              <Input
                {...register('observations')}
                name="observations"
                placeholder="Ex: Paciente relatou melhora nos sintomas."
                aria-invalid={!!formErrors.observations}
                disabled={isFormBusy}
              />
              {formErrors.observations && (
                <FieldError message={formErrors.observations.message} />
              )}
            </Field>

            <Field>
              <div className="flex items-center gap-3">
                <Controller
                  control={control}
                  name="hasPartnerBeingTreated"
                  render={({ field }) => (
                    <Checkbox
                      id="hasPartnerBeingTreated"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isFormBusy}
                    />
                  )}
                />
                <FieldLabel htmlFor="hasPartnerBeingTreated">
                  Parceiro em tratamento
                </FieldLabel>
              </div>
              {formErrors.hasPartnerBeingTreated && (
                <FieldError
                  message={formErrors.hasPartnerBeingTreated.message}
                />
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
