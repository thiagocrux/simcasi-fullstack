'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import {
  createTreatment,
  getTreatment,
  updateTreatment,
} from '@/app/actions/treatment.actions';
import {
  CreateTreatmentInput,
  TreatmentFormInput,
  treatmentSchema,
  UpdateTreatmentInput,
} from '@/core/application/validation/schemas/treatment.schema';
import { useLogout } from '@/hooks/useLogout';
import { useUser } from '@/hooks/useUser';
import { toCalendarISOString } from '@/lib/formatters.utils';
import { logger } from '@/lib/logger.utils';
import { useEffect } from 'react';
import { Datepicker } from '../../common/Datepicker';
import { FieldError } from '../../common/FieldError';
import { FieldGroupHeading } from '../../common/FieldGroupHeading';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';

interface TreatmentFormProps {
  isEditMode?: boolean;
  treatmentId?: string | null;
  patientId: string;
  className?: string;
}

export function TreatmentForm({
  isEditMode = false,
  treatmentId = null,
  patientId,
  className,
}: TreatmentFormProps) {
  const router = useRouter();
  const { user: loggedUser } = useUser();
  const { handleLogout } = useLogout();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<TreatmentFormInput>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      patientId,
      medication: '',
      healthCenter: '',
      startDate: '',
      dosage: '',
      observations: '',
      partnerInformation: '',
    },
  });

  // ...existing code...
  const { data: treatment, isPending: isFetchingTreatment } = useQuery({
    queryKey: ['get-treatment', treatmentId],
    queryFn: async () => await getTreatment(treatmentId as string),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (treatment && treatment.success) {
      const { startDate, observations, partnerInformation, ...rest } =
        treatment.data;

      reset({
        ...rest,
        startDate: toCalendarISOString(startDate),
        observations: observations ?? '',
        partnerInformation: partnerInformation ?? '',
      });
    }
  }, [treatment, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      input,
      authorId,
    }: {
      input: TreatmentFormInput;
      authorId: string;
    }) => {
      const payload = isEditMode
        ? { ...input, updatedBy: authorId }
        : { ...input, createdBy: authorId };

      return isEditMode && treatmentId
        ? updateTreatment(treatmentId, payload as UpdateTreatmentInput)
        : createTreatment(payload as CreateTreatmentInput);
    },
    onSuccess: () => {
      logger.success(
        `The treatment ${isEditMode ? 'update' : 'creation'} was successfull!`
      );
      reset();
      router.push('/treatments');
    },
    onError: (error: unknown) => {
      logger.error('[FORM_ERROR]', error);
    },
  });

  const isFormBusy =
    isPending || isSubmitting || (isEditMode && isFetchingTreatment);

  async function onSubmit(input: TreatmentFormInput) {
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
          <FieldGroupHeading text="Dados do tratamento" />

          <FieldGroup className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="medication">Medicação</FieldLabel>
              <Input
                {...register('medication')}
                name="medication"
                placeholder="Ex: Penicilina Benzatina"
                aria-invalid={!!formErrors.medication}
                disabled={isFormBusy}
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
                disabled={isFormBusy}
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
                      placeholder="dd/mm/aaaa"
                      value={field.value}
                      onValueChange={field.onChange}
                      hasError={!!formErrors.startDate}
                      disabled={isFormBusy}
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
                disabled={isFormBusy}
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
                disabled={isFormBusy}
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
                disabled={isFormBusy}
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
          disabled={isFormBusy}
        >
          {isSubmitting ? <Spinner /> : <Save />}
          {isEditMode ? 'Atualizar' : 'Salvar'}
        </Button>
      </form>
    </Card>
  );
}
