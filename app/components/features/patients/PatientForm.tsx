'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { createPatient } from '@/app/actions/patient.actions';
import { FieldErrorMessage } from '../../common/FieldErrorMessage';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';

import {
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  RACE_OPTIONS,
  SEX_OPTIONS,
  SEXUALITY_OPTIONS,
} from '@/core/domain/constants/patient.constants';
import {
  CreatePatientInput,
  patientSchema,
} from '@/core/domain/validation/schemas/patient.schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

interface PatientFormProps {
  className?: string;
}

export function PatientForm({ className }: PatientFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<CreatePatientInput>({
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

  const mutation = useMutation({
    mutationFn: (input: CreatePatientInput) => createPatient(input),
    onSuccess: () => {
      // TODO: Implement success case
    },
    onError: (error: unknown) => {
      console.error('Submit error:', error);
    },
  });

  async function onSubmit(input: CreatePatientInput) {
    mutation.mutate(input);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <FieldGroup className="grid grid-cols-1">
        <Field>
          <FieldLabel htmlFor="susCardNumber">
            Número do cartão do SUS
          </FieldLabel>
          <Input
            {...register('susCardNumber')}
            name="susCardNumber"
            placeholder="Insira o número do cartão do SUS"
            aria-invalid={!!formErrors.susCardNumber}
          />
          {formErrors.susCardNumber && (
            <FieldErrorMessage message={formErrors.susCardNumber.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <Input
            {...register('name')}
            name="name"
            placeholder="Insira o nome"
            aria-invalid={!!formErrors.name}
          />
          {formErrors.name && (
            <FieldErrorMessage message={formErrors.name.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="cpf">CPF</FieldLabel>
          <Input
            {...register('cpf')}
            name="cpf"
            placeholder="Insira o CPF"
            aria-invalid={!!formErrors.cpf}
          />
          {formErrors.cpf && (
            <FieldErrorMessage message={formErrors.cpf.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="socialName">Nome social (opcional)</FieldLabel>
          <Input
            {...register('socialName')}
            name="socialName"
            placeholder="Insira o nome social"
            aria-invalid={!!formErrors.socialName}
          />
          {formErrors.socialName && (
            <FieldErrorMessage message={formErrors.socialName.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="birthDate">Data de nascimento</FieldLabel>
          <Input
            {...register('birthDate')}
            name="birthDate"
            placeholder="Insira a data de nascimento"
            aria-invalid={!!formErrors.birthDate}
          />
          {formErrors.birthDate && (
            <FieldErrorMessage message={formErrors.birthDate.message} />
          )}
        </Field>

        <Field>
          <Controller
            name="race"
            control={control}
            render={({ field }) => (
              <>
                <FieldLabel htmlFor="race">Raça</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={
                      formErrors.race
                        ? 'border-destructive! focus:ring-destructive/30!'
                        : ''
                    }
                  >
                    <SelectValue placeholder="Selecione a raça" />
                  </SelectTrigger>
                  <SelectContent>
                    {RACE_OPTIONS.map((race) => (
                      <SelectItem key={race.value} value={race.value}>
                        {race.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.race && (
                  <FieldErrorMessage message={formErrors.race.message} />
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={
                      formErrors.sex
                        ? 'border-destructive! focus:ring-destructive/30!'
                        : ''
                    }
                  >
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEX_OPTIONS.map((sex) => (
                      <SelectItem key={sex.value} value={sex.value}>
                        {sex.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.sex && (
                  <FieldErrorMessage message={formErrors.sex.message} />
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={
                      formErrors.gender
                        ? 'border-destructive! focus:ring-destructive/30!'
                        : ''
                    }
                  >
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((gender) => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.gender && (
                  <FieldErrorMessage message={formErrors.gender.message} />
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={
                      formErrors.sexuality
                        ? 'border-destructive! focus:ring-destructive/30!'
                        : ''
                    }
                  >
                    <SelectValue placeholder="Selecione a sexualidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEXUALITY_OPTIONS.map((sexuality) => (
                      <SelectItem key={sexuality.value} value={sexuality.value}>
                        {sexuality.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.sexuality && (
                  <FieldErrorMessage message={formErrors.sexuality.message} />
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={
                      formErrors.nationality
                        ? 'border-destructive! focus:ring-destructive/30!'
                        : ''
                    }
                  >
                    <SelectValue placeholder="Selecione a nacionalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {NATIONALITY_OPTIONS.map((nationality) => (
                      <SelectItem
                        key={nationality.value}
                        value={nationality.value}
                      >
                        {nationality.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.nationality && (
                  <FieldErrorMessage message={formErrors.nationality.message} />
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={
                      formErrors.schooling
                        ? 'border-destructive! focus:ring-destructive/30!'
                        : ''
                    }
                  >
                    <SelectValue placeholder="Selecione a escolaridade" />
                  </SelectTrigger>
                  <SelectContent>
                    {RACE_OPTIONS.map((schooling) => (
                      <SelectItem key={schooling.value} value={schooling.value}>
                        {schooling.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.schooling && (
                  <FieldErrorMessage message={formErrors.schooling.message} />
                )}
              </>
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Telefone (opcional)</FieldLabel>
          <Input
            {...register('phone')}
            name="phone"
            placeholder="Insira o telefone"
            aria-invalid={!!formErrors.phone}
          />
          {formErrors.phone && (
            <FieldErrorMessage message={formErrors.phone.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">E-mail (opcional)</FieldLabel>
          <Input
            {...register('email')}
            name="email"
            placeholder="Insira o e-mail"
            aria-invalid={!!formErrors.email}
          />
          {formErrors.email && (
            <FieldErrorMessage message={formErrors.email.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="motherName">Nome da mãe</FieldLabel>
          <Input
            {...register('motherName')}
            name="motherName"
            placeholder="Insira o nome da mãe"
            aria-invalid={!!formErrors.motherName}
          />
          {formErrors.motherName && (
            <FieldErrorMessage message={formErrors.motherName.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="fatherName">Nome do pai (opcional)</FieldLabel>
          <Input
            {...register('fatherName')}
            name="fatherName"
            placeholder="Insira o nome do pai"
            aria-invalid={!!formErrors.fatherName}
          />
          {formErrors.fatherName && (
            <FieldErrorMessage message={formErrors.fatherName.message} />
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
                />
              )}
            />
            <FieldLabel htmlFor="isDeceased">Falecido</FieldLabel>
          </div>
          {formErrors.isDeceased && (
            <FieldErrorMessage message={formErrors.isDeceased.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="monitoringType">
            Tipo de monitoramento
          </FieldLabel>
          <Input
            {...register('monitoringType')}
            name="monitoringType"
            placeholder="Insira o tipo de monitoramento"
            aria-invalid={!!formErrors.monitoringType}
          />
          {formErrors.monitoringType && (
            <FieldErrorMessage message={formErrors.monitoringType.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="zipCode">CEP (opcional)</FieldLabel>
          <Input
            {...register('zipCode')}
            name="zipCode"
            placeholder="Insira o CEP"
            aria-invalid={!!formErrors.zipCode}
          />
          {formErrors.zipCode && (
            <FieldErrorMessage message={formErrors.zipCode.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="state">Estado</FieldLabel>
          <Input
            {...register('state')}
            name="state"
            placeholder="Insira o estado"
            aria-invalid={!!formErrors.state}
          />
          {formErrors.state && (
            <FieldErrorMessage message={formErrors.state.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="city">Cidade</FieldLabel>
          <Input
            {...register('city')}
            name="city"
            placeholder="Insira a cidade"
            aria-invalid={!!formErrors.city}
          />
          {formErrors.city && (
            <FieldErrorMessage message={formErrors.city.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="neighborhood">Bairro</FieldLabel>
          <Input
            {...register('neighborhood')}
            name="neighborhood"
            placeholder="Insira o bairro"
            aria-invalid={!!formErrors.neighborhood}
          />
          {formErrors.neighborhood && (
            <FieldErrorMessage message={formErrors.neighborhood.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="street">Rua</FieldLabel>
          <Input
            {...register('street')}
            name="street"
            placeholder="Insira a rua"
            aria-invalid={!!formErrors.street}
          />
          {formErrors.street && (
            <FieldErrorMessage message={formErrors.street.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="houseNumber">Número da casa</FieldLabel>
          <Input
            {...register('houseNumber')}
            name="houseNumber"
            placeholder="Insira o número da casa"
            aria-invalid={!!formErrors.houseNumber}
          />
          {formErrors.houseNumber && (
            <FieldErrorMessage message={formErrors.houseNumber.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="complement">Complemento (opcional)</FieldLabel>
          <Input
            {...register('complement')}
            name="complement"
            placeholder="Insira o complemento"
            aria-invalid={!!formErrors.complement}
          />
          {formErrors.complement && (
            <FieldErrorMessage message={formErrors.complement.message} />
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
