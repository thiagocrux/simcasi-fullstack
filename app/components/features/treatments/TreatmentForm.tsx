'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { Datepicker } from '../../common/Datepicker';
import { FieldErrorMessage } from '../../common/FieldErrorMessage';
import { Button } from '../../ui/button';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';

import {
  createTreatment,
  updateTreatment,
} from '@/app/actions/treatment.actions';

import {
  CreateTreatmentInput,
  treatmentSchema,
} from '@/core/domain/validation/schemas/treatment.schema';

interface TreatmentFormProps {
  isEditMode: boolean;
  className?: string;
}

export function TreatmentForm({ isEditMode, className }: TreatmentFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<CreateTreatmentInput>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      medication: '',
      healthCenter: '',
      startDate: '',
      dosage: '',
      observations: '',
      partnerInformation: '',
    },
  });

  const treatmentMutation = useMutation({
    mutationFn: (input: CreateTreatmentInput) =>
      isEditMode ? updateTreatment(input) : createTreatment(input),
    onSuccess: () => {
      // TODO: Implement success case
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  async function onSubmit(input: CreateTreatmentInput) {
    treatmentMutation.mutate(input);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <FieldGroup className="grid grid-cols-1">
        <Field>
          <FieldLabel htmlFor="medication">Medicação</FieldLabel>
          <Input
            {...register('medication')}
            name="medication"
            placeholder="Insira a medicação"
            aria-invalid={!!formErrors.medication}
          />
          {formErrors.medication && (
            <FieldErrorMessage message={formErrors.medication.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="healthCenter">
            Unidade Básica de Saúde
          </FieldLabel>
          <Input
            {...register('healthCenter')}
            name="healthCenter"
            placeholder="Insira a Unidade Básica de Saúde"
            aria-invalid={!!formErrors.healthCenter}
          />
          {formErrors.healthCenter && (
            <FieldErrorMessage message={formErrors.healthCenter.message} />
          )}
        </Field>

        <Field>
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <>
                <FieldLabel htmlFor="startDate">Data de início</FieldLabel>
                <Datepicker
                  placeholder="Selecione a data de início"
                  value={field.value}
                  onValueChange={field.onChange}
                  hasError={!!formErrors.startDate}
                />
                {formErrors.startDate && (
                  <FieldErrorMessage message={formErrors.startDate.message} />
                )}
              </>
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="dosage">Dosagem</FieldLabel>
          <Input
            {...register('dosage')}
            name="dosage"
            placeholder="Insira a dosagem"
            aria-invalid={!!formErrors.dosage}
          />
          {formErrors.dosage && (
            <FieldErrorMessage message={formErrors.dosage.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="observations">Observações (opcional)</FieldLabel>
          <Input
            {...register('observations')}
            name="observations"
            placeholder="Insira as observações do tratamento"
            aria-invalid={!!formErrors.observations}
          />
          {formErrors.observations && (
            <FieldErrorMessage message={formErrors.observations.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="partnerInformation">
            Informações do parceiro (opcional)
          </FieldLabel>
          <Input
            {...register('partnerInformation')}
            name="partnerInformation"
            placeholder="Insira as informações do parceiro"
            aria-invalid={!!formErrors.partnerInformation}
          />
          {formErrors.partnerInformation && (
            <FieldErrorMessage
              message={formErrors.partnerInformation.message}
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
