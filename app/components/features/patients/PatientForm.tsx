'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { createPatient } from '@/app/actions/patient.actions';
import { Datepicker } from '../../common/Datepicker';
import { FieldError } from '../../common/FieldError';
import { FieldGroupHeading } from '../../common/FieldGroupHeading';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';
import { Textarea } from '../../ui/textarea';

import {
  GENDER_OPTIONS,
  NATIONALITY_OPTIONS,
  RACE_OPTIONS,
  SCHOOLING_OPTIONS,
  SEX_OPTIONS,
  SEXUALITY_OPTIONS,
} from '@/core/domain/constants/patient.constants';

import {
  CreatePatientInput,
  patientSchema,
} from '@/core/application/validation/schemas/patient.schema';

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '../../ui/field';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

interface PatientFormProps {
  isEditMode?: boolean;
  className?: string;
}

export function PatientForm({
  isEditMode = false,
  className,
}: PatientFormProps) {
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
    <Card className="flex flex-col px-4 sm:px-8 py-8 sm:py-12">
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <FieldGroup className="gap-8 grid grid-cols-1">
          <FieldGroupHeading text="Identificação e dados pessoais" />

          <FieldGroup className="gap-4 grid grid-cols-1 lg:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="susCardNumber">
                Número do cartão do SUS
              </FieldLabel>
              <Input
                {...register('susCardNumber')}
                name="susCardNumber"
                placeholder="700 0000 0000 0000"
                aria-invalid={!!formErrors.susCardNumber}
              />
              {formErrors.susCardNumber && (
                <FieldError message={formErrors.susCardNumber.message} />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="cpf">CPF</FieldLabel>
              <Input
                {...register('cpf')}
                name="cpf"
                placeholder="000.000.000-00"
                aria-invalid={!!formErrors.cpf}
              />
              {formErrors.cpf && (
                <FieldError message={formErrors.cpf.message} />
              )}
            </Field>
            <Field className="col-span-full">
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input
                {...register('name')}
                name="name"
                placeholder="Maria Silva"
                aria-invalid={!!formErrors.name}
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
                      placeholder="DD/MM/AAAA"
                      value={field.value}
                      onValueChange={field.onChange}
                      hasError={!!formErrors.birthDate}
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
                          <SelectItem
                            key={sexuality.value}
                            value={sexuality.value}
                          >
                            {sexuality.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        {SCHOOLING_OPTIONS.map((schooling) => (
                          <SelectItem
                            key={schooling.value}
                            value={schooling.value}
                          >
                            {schooling.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <FieldLabel htmlFor="phone">Telefone (opcional)</FieldLabel>
              <Input
                {...register('phone')}
                name="phone"
                placeholder="(99) 99999-9999"
                aria-invalid={!!formErrors.phone}
              />
              {formErrors.phone && (
                <FieldError message={formErrors.phone.message} />
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">E-mail (opcional)</FieldLabel>
              <Input
                {...register('email')}
                name="email"
                placeholder="exemplo@email.com"
                aria-invalid={!!formErrors.email}
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
