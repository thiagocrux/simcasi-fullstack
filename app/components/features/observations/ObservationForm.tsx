'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import {
  createObservation,
  updateObservation,
} from '@/app/actions/observation.actions';
import {
  CreateObservationInput,
  observationSchema,
} from '@/core/application/validation/schemas/observation.schema';
import { FieldError } from '../../common/FieldError';
import { FieldGroupHeading } from '../../common/FieldGroupHeading';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
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

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<CreateObservationInput>({
    resolver: zodResolver(observationSchema),
    defaultValues: {
      patientId,
      observations: '',
      hasPartnerBeingTreated: false,
    },
  });

  const observationMutation = useMutation({
    mutationFn: (input: CreateObservationInput) =>
      isEditMode && observationId
        ? updateObservation(observationId, input)
        : createObservation(input),
    onSuccess: () => {
      // TODO: Implement success case
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  async function onSubmit(input: CreateObservationInput) {
    observationMutation.mutate(input);
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
