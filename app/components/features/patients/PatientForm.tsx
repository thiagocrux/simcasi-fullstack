'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save, Undo2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import {
  createPatient,
  getPatient,
  updatePatient,
} from '@/app/actions/patient.actions';
import {
  CreatePatientInput,
  PatientFormInput,
  patientSchema,
  UpdatePatientInput,
} from '@/core/application/validation/schemas/patient.schema';
import {
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  RACE_OPTIONS,
  SCHOOLING_OPTIONS,
  SEX_OPTIONS,
  SEXUALITY_OPTIONS,
} from '@/core/domain/constants/patient.constants';
import { useLogout } from '@/hooks/useLogout';
import { useUser } from '@/hooks/useUser';
import { toCalendarISOString } from '@/lib/formatters.utils';
import { logger } from '@/lib/logger.utils';
import { useEffect } from 'react';
import { Combobox } from '../../common/Combobox';
import { Datepicker } from '../../common/Datepicker';
import { FieldError } from '../../common/FieldError';
import { FieldGroupHeading } from '../../common/FieldGroupHeading';
import { MaskedInput } from '../../common/MaskedInput';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '../../ui/field';
import { Input } from '../../ui/input';
import { Separator } from '../../ui/separator';
import { Spinner } from '../../ui/spinner';
import { Textarea } from '../../ui/textarea';

interface PatientFormProps {
  isEditMode?: boolean;
  patientId?: string | null;
  className?: string;
}

