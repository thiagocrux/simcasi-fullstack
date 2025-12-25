'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { FieldErrorMessage } from '../../common/FieldErrorMessage';
import { Button } from '../../ui/button';
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
import { Checkbox } from '../../ui/checkbox';

interface ObservationFormProps {
  isEditMode: boolean;
  className?: string;
}

export function ObservationForm({
  isEditMode,
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
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <FieldGroup className="grid grid-cols-1">
        <Field>
          <FieldLabel htmlFor="observations">Observações (opcional)</FieldLabel>
          <Input
            {...register('observations')}
            name="observations"
            placeholder="Insira observações"
            aria-invalid={!!formErrors.observations}
          />
          {formErrors.observations && (
            <FieldErrorMessage message={formErrors.observations.message} />
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
            <FieldErrorMessage
              message={formErrors.partnerBeingTreated.message}
            />
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
