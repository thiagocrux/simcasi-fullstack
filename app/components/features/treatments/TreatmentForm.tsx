'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { Datepicker } from '../../common/Datepicker';
import { FieldError } from '../../common/FieldError';
import { FieldGroupHeading } from '../../common/FieldGroupHeading';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
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
} from '@/core/application/validation/schemas/treatment.schema';

interface TreatmentFormProps {
  isEditMode?: boolean;
  className?: string;
}

export function TreatmentForm({
  isEditMode = false,
  className,
}: TreatmentFormProps) {
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
    <Card className="flex flex-col px-4 sm:px-8 py-8 sm:py-12">
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <FieldGroup className="gap-8 grid grid-cols-1">
          <FieldGroupHeading text="Dados do tratamento" />

          <FieldGroup className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="medication">Medicação</FieldLabel>
              <Input
                {...register('medication')}
                name="medication"
                placeholder="Ex: Penicilina Benzatina"
                aria-invalid={!!formErrors.medication}
              />
              {formErrors.medication && (
                <FieldError message={formErrors.medication.message} />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="healthCenter">
                Unidade Básica de Saúde
              </FieldLabel>
              <Input
                {...register('healthCenter')}
                name="healthCenter"
                placeholder="Ex: UBS Centro"
                aria-invalid={!!formErrors.healthCenter}
              />
              {formErrors.healthCenter && (
                <FieldError message={formErrors.healthCenter.message} />
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
                      placeholder="DD/MM/AAAA"
                      value={field.value}
                      onValueChange={field.onChange}
                      hasError={!!formErrors.startDate}
                    />
                    {formErrors.startDate && (
                      <FieldError message={formErrors.startDate.message} />
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
                placeholder="Ex: 2.400.000 UI"
                aria-invalid={!!formErrors.dosage}
              />
              {formErrors.dosage && (
                <FieldError message={formErrors.dosage.message} />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="observations">
                Observações (opcional)
              </FieldLabel>
              <Input
                {...register('observations')}
                name="observations"
                placeholder="Ex: Paciente apresentou melhora."
                aria-invalid={!!formErrors.observations}
              />
              {formErrors.observations && (
                <FieldError message={formErrors.observations.message} />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="partnerInformation">
                Informações do parceiro (opcional)
              </FieldLabel>
              <Input
                {...register('partnerInformation')}
                name="partnerInformation"
                placeholder="Ex: Parceiro tratado na mesma data."
                aria-invalid={!!formErrors.partnerInformation}
              />
              {formErrors.partnerInformation && (
                <FieldError message={formErrors.partnerInformation.message} />
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
