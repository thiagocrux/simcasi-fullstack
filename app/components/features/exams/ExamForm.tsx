'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { createExam, getExam, updateExam } from '@/app/actions/exam.actions';
import { Datepicker } from '../../common/Datepicker';
import { FieldError } from '../../common/FieldError';
import { FieldGroupHeading } from '../../common/FieldGroupHeading';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';
import { Textarea } from '../../ui/textarea';

import {
  CreateExamInput,
  ExamFormInput,
  examSchema,
  UpdateExamInput,
} from '@/core/application/validation/schemas/exam.schema';
import { useLogout } from '@/hooks/useLogout';
import { useUser } from '@/hooks/useUser';
import { toCalendarISOString } from '@/lib/formatters.utils';
import { logger } from '@/lib/logger.utils';
import { useEffect } from 'react';

interface ExamFormProps {
  isEditMode?: boolean;
  examId?: string | null;
  patientId: string;
  className?: string;
}

export function ExamForm({
  isEditMode = false,
  examId = null,
  patientId,
  className,
}: ExamFormProps) {
  const router = useRouter();
  const { user: loggedUser } = useUser();
  const { handleLogout } = useLogout();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isSubmitting },
    control,
  } = useForm<ExamFormInput>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      patientId,
      treponemalTestType: '',
      treponemalTestResult: '',
      treponemalTestDate: '',
      treponemalTestLocation: '',
      nontreponemalVdrlTest: '',
      nontreponemalTestTitration: '',
      nontreponemalTestDate: '',
      otherNontreponemalTest: '',
      otherNontreponemalTestDate: '',
      referenceObservations: '',
    },
  });

  const { data: exam, isPending: isFetchingExam } = useQuery({
    queryKey: ['get-exam', examId],
    queryFn: async () => await getExam(examId as string),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (exam && exam.success) {
      const {
        treponemalTestDate,
        nontreponemalTestDate,
        otherNontreponemalTestDate,
        otherNontreponemalTest,
        referenceObservations,
        ...rest
      } = exam.data;

      reset({
        ...rest,
        treponemalTestDate: toCalendarISOString(treponemalTestDate),
        nontreponemalTestDate: toCalendarISOString(nontreponemalTestDate),
        otherNontreponemalTestDate: toCalendarISOString(
          otherNontreponemalTestDate
        ),
        otherNontreponemalTest: otherNontreponemalTest ?? '',
        referenceObservations: referenceObservations ?? '',
      });
    }
  }, [exam, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      input,
      authorId,
    }: {
      input: ExamFormInput;
      authorId: string;
    }) => {
      const payload = isEditMode
        ? { ...input, updatedBy: authorId }
        : { ...input, createdBy: authorId };

      return isEditMode && examId
        ? updateExam(examId, payload as UpdateExamInput)
        : createExam(payload as CreateExamInput);
    },
    onSuccess: () => {
      logger.success(
        `The exam ${isEditMode ? 'update' : 'creation'} was successfull!`
      );
      reset();
      router.push('/exams');
    },
    onError: (error: unknown) => {
      logger.error('[FORM_ERROR]', error);
    },
  });

  const isFormBusy =
    isPending || isSubmitting || (isEditMode && isFetchingExam);

  async function onSubmit(input: ExamFormInput) {
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
          <FieldGroupHeading text="Teste treponêmico" />

          <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="treponemalTestType">
                Tipo de teste treponêmico
              </FieldLabel>
              <Input
                {...register('treponemalTestType')}
                name="treponemalTestType"
                placeholder="Ex: Teste Rápido"
                aria-invalid={!!formErrors.treponemalTestType}
                disabled={isFormBusy}
              />
              {formErrors.treponemalTestType && (
                <FieldError message={formErrors.treponemalTestType.message} />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="treponemalTestResult">
                Resultado do teste treponêmico
              </FieldLabel>
              <Input
                {...register('treponemalTestResult')}
                name="treponemalTestResult"
                placeholder="Ex: Reagente"
                aria-invalid={!!formErrors.treponemalTestResult}
                disabled={isFormBusy}
              />
              {formErrors.treponemalTestResult && (
                <FieldError message={formErrors.treponemalTestResult.message} />
              )}
            </Field>
            <Field>
              <Controller
                name="treponemalTestDate"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="treponemalTestDate">
                      Data do teste treponêmico
                    </FieldLabel>
                    <Datepicker
                      {...field}
                      placeholder="dd/mm/aaaa"
                      value={field.value}
                      onValueChange={field.onChange}
                      hasError={!!formErrors.treponemalTestDate}
                      disabled={isFormBusy}
                    />
                    {formErrors.treponemalTestDate && (
                      <FieldError
                        message={formErrors.treponemalTestDate.message}
                      />
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="treponemalTestLocation">
                Local do teste treponêmico
              </FieldLabel>
              <Input
                {...register('treponemalTestLocation')}
                name="treponemalTestLocation"
                placeholder="Ex: UBS Centro"
                aria-invalid={!!formErrors.treponemalTestLocation}
                disabled={isFormBusy}
              />
              {formErrors.treponemalTestLocation && (
                <FieldError
                  message={formErrors.treponemalTestLocation.message}
                />
              )}
            </Field>
          </div>

          <FieldGroupHeading text="Teste não treponêmico" />

          <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="nontreponemalVdrlTest">
                Teste VDRL não treponêmico
              </FieldLabel>
              <Input
                {...register('nontreponemalVdrlTest')}
                name="nontreponemalVdrlTest"
                placeholder="Ex: Reagente"
                aria-invalid={!!formErrors.nontreponemalVdrlTest}
                disabled={isFormBusy}
              />
              {formErrors.nontreponemalVdrlTest && (
                <FieldError
                  message={formErrors.nontreponemalVdrlTest.message}
                />
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="nontreponemalTestTitration">
                Titulação do teste não treponêmico
              </FieldLabel>
              <Input
                {...register('nontreponemalTestTitration')}
                name="nontreponemalTestTitration"
                placeholder="Ex: 1:8"
                aria-invalid={!!formErrors.nontreponemalTestTitration}
                disabled={isFormBusy}
              />
              {formErrors.nontreponemalTestTitration && (
                <FieldError
                  message={formErrors.nontreponemalTestTitration.message}
                />
              )}
            </Field>

            <Field>
              <Controller
                name="nontreponemalTestDate"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="nontreponemalTestDate">
                      Data do teste não treponêmico
                    </FieldLabel>
                    <Datepicker
                      {...field}
                      placeholder="dd/mm/aaaa"
                      value={field.value}
                      onValueChange={field.onChange}
                      hasError={!!formErrors.nontreponemalTestDate}
                      disabled={isFormBusy}
                    />
                    {formErrors.nontreponemalTestDate && (
                      <FieldError
                        message={formErrors.nontreponemalTestDate.message}
                      />
                    )}
                  </>
                )}
              />
            </Field>
          </div>

          <FieldGroupHeading text="Outros" />

          <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="otherNontreponemalTest">
                Outro teste não treponêmico (opcional)
              </FieldLabel>
              <Input
                {...register('otherNontreponemalTest')}
                name="otherNontreponemalTest"
                placeholder="Ex: Teste Rápido"
                aria-invalid={!!formErrors.otherNontreponemalTest}
                disabled={isFormBusy}
              />
              {formErrors.otherNontreponemalTest && (
                <FieldError
                  message={formErrors.otherNontreponemalTest.message}
                />
              )}
            </Field>

            <Field>
              <Controller
                name="otherNontreponemalTestDate"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="otherNontreponemalTestDate">
                      Data do outro teste não treponêmico (opcional)
                    </FieldLabel>
                    <Datepicker
                      placeholder="dd/mm/aaaa"
                      value={field.value}
                      onValueChange={field.onChange}
                      hasError={!!formErrors.otherNontreponemalTestDate}
                      disabled={isFormBusy}
                    />
                    {formErrors.otherNontreponemalTestDate && (
                      <FieldError
                        message={formErrors.otherNontreponemalTestDate.message}
                      />
                    )}
                  </>
                )}
              />
            </Field>

            <Field className="col-span-full">
              <FieldLabel htmlFor="referenceObservations">
                Observações de referência
              </FieldLabel>
              <Textarea
                {...register('referenceObservations')}
                name="referenceObservations"
                placeholder="Ex: Paciente encaminhado para tratamento."
                aria-invalid={!!formErrors.referenceObservations}
                disabled={isFormBusy}
              />
              {formErrors.referenceObservations && (
                <FieldError
                  message={formErrors.referenceObservations.message}
                />
              )}
            </Field>
          </div>
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
