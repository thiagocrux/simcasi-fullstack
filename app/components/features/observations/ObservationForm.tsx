'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { FieldError } from '../../common/FieldError';
import { FieldGroupHeading } from '../../common/FieldGroupHeading';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';

import {
  createObservation,
  updateObservation,
} from '@/app/actions/observation.actions';

import {
  CreateObservationInput,
  observationSchema,
} from '@/core/domain/validation/schemas/observation.schema';

interface ObservationFormProps {
  isEditMode?: boolean;
  className?: string;
}

export function ObservationForm({
  isEditMode = false,
  className,
}: ObservationFormProps) {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<CreateObservationInput>({
    resolver: zodResolver(observationSchema),
    defaultValues: {
      observations: '',
      partnerBeingTreated: false,
    },
  });

  const observationMutation = useMutation({
    mutationFn: (input: CreateObservationInput) =>
      isEditMode ? updateObservation(input) : createObservation(input),
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
                  name="partnerBeingTreated"
                  render={({ field }) => (
                    <Checkbox
                      id="partnerBeingTreated"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <FieldLabel htmlFor="partnerBeingTreated">
                  Parceiro em tratamento
                </FieldLabel>
              </div>
              {formErrors.partnerBeingTreated && (
                <FieldError message={formErrors.partnerBeingTreated.message} />
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