export function PatientForm({
  isEditMode = false,
  patientId = null,
  className,
}: PatientFormProps) {
  const router = useRouter();
  const { user: loggedUser } = useUser();
  const { handleLogout } = useLogout();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors: formErrors, isSubmitting },
    setFocus,
  } = useForm<PatientFormInput>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      susCardNumber: '',
      name: '',
      cpf: '',
      socialName: '',
      birthDate: '',
      race: '',
      sex: '',
      gender: '',
      sexuality: '',
      nationality: '',
      schooling: '',
      phone: '',
      email: '',
      motherName: '',
      fatherName: '',
      isDeceased: false,
      monitoringType: '',
      zipCode: '',
      state: '',
      city: '',
      neighborhood: '',
      street: '',
      houseNumber: '',
      complement: '',
    },
  });

  const { data: patient, isPending: isFetchingPatient } = useQuery({
    queryKey: ['find-patient', patientId],
    queryFn: async () => await getPatient(patientId as string),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (patient && patient.success) {
      const {
        birthDate,
        socialName,
        fatherName,
        phone,
        email,
        zipCode,
        complement,
        ...rest
      } = patient.data;
      reset({
        ...rest,
        birthDate: toCalendarISOString(birthDate),
        socialName: socialName ?? '',
        fatherName: fatherName ?? '',
        phone: phone ?? '',
        email: email ?? '',
        zipCode: zipCode ?? '',
        complement: complement ?? '',
      });
    }
  }, [patient, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      input,
      authorId,
    }: {
      input: PatientFormInput;
      authorId: string;
    }) => {
      const payload = isEditMode
        ? { ...input, updatedBy: authorId }
        : { ...input, createdBy: authorId };

      return isEditMode && patientId
        ? updatePatient(patientId, payload as UpdatePatientInput)
        : createPatient(payload as CreatePatientInput);
    },
    onSuccess: (data) => {
      if (data.success) {
        logger.success(
          `The patient ${isEditMode ? 'update' : 'creation'} was successfull!`
        );
        reset();
        router.push('/patients');
      } else {
        logger.error('[FORM_ERROR]', data.errors);
      }
    },
  });

  const isFormBusy =
    isPending || isSubmitting || (isEditMode && isFetchingPatient);

  async function onSubmit(input: PatientFormInput) {
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

  /**
   * Automatically focuses the first field with a validation error.
   * This is necessary because some custom/controlled components (like MaskedInput or Datepicker)
   * may not receive the automatic focus from React Hook Form as native inputs do.
   *
   * This logic works in conjunction with the 'forwardRef' pattern implemented in custom
   * components, allowing the 'setFocus' method to directly access the underlying DOM element.
   * If a custom component doesn't support 'forwardRef', this focus logic will silently fail.
   */
  useEffect(() => {
    const errorFields = Object.keys(formErrors) as (keyof PatientFormInput)[];
    if (errorFields.length > 0) {
      const firstError = errorFields[0];
      setFocus(firstError);
    }
  }, [formErrors, setFocus]);

  return (
    <Card className="flex flex-col px-4 sm:px-8 py-8 sm:py-12">
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <FieldGroup className="gap-8 grid grid-cols-1">
          <FieldGroupHeading text="Identificação e dados pessoais" />

          <FieldGroup className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field>
              <Controller
                name="susCardNumber"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="susCardNumber">
                      Número do cartão do SUS
                    </FieldLabel>
                    <MaskedInput
                      {...field}
                      onValueChange={field.onChange}
                      variant="susCardNumber"
                      placeholder="700 0000 0000 0000"
                      hasError={!!formErrors.susCardNumber}
                      disabled={isFormBusy}
                    />
                    {formErrors.susCardNumber && (
                      <FieldError message={formErrors.susCardNumber.message} />
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                    <MaskedInput
                      {...field}
                      onValueChange={field.onChange}
                      variant="cpf"
                      placeholder="000.000.000-00"
                      hasError={!!formErrors.cpf}
                      disabled={isFormBusy}
                    />
                    {formErrors.cpf && (
                      <FieldError message={formErrors.cpf.message} />
                    )}
                  </>
                )}
              />
            </Field>
            <Field className="col-span-full">
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input
                {...register('name')}
                name="name"
                placeholder="Maria Silva"
                aria-invalid={!!formErrors.name}
                disabled={isFormBusy}
              />
              {formErrors.name && (
                <FieldError message={formErrors.name.message} />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="socialName">
                Nome social (opcional)
              </FieldLabel>
              <Input
                {...register('socialName')}
                name="socialName"
                placeholder="Maria"
                aria-invalid={!!formErrors.socialName}
                disabled={isFormBusy}
              />
              {formErrors.socialName && (
                <FieldError message={formErrors.socialName.message} />
              )}
            </Field>
            <Field>
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="birthDate">
                      Data de nascimento
                    </FieldLabel>
                    <Datepicker
                      {...field}
                      placeholder="dd/mm/aaaa"
                      onValueChange={field.onChange}
                      hasError={!!formErrors.birthDate}
                      disabled={isFormBusy}
                    />
                    {formErrors.birthDate && (
                      <FieldError message={formErrors.birthDate.message} />
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="motherName">Nome da mãe</FieldLabel>
              <Input
                {...register('motherName')}
                name="motherName"
                placeholder="Ana Silva"
                aria-invalid={!!formErrors.motherName}
                disabled={isFormBusy}
              />
              {formErrors.motherName && (
                <FieldError message={formErrors.motherName.message} />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="fatherName">
                Nome do pai (opcional)
              </FieldLabel>
              <Input
                {...register('fatherName')}
                name="fatherName"
                placeholder="João Silva"
                aria-invalid={!!formErrors.fatherName}
                disabled={isFormBusy}
              />
              {formErrors.fatherName && (
                <FieldError message={formErrors.fatherName.message} />
              )}
            </Field>
          </FieldGroup>

          <FieldGroupHeading text="Dados demográficos e sociais" />

          <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field>
              <Controller
                name="race"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="race">Raça</FieldLabel>
                    <Combobox
                      {...field}
                      data={RACE_OPTIONS}
                      onChange={field.onChange}
                      placeholder="Selecione a raça"
                      searchPlaceholder="Pesquisar..."
                      emptySearchMessage="Nenhum resultado encontrado."
                      disabled={isFormBusy}
                      aria-invalid={!!formErrors.race}
                    />
                    {formErrors.race && (
                      <FieldError message={formErrors.race.message} />
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="sex">Sexo</FieldLabel>
                    <Combobox
                      {...field}
                      data={SEX_OPTIONS}
                      onChange={field.onChange}
                      placeholder="Selecione o sexo"
                      searchPlaceholder="Pesquisar..."
                      emptySearchMessage="Nenhum resultado encontrado."
                      disabled={isFormBusy}
                      aria-invalid={!!formErrors.sex}
                    />
                    {formErrors.sex && (
                      <FieldError message={formErrors.sex.message} />
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="gender">Gênero</FieldLabel>
                    <Combobox
                      {...field}
                      data={GENDER_OPTIONS}
                      onChange={field.onChange}
                      placeholder="Selecione a gênero"
                      searchPlaceholder="Pesquisar..."
                      emptySearchMessage="Nenhum resultado encontrado."
                      disabled={isFormBusy}
                      aria-invalid={!!formErrors.gender}
                    />
                    {formErrors.gender && (
                      <FieldError message={formErrors.gender.message} />
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <Controller
                name="sexuality"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="sexuality">Sexualidade</FieldLabel>
                    <Combobox
                      {...field}
                      data={SEXUALITY_OPTIONS}
                      onChange={field.onChange}
                      placeholder="Selecione a sexualidade"
                      searchPlaceholder="Pesquisar..."
                      emptySearchMessage="Nenhum resultado encontrado."
                      disabled={isFormBusy}
                      aria-invalid={!!formErrors.sexuality}
                    />
                    {formErrors.sexuality && (
                      <FieldError message={formErrors.sexuality.message} />
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="nationality">Nacionalidade</FieldLabel>
                    <Combobox
                      {...field}
                      data={NATIONALITY_OPTIONS}
                      onChange={field.onChange}
                      placeholder="Selecione a nacionalidade"
                      searchPlaceholder="Pesquisar..."
                      emptySearchMessage="Nenhum resultado encontrado."
                      disabled={isFormBusy}
                      aria-invalid={!!formErrors.nationality}
                    />
                    {formErrors.nationality && (
                      <FieldError message={formErrors.nationality.message} />
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <Controller
                name="schooling"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="schooling">Escolaridade</FieldLabel>
                    <Combobox
                      {...field}
                      data={SCHOOLING_OPTIONS}
                      onChange={field.onChange}
                      placeholder="Selecione a raça"
                      searchPlaceholder="Pesquisar..."
                      emptySearchMessage="Nenhum resultado encontrado."
                      disabled={isFormBusy}
                      aria-invalid={!!formErrors.schooling}
                    />
                    {formErrors.schooling && (
                      <FieldError message={formErrors.schooling.message} />
                    )}
                  </>
                )}
              />
            </Field>
          </div>

          <FieldGroupHeading text="Situação clínica" />

          <div className="gap-x-4 gap-y-8 grid grid-cols-1 lg:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="monitoringType">
                Tipo de monitoramento
              </FieldLabel>
              <Input
                {...register('monitoringType')}
                name="monitoringType"
                placeholder="Ex: Sífilis Congênita"
                aria-invalid={!!formErrors.monitoringType}
                disabled={isFormBusy}
              />
              {formErrors.monitoringType && (
                <FieldError message={formErrors.monitoringType.message} />
              )}
            </Field>
            <Field>
              <div className="flex items-center gap-3">
                <Controller
                  control={control}
                  name="isDeceased"
                  render={({ field }) => (
                    <Checkbox
                      id="isDeceased"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isFormBusy}
                    />
                  )}
                />
                <div className="flex flex-col justify-center gap-2">
                  <FieldLabel htmlFor="isDeceased">
                    Paciente falecido?
                  </FieldLabel>
                  <FieldDescription>
                    Marque esta opção caso o paciente tenha falecido. Isso
                    encerrará o acompanhamento ativo.
                  </FieldDescription>
                </div>
              </div>
              {formErrors.isDeceased && (
                <FieldError message={formErrors.isDeceased.message} />
              )}
            </Field>
          </div>

          <FieldGroupHeading text="Contato e endereço" />

          <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <>
                    <FieldLabel htmlFor="phone">Telefone (opcional)</FieldLabel>
                    <MaskedInput
                      {...field}
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                      variant="phone"
                      placeholder="(99) 99999-9999"
                      hasError={!!formErrors.phone}
                      disabled={isFormBusy}
                    />
                    {formErrors.phone && (
                      <FieldError message={formErrors.phone.message} />
                    )}
                  </>
                )}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">E-mail (opcional)</FieldLabel>
              <Input
                {...register('email')}
                name="email"
                placeholder="exemplo@email.com"
                aria-invalid={!!formErrors.email}
                disabled={isFormBusy}
              />
              {formErrors.email && (
                <FieldError message={formErrors.email.message} />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="zipCode">CEP (opcional)</FieldLabel>
              <Input
                {...register('zipCode')}
                name="zipCode"
                placeholder="00000-000"
                aria-invalid={!!formErrors.zipCode}
                disabled={isFormBusy}
              />
              {formErrors.zipCode && (
                <FieldError message={formErrors.zipCode.message} />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="state">Estado</FieldLabel>
              <Input
                {...register('state')}
                name="state"
                placeholder="Pernambuco"
                aria-invalid={!!formErrors.state}
                disabled={isFormBusy}
              />
              {formErrors.state && (
                <FieldError message={formErrors.state.message} />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="city">Cidade</FieldLabel>
              <Input
                {...register('city')}
                name="city"
                placeholder="Petrolina"
                aria-invalid={!!formErrors.city}
                disabled={isFormBusy}
              />
              {formErrors.city && (
                <FieldError message={formErrors.city.message} />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="neighborhood">Bairro</FieldLabel>
              <Input
                {...register('neighborhood')}
                name="neighborhood"
                placeholder="Centro"
                aria-invalid={!!formErrors.neighborhood}
                disabled={isFormBusy}
              />
              {formErrors.neighborhood && (
                <FieldError message={formErrors.neighborhood.message} />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="street">Rua</FieldLabel>
              <Input
                {...register('street')}
                name="street"
                placeholder="Rua das Flores"
                aria-invalid={!!formErrors.street}
                disabled={isFormBusy}
              />
              {formErrors.street && (
                <FieldError message={formErrors.street.message} />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="houseNumber">Número da casa</FieldLabel>
              <Input
                {...register('houseNumber')}
                type="number"
                name="houseNumber"
                placeholder="123"
                aria-invalid={!!formErrors.houseNumber}
                disabled={isFormBusy}
              />
              {formErrors.houseNumber && (
                <FieldError message={formErrors.houseNumber.message} />
              )}
            </Field>
            <Field className="col-span-full">
              <FieldLabel htmlFor="complement">
                Complemento (opcional)
              </FieldLabel>
              <Textarea
                {...register('complement')}
                name="complement"
                placeholder="Apto 101"
                aria-invalid={!!formErrors.complement}
              />
              {formErrors.complement && (
                <FieldError message={formErrors.complement.message} />
              )}
            </Field>
          </div>
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
