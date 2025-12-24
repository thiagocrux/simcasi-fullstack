'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { signInUser } from '@/app/actions/session.actions';
import { FieldErrorMessage } from '../../common/FieldErrorMessage';
import { Button } from '../../ui/button';
import { Field, FieldGroup, FieldLabel } from '../../ui/field';
import { Input } from '../../ui/input';
import { Spinner } from '../../ui/spinner';

import {
  CreatePatientInput,
  patientSchema,
} from '@/core/domain/validation/schemas/patient.schema';

interface PatientFormProps {
  className?: string;
}

export function PatientForm({ className }: PatientFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
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
    mutationFn: (input: CreatePatientInput) => signInUser(input as any),
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
          <FieldLabel htmlFor="socialName">Nome social</FieldLabel>
          <Input
            {...register('socialName')}
            name="socialName"
            placeholder="Insira o nome social (opcional)"
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
          <FieldLabel htmlFor="race">Raça</FieldLabel>
          <Input
            {...register('race')}
            name="race"
            placeholder="Insira a raça"
            aria-invalid={!!formErrors.race}
          />
          {formErrors.race && (
            <FieldErrorMessage message={formErrors.race.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="sex">Sexo</FieldLabel>
          <Input
            {...register('sex')}
            name="sex"
            placeholder="Insira o sexo"
            aria-invalid={!!formErrors.sex}
          />
          {formErrors.sex && (
            <FieldErrorMessage message={formErrors.sex.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="gender">Gênero</FieldLabel>
          <Input
            {...register('gender')}
            name="gender"
            placeholder="Insira o gênero"
            aria-invalid={!!formErrors.gender}
          />
          {formErrors.gender && (
            <FieldErrorMessage message={formErrors.gender.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="sexuality">Sexualidade</FieldLabel>
          <Input
            {...register('sexuality')}
            name="sexuality"
            placeholder="Insira a sexualidade"
            aria-invalid={!!formErrors.sexuality}
          />
          {formErrors.sexuality && (
            <FieldErrorMessage message={formErrors.sexuality.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="nationality">Nacionalidade</FieldLabel>
          <Input
            {...register('nationality')}
            name="nationality"
            placeholder="Insira a nacionalidade"
            aria-invalid={!!formErrors.nationality}
          />
          {formErrors.nationality && (
            <FieldErrorMessage message={formErrors.nationality.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="schooling">Escolaridade</FieldLabel>
          <Input
            {...register('schooling')}
            name="schooling"
            placeholder="Insira a escolaridade"
            aria-invalid={!!formErrors.schooling}
          />
          {formErrors.schooling && (
            <FieldErrorMessage message={formErrors.schooling.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Telefone</FieldLabel>
          <Input
            {...register('phone')}
            name="phone"
            placeholder="Insira o telefone (opcional)"
            aria-invalid={!!formErrors.phone}
          />
          {formErrors.phone && (
            <FieldErrorMessage message={formErrors.phone.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input
            {...register('email')}
            name="email"
            placeholder="Insira o e-mail (opcional)"
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
          <FieldLabel htmlFor="fatherName">Nome do pai</FieldLabel>
          <Input
            {...register('fatherName')}
            name="fatherName"
            placeholder="Insira o nome do pai (opcional)"
            aria-invalid={!!formErrors.fatherName}
          />
          {formErrors.fatherName && (
            <FieldErrorMessage message={formErrors.fatherName.message} />
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="isDeceased">Falecido</FieldLabel>
          <Input
            {...register('isDeceased')}
            name="isDeceased"
            type="checkbox"
            aria-invalid={!!formErrors.isDeceased}
          />
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
          <FieldLabel htmlFor="zipCode">CEP</FieldLabel>
          <Input
            {...register('zipCode')}
            name="zipCode"
            placeholder="Insira o CEP (opcional)"
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
          <FieldLabel htmlFor="complement">Complemento</FieldLabel>
          <Input
            {...register('complement')}
            name="complement"
            placeholder="Insira o complemento (opcional)"
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
