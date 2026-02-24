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
import { toast } from 'sonner';
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
    mutationFn: (input: ObservationFormInput) => {
      return isEditMode && observationId
        ? updateObservation(observationId, input as UpdateObservationInput)
        : createObservation(input as CreateObservationInput);
    },
    onSuccess: (data) => {
      if (data.success) {
        logger.success(
          `Observation ${isEditMode ? 'updated' : 'created'} successfully`
        );
        toast.success(
          `A observação foi ${isEditMode ? 'atualizada' : 'criada'} com sucesso!`
        );
      } else {
        logger.error('Observation submission failed', {
          cause:
            'Server returned an error response during observation submission.',
          details: data.message,
          errors: data.errors,
          action: 'observation_form_submit',
        });
        toast.error(
          `A tentativa de ${isEditMode ? 'atualizar' : 'criar'} a observação falhou.`
        );
      }
      reset();
      router.push('/observations');
    },
  });

  const isFormBusy =
    isPending || isSubmitting || (isEditMode && isFetchingObservation);

  async function onSubmit(input: ObservationFormInput) {
    if (!loggedUser?.id) {
      logger.error('Observation submission blocked', {
        cause: 'Missing user context. Session may have expired.',
        action: 'observation_form_submit',
      });
      toast.error('Sessão expirada ou usuário inválido.');
      handleLogout();
      return;
    }

    mutate(input);
  }

  return (
    <Card className="flex flex-col px-4 sm:px-8 py-8 sm:py-12">
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <FieldGroup className="flex flex-col gap-8">
          <FieldGroupHeading text="Observações gerais" />

          <FieldGroup className="flex flex-col gap-4">
            <Field>
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
              <FieldLabel
                htmlFor="hasPartnerBeingTreated"
                className="flex gap-3 w-fit! cursor-pointer"
              >
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
                <span>Parceiro em tratamento</span>
              </FieldLabel>
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
