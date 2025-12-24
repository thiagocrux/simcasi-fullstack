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

import {
  createObservation,
  updateObservation,
} from '@/app/actions/observation.actions';

import {
  CreateObservationInput,
  observationSchema,
} from '@/core/domain/validation/schemas/observation.schema';

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
          <FieldLabel htmlFor="observations">Observações</FieldLabel>
          <Input
            {...register('observations')}
            name="observations"
            placeholder="Insira observações (opcional)"
            aria-invalid={!!formErrors.observations}
          />
          {formErrors.observations && (
            <FieldErrorMessage message={formErrors.observations.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="partnerBeingTreated">
            Parceiro em tratamento
          </FieldLabel>
          <Input
            {...register('partnerBeingTreated')}
            name="partnerBeingTreated"
            type="checkbox"
            aria-invalid={!!formErrors.partnerBeingTreated}
          />
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
