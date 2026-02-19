import { ArrowLeft, CircleAlert, CircleCheckBig } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import { LockSection } from '@/app/components/features/auth/LockSection';
import { PasswordResetForm } from '@/app/components/features/auth/PasswordResetForm';
import { RequestPasswordResetForm } from '@/app/components/features/auth/RequestPasswordResetForm';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { makeValidatePasswordResetTokenUseCase } from '@/core/infrastructure/factories/user.factory';

type RecoveryVariant =
  | 'new-password-request'
  | 'generated-link'
  | 'expired-link'
  | 'password-reset';

interface PasswordRecoveryPageProps {
  searchParams: Promise<{
    token?: string;
    variant?: string;
    email?: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Página de recuperação de senha',
  description: '',
};

export default async function PasswordRecoveryPage({
  searchParams,
}: PasswordRecoveryPageProps) {
  const {
    token,
    variant: queryVariant,
    email: queryEmail,
  } = await searchParams;

  let variant: RecoveryVariant = 'new-password-request';
  let email = queryEmail;

  if (queryVariant === 'success') {
    variant = 'generated-link';
  } else if (queryVariant === 'expired') {
    variant = 'expired-link';
  } else if (token) {
    // If a token is provided, validate it before rendering the reset form.
    const resetTokenValidator = makeValidatePasswordResetTokenUseCase();
    const { isValid, email: tokenEmail } = await resetTokenValidator.execute({
      token,
    });

    if (isValid) {
      variant = 'password-reset';
      email = tokenEmail;
    } else {
      variant = 'expired-link';
    }
  }

  return (
    <Card className="flex md:flex-row flex-col items-stretch gap-0 my-auto p-0 w-full max-w-md md:max-w-4xl">
      <div className="flex flex-col gap-y-4 p-6 sm:p-12 w-full">
        {variant === 'new-password-request' && (
          <>
            <div className="flex flex-col gap-y-2">
              <p className="font-bold text-2xl">Esqueceu a senha?</p>
              <p className="text-gray-500 text-sm">
                Não se preocupe, acontece. Digite seu e-mail abaixo para receber
                as instruções de recuperação.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <RequestPasswordResetForm className="flex flex-col gap-y-6" />
              <Button
                variant="link"
                className="p-0 w-min cursor-pointer select-none"
                tabIndex={-1}
              >
                <Link
                  href="/auth/sign-in"
                  className="flex items-center gap-x-1"
                >
                  <ArrowLeft />
                  <span>Voltar para o login</span>
                </Link>
              </Button>
            </div>
          </>
        )}

        {variant === 'password-reset' && (
          <>
            <div className="flex flex-col gap-y-2">
              <p className="font-bold text-2xl">Criar nova senha</p>
              <p className="text-gray-500 text-sm">
                Sua nova senha deve ser diferente das senhas utilizadas
                anteriormente.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <PasswordResetForm />
              <Button
                variant="link"
                className="p-0 w-min cursor-pointer select-none"
              >
                <Link
                  href="/auth/sign-in"
                  className="flex items-center gap-x-1"
                >
                  <ArrowLeft />
                  <span>Voltar para o login</span>
                </Link>
              </Button>
            </div>
          </>
        )}

        {variant === 'generated-link' && (
          <>
            <div className="bg-green-100 p-6 border-2 border-green-600 rounded-full w-min">
              <CircleCheckBig size={32} className="text-green-600" />
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="font-bold text-2xl">Verifique o seu e-mail</p>
              <p className="text-sm">
                Enviamos um link de recuperação para{' '}
                <strong>{email || 'seu e-mail'}</strong>.
              </p>
              <p className="text-sm">
                Não recebeu? Verifique sua caixa de spam ou tente novamente.
              </p>
            </div>
            <Button className="w-full cursor-pointer select-none">
              <Link href="/auth/sign-in">Voltar para o login</Link>
            </Button>
          </>
        )}

        {variant === 'expired-link' && (
          <>
            <div className="bg-red-100 p-6 border-2 border-red-600 rounded-full w-min">
              <CircleAlert size={32} className="text-red-600" />
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="font-bold text-2xl">Link expirado</p>
              <p className="text-sm">
                O link de recuperação perdeu a validade ou já foi utilizado. Por
                favor, solicite uma nova troca de senha.
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <form>
                <Link
                  href="/auth/password-recovery?variant=new-password-request"
                  className="rounded-md"
                >
                  <Button
                    size="lg"
                    className="w-full cursor-pointer select-none"
                    tabIndex={-1}
                  >
                    Solicitar novamente
                  </Button>
                </Link>
              </form>
              <Button
                variant="link"
                className="p-0 w-min cursor-pointer select-none"
              >
                <Link
                  href="/auth/sign-in"
                  className="flex items-center gap-x-1"
                >
                  <ArrowLeft />
                  <span>Voltar para o login</span>
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
      <Separator orientation="vertical" className="hidden md:flex gap-0" />
      <LockSection className="p-6 md:p-12" />
    </Card>
  );
}
