'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { createExam, updateExam } from '@/app/actions/exam.actions';
import { useMutation } from '@tanstack/react-query';
import { Datepicker } from '../../common/Datepicker';
import { FieldErrorMessage } from '../../common/FieldErrorMessage';
import { Button } from '../../ui/button';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';
import { Textarea } from '../../ui/textarea';

import {
  CreateExamInput,
  examSchema,
} from '@/core/domain/validation/schemas/exam.schema';

interface ExamFormProps {
  isEditMode: boolean;
  className?: string;
}

export function ExamForm({ isEditMode, className }: ExamFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    control,
  } = useForm<CreateExamInput>({
    resolver: zodResolver(examSchema),
    defaultValues: {
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

  const examMutation = useMutation({
    mutationFn: (input: CreateExamInput) =>
      isEditMode ? updateExam(input) : createExam(input),
    onSuccess: () => {
      // TODO: Implement success case.
    },
    onError: (error: unknown) => {
      // TODO: Implement error case.
      console.error('Submit error:', error);
    },
  });

  async function onSubmit(input: CreateExamInput) {
    examMutation.mutate(input);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <FieldGroup className="grid grid-cols-1">
        <Field>
          <FieldLabel htmlFor="treponemalTestType">
            Tipo de teste treponêmico
          </FieldLabel>
          <Input
            {...register('treponemalTestType')}
            name="treponemalTestType"
            placeholder="Insira o tipo de teste treponêmico"
            aria-invalid={!!formErrors.treponemalTestType}
          />
          {formErrors.treponemalTestType && (
            <FieldErrorMessage
              message={formErrors.treponemalTestType.message}
            />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="treponemalTestResult">
            Resultado do teste treponêmico
          </FieldLabel>
          <Input
            {...register('treponemalTestResult')}
            name="treponemalTestResult"
            placeholder="Insira o resultado do teste treponêmico"
            aria-invalid={!!formErrors.treponemalTestResult}
          />
          {formErrors.treponemalTestResult && (
            <FieldErrorMessage
              message={formErrors.treponemalTestResult.message}
            />
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
                  placeholder="Selecione a data do teste treponêmico"
                  value={field.value}
                  onValueChange={field.onChange}
                  hasError={!!formErrors.treponemalTestDate}
                />
                {formErrors.treponemalTestDate && (
                  <FieldErrorMessage
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
            placeholder="Insira o local do teste treponêmico"
            aria-invalid={!!formErrors.treponemalTestLocation}
          />
          {formErrors.treponemalTestLocation && (
            <FieldErrorMessage
              message={formErrors.treponemalTestLocation.message}
            />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="nontreponemalVdrlTest">
            Teste VDRL não treponêmico
          </FieldLabel>
          <Input
            {...register('nontreponemalVdrlTest')}
            name="nontreponemalVdrlTest"
            placeholder="Insira o resultado do teste VDRL não treponêmico"
            aria-invalid={!!formErrors.nontreponemalVdrlTest}
          />
          {formErrors.nontreponemalVdrlTest && (
            <FieldErrorMessage
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
            placeholder="Insira a titulação do teste não treponêmico"
            aria-invalid={!!formErrors.nontreponemalTestTitration}
          />
          {formErrors.nontreponemalTestTitration && (
            <FieldErrorMessage
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
                  placeholder="Selecione a data do teste não treponêmico"
                  value={field.value}
                  onValueChange={field.onChange}
                  hasError={!!formErrors.nontreponemalTestDate}
                />
                {formErrors.nontreponemalTestDate && (
                  <FieldErrorMessage
                    message={formErrors.nontreponemalTestDate.message}
                  />
                )}
              </>
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="otherNontreponemalTest">
            Outro teste não treponêmico (opcional)
          </FieldLabel>
          <Input
            {...register('otherNontreponemalTest')}
            name="otherNontreponemalTest"
            placeholder="Insira outro teste não treponêmico"
            aria-invalid={!!formErrors.otherNontreponemalTest}
          />
          {formErrors.otherNontreponemalTest && (
            <FieldErrorMessage
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
                  placeholder="Selecione a data do outro teste não treponêmico"
                  value={field.value}
                  onValueChange={field.onChange}
                  hasError={!!formErrors.otherNontreponemalTestDate}
                />
                {formErrors.otherNontreponemalTestDate && (
                  <FieldErrorMessage
                    message={formErrors.otherNontreponemalTestDate.message}
                  />
                )}
              </>
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="referenceObservations">
            Observações de referência
          </FieldLabel>
          <Textarea
            {...register('referenceObservations')}
            name="referenceObservations"
            placeholder="Insira observações de referência"
            aria-invalid={!!formErrors.referenceObservations}
          />
          {formErrors.referenceObservations && (
            <FieldErrorMessage
              message={formErrors.referenceObservations.message}
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
        Entrar
      </Button>
    </form>
  );
}
